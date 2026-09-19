"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SkillPill } from '@/components/ui/SkillPill';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface SkillResult {
  _id: string;
  skillId: {
    _id: string;
    name: string;
    description: string;
  };
  status: 'claimed' | 'assessed' | 'verified' | 'needs_improvement';
  score: number;
  verificationSource: string;
  lastAssessedAt?: string;
}

interface ResumeData {
  fileName?: string;
  contentType?: string;
  size?: number;
  uploadedAt?: string;
  hasResume?: boolean;
  url?: string;
}

interface PassportData {
  summary: {
    totalSkills: number;
    verifiedCount: number;
    inProgressCount: number;
    gapCount: number;
    readinessScore: number;
  };
  verifiedSkills: SkillResult[];
  inProgressSkills: SkillResult[];
  gapSkills: SkillResult[];
  resume?: ResumeData;
}

interface LearningRecommendation {
  _id: string;
  title: string;
  url: string;
  type: string;
  estimatedHours: number;
}

interface TargetReadiness {
  targetRole: { id: string; title: string };
  readiness: number;
  requiredSkills: number;
  meetsRequirement: number;
  needsImprovement: number;
  notDemonstrated: number;
  skillsHave: { skillId: string; skillName: string; currentScore: number; requiredScore: number; currentStatus?: string }[];
  skillsToImprove: { skillId: string; skillName: string; currentScore: number; requiredScore: number; priority: string; currentStatus?: string }[];
  skillsNeed: { skillId: string; skillName: string; currentScore: number; requiredScore: number; priority: string; currentStatus?: string }[];
  verifiedSkills: string[];
  opportunities: { _id: string; title: string; description: string; type: string }[];
  learningResources?: (LearningRecommendation & { skillId: string })[];
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<PassportData | null>(null);
  const [loading, setLoading] = useState(true);

  const [recommendations, setRecommendations] = useState<Record<string, LearningRecommendation[]>>({});
  const [domainName, setDomainName] = useState('');
  const [targetReadiness, setTargetReadiness] = useState<TargetReadiness | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeMessage, setResumeMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchPassportAndRecommendations = async () => {
      try {
        const res = await api.get(`/students/${user!.id}/passport`);
        const passportData = res.data.data;
        setData(passportData);
        if (user?.domainId) {
          const domainRes = await api.get(`/domains/${user.domainId}`);
          setDomainName(domainRes.data.data.name);
        }
        const targetRes = await api.get('/students/target-role/readiness');
        const targetData = targetRes.data.data;
        setTargetReadiness(targetData);

        const recs: Record<string, LearningRecommendation[]> = {};
        
        if (targetData && targetData.learningResources) {
          targetData.learningResources.forEach((rec: any) => {
            if (!recs[rec.skillId]) recs[rec.skillId] = [];
            recs[rec.skillId].push(rec);
          });
          setRecommendations(recs);
        } else if (passportData.gapSkills && passportData.gapSkills.length > 0) {
          await Promise.all(
            passportData.gapSkills.map(async (sr: SkillResult) => {
              try {
                const recRes = await api.get(`/learning/recommendations?skillId=${sr.skillId._id}`);
                recs[sr.skillId._id] = recRes.data.data as LearningRecommendation[];
              } catch (error) {
                console.error('Failed to fetch recommendations for skill', sr.skillId._id, error);
              }
            })
          );
          setRecommendations(recs);
        }
      } catch (error) {
        console.error("Failed to fetch passport", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchPassportAndRecommendations();
    }
  }, [user]);

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      setResumeMessage({ type: 'error', text: 'Select a PDF resume to upload.' });
      return;
    }

    try {
      setUploadingResume(true);
      setResumeMessage(null);

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = String(reader.result ?? '').split(',')[1] || '';
          await api.post('/students/resume', {
            filename: resumeFile.name,
            contentType: resumeFile.type || 'application/pdf',
            size: resumeFile.size,
            fileData: `data:${resumeFile.type || 'application/pdf'};base64,${base64}`,
          });
          setResumeFile(null);
          setResumeMessage({ type: 'success', text: 'Resume uploaded successfully.' });
          const refreshed = await api.get(`/students/${user!.id}/passport`);
          setData(refreshed.data.data);
        } catch (error: any) {
          const message = error?.response?.data?.error?.message || 'Failed to upload resume.';
          setResumeMessage({ type: 'error', text: message });
        } finally {
          setUploadingResume(false);
        }
      };
      reader.readAsDataURL(resumeFile);
    } catch (error) {
      setUploadingResume(false);
      setResumeMessage({ type: 'error', text: 'Failed to read the selected resume.' });
    }
  };

  if (authLoading || loading) {
    return <div className="p-8 text-center text-text-secondary">Loading Passport...</div>;
  }

  if (!data) return null;

  // Derive unified gaps state
  // If targetReadiness is available, use target role gaps (skillsToImprove + skillsNeed)
  // Otherwise, fallback to the passport gap skills
  const unifiedGaps = targetReadiness
    ? [...targetReadiness.skillsToImprove, ...targetReadiness.skillsNeed].map(gap => ({
        id: gap.skillId,
        name: gap.skillName,
        score: gap.currentScore,
        status: (gap.currentStatus === 'not_demonstrated' || !gap.currentStatus ? 'needs_improvement' : gap.currentStatus) as 'claimed' | 'assessed' | 'verified' | 'needs_improvement',
        requiredScore: gap.requiredScore
      }))
    : data.gapSkills.map(sr => ({
        id: sr.skillId._id,
        name: sr.skillId.name,
        score: sr.score,
        status: sr.status as 'claimed' | 'assessed' | 'verified' | 'needs_improvement',
        requiredScore: null as number | null
      }));

  const displayGapCount = unifiedGaps.length;

  return (
    <div className="mx-auto max-w-6xl p-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-fraunces text-3xl font-bold text-primary">Digital Skill Passport</h1>
          <p className="mt-1 text-text-secondary">Your verified readiness profile, backed by evidence.</p>
          {domainName && <p className="mt-2 text-sm font-medium text-primary">{domainName} domain</p>}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-text-secondary uppercase tracking-wide">Readiness Score</p>
            <p className="font-fraunces text-4xl font-bold text-primary">{data.summary.readinessScore}%</p>
          </div>
        </div>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl text-primary">Set Your Target Role</CardTitle>
            <p className="mt-1 text-sm text-text-secondary">
              {targetReadiness ? `Your current skill readiness for ${targetReadiness.targetRole.title}` : 'Choose your target role to discover the skills you need.'}
            </p>
          </div>
          <Link href="/student/target-role"><Button variant="outline">{targetReadiness ? 'Change Role' : 'Choose Target Role'}</Button></Link>
        </CardHeader>
        {targetReadiness && (
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-4">
              <div><p className="text-3xl font-bold text-primary">{targetReadiness.readiness}%</p><p className="text-xs text-text-secondary">Role readiness</p></div>
              <div><p className="text-2xl font-semibold">{targetReadiness.meetsRequirement}</p><p className="text-xs text-text-secondary">Skills I have</p></div>
              <div><p className="text-2xl font-semibold text-secondary">{targetReadiness.needsImprovement}</p><p className="text-xs text-text-secondary">To improve</p></div>
              <div><p className="text-2xl font-semibold text-error-text">{targetReadiness.notDemonstrated}</p><p className="text-xs text-text-secondary">Need to demonstrate</p></div>
            </div>
            {(targetReadiness.skillsToImprove.length > 0 || targetReadiness.skillsNeed.length > 0) && (
              <div className="mt-5 border-t border-border pt-4">
                <p className="mb-2 font-medium">Your biggest skill gaps</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[...targetReadiness.skillsToImprove, ...targetReadiness.skillsNeed].slice(0, 5).map((skill) => (
                    <div key={skill.skillId} className="flex items-center justify-between rounded-md bg-surface px-3 py-2 text-sm">
                      <span>{skill.skillName} · {skill.priority}</span>
                      <Link href={`/student/assessment/${skill.skillId}`} className="font-medium text-primary hover:underline">Assess</Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {targetReadiness.skillsHave.length > 0 && (
              <div className="mt-4 border-t border-border pt-4 text-sm">
                <span className="font-medium">Skills you have: </span>
                {targetReadiness.skillsHave.map((skill) => skill.skillName).join(', ')}
              </div>
            )}
            <div className="mt-5 border-t border-border pt-4">
              <p className="font-medium">Opportunities for your target role</p>
              {targetReadiness.opportunities.length === 0 ? (
                <p className="mt-2 text-sm text-text-secondary">No current opportunities found for this role. Your career plan and skill analysis remain available.</p>
              ) : (
                <div className="mt-2 space-y-2">
                  {targetReadiness.opportunities.slice(0, 3).map((opportunity) => (
                    <Link key={opportunity._id} href={`/opportunities/${opportunity._id}`} className="block rounded-md bg-surface px-3 py-2 text-sm font-medium text-primary hover:underline">
                      {opportunity.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      <Card className="border-border bg-surface">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Resume</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-text-secondary">
                {data.resume?.hasResume ? `Current resume: ${data.resume.fileName}` : 'Upload a PDF resume for industry-ready opportunities.'}
              </p>
              {data.resume?.hasResume && data.resume.uploadedAt && (
                <p className="mt-1 text-xs text-text-secondary">Uploaded {new Date(data.resume.uploadedAt).toLocaleDateString()}</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {data.resume?.hasResume && data.resume.url ? (
                <a href={data.resume.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary hover:underline">
                  Preview resume
                </a>
              ) : null}
              <input
                type="file"
                accept="application/pdf"
                onChange={(event) => setResumeFile(event.target.files?.[0] ?? null)}
                className="max-w-xs text-sm text-text-secondary file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-button-text"
              />
              <Button size="sm" onClick={handleResumeUpload} disabled={!resumeFile || uploadingResume}>
                {uploadingResume ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
          {resumeMessage && (
            <p className={`text-sm ${resumeMessage.type === 'success' ? 'text-primary' : 'text-error-text'}`}>
              {resumeMessage.text}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-primary text-[var(--on-pine)] border-none">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--on-pine-muted)]">Verified</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-3xl font-bold">{data.summary.verifiedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-3xl font-bold text-secondary">{data.summary.inProgressCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Gaps</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-3xl font-bold text-error-text">{displayGapCount}</p>
          </CardContent>
        </Card>
        <Card className="flex items-center justify-center p-4">
          <Link href="/student/onboarding">
            <Button variant="outline" className="w-full">Claim More Skills</Button>
          </Link>
        </Card>
      </div>

      {/* Skills Lists */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* In Progress */}
        <div className="space-y-4">
          <h2 className="font-fraunces text-xl font-semibold text-text-primary border-b border-border pb-2">
            In Progress
          </h2>
          {data.inProgressSkills.length === 0 ? (
            <p className="text-sm text-text-secondary">No skills in progress.</p>
          ) : (
            data.inProgressSkills.map(sr => (
              <Card key={sr._id} className="border-l-4 border-l-[var(--ochre)]">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{sr.skillId.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <SkillPill status={sr.status}>
                        {sr.status === 'claimed' ? 'Claimed' : 'Assessed'}
                      </SkillPill>
                      <span className="text-xs text-text-secondary">Score: {sr.score}%</span>
                    </div>
                  </div>
                  <Link href={`/student/assessment/${sr.skillId._id}`}>
                    <Button size="sm" variant="outline">
                      {sr.status === 'assessed' ? 'Retake Assessment' : 'Take Assessment'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Verified */}
        <div className="space-y-4">
          <h2 className="font-fraunces text-xl font-semibold text-primary border-b border-border pb-2">
            Verified Skills
          </h2>
          {data.verifiedSkills.length === 0 ? (
            <p className="text-sm text-text-secondary">No verified skills yet. Complete assessments to earn them!</p>
          ) : (
            data.verifiedSkills.map(sr => (
              <Card key={sr._id} className="border-l-4 border-l-[var(--pine)] bg-primary/5">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-primary">{sr.skillId.name}</h3>
                    <div className="mt-2 flex items-center gap-2">
                      <SkillPill status="verified">Verified</SkillPill>
                      <span className="text-xs text-text-secondary">Score: {sr.score}%</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-xs text-text-secondary">
                    <div className="text-right">
                      <p>Source: {sr.verificationSource}</p>
                      {sr.lastAssessedAt && (
                        <p>{new Date(sr.lastAssessedAt).toLocaleDateString()}</p>
                      )}
                    </div>
                    <Link href={`/student/assessment/${sr.skillId._id}`}>
                      <Button size="sm" variant="outline" className="h-7 text-xs">Retake Assessment</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Gap Skills & Recommendations */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h2 className="font-fraunces text-2xl font-semibold text-error-text">
          Skill Gaps & Learning Recommendations
        </h2>
        <p className="text-sm text-text-secondary mb-4">
          These skills need improvement. Review the curated learning resources below and retake the assessment when you feel ready.
        </p>
        
        {unifiedGaps.length === 0 ? (
          <p className="text-sm text-text-secondary">No skill gaps identified.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {unifiedGaps.map(gap => (
              <Card key={gap.id} className="border-l-4 border-l-[var(--rust)] flex flex-col h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-error-text">{gap.name}</CardTitle>
                      <div className="mt-1 flex items-center gap-2">
                        <SkillPill status={gap.status}>Needs Improvement</SkillPill>
                        <span className="text-xs text-text-secondary">Latest Score: {gap.score}%</span>
                        {gap.requiredScore && (
                          <span className="text-xs text-text-secondary">Required: {gap.requiredScore}%</span>
                        )}
                      </div>
                    </div>
                    <Link href={`/student/assessment/${gap.id}`}>
                      <Button size="sm" variant="default" className="bg-[var(--rust)] hover:bg-[var(--rust)]/90">
                        Retake Assessment
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="pt-2 flex-grow bg-border/20 mt-2 mx-4 mb-4 rounded-md p-4">
                  <h4 className="text-sm font-semibold mb-3">Recommended Learning:</h4>
                  {!recommendations[gap.id] ? (
                    <p className="text-xs text-text-secondary">Loading recommendations...</p>
                  ) : recommendations[gap.id].length === 0 ? (
                    <p className="text-xs text-text-secondary">No recommendations available at this time.</p>
                  ) : (
                    <ul className="space-y-3">
                      {recommendations[gap.id].map((rec: LearningRecommendation) => (
                        <li key={rec._id} className="text-sm">
                          <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex flex-col">
                            <span className="font-medium">{rec.title}</span>
                            <span className="text-xs text-text-secondary mt-0.5 capitalize">
                              {rec.type.replace('_', ' ')} • ~{rec.estimatedHours}h
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
