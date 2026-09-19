"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface MatchSkill {
  skillId: string;
  name: string;
  studentScore?: number;
  gap?: number;
}

interface MatchBreakdown {
  score: number;
  expected: number;
}

interface Opportunity {
  _id: string;
  title: string;
  type: string;
  isRemote?: boolean;
  location?: string;
}

interface Candidate {
  studentId: string;
  student: {
    _id?: string;
    name: string;
    email: string;
  };
  matchResult: {
    overallScore: number;
    breakdown: Record<string, MatchBreakdown>;
    matchedSkills: MatchSkill[];
    gapSkills: MatchSkill[];
  };
}

interface Application {
  _id: string;
  studentId: {
    _id: string;
  };
  status: string;
  appliedAt: string;
}

export default function IndustryOpportunityDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [resumeStatus, setResumeStatus] = useState<Record<string, { loading: boolean; error?: string; url?: string }>>({});
  
  // Feedback form state
  const [feedbackAppId, setFeedbackAppId] = useState<string | null>(null);
  const [feedbackData, setFeedbackData] = useState({
    technicalSkills: 5,
    communication: 5,
    problemSolving: 5,
    comments: ''
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'industry')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const oppRes = await api.get(`/opportunities/${id}`);
        setOpportunity(oppRes.data.data);
        
        const candRes = await api.get(`/opportunities/${id}/candidates`);
        setCandidates(candRes.data.data);

        const appRes = await api.get(`/applications/opportunity/${id}`);
        setApplications(appRes.data.data);
      } catch (error) {
        console.error("Failed to fetch opportunity data", error);
      } finally {
        setLoading(false);
      }
    };
    if (user && id) {
      fetchData();
    }
  }, [id, user]);

  const updateApplicationStatus = async (appId: string, status: string) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update candidate status");
    }
  };

  const submitFeedback = async (appId: string) => {
    try {
      await api.post('/feedback', {
        applicationId: appId,
        ratings: {
          technicalSkills: feedbackData.technicalSkills,
          communication: feedbackData.communication,
          problemSolving: feedbackData.problemSolving,
        },
        comments: feedbackData.comments,
      });
      alert('Feedback submitted successfully!');
      setFeedbackAppId(null);
      setFeedbackData({ technicalSkills: 5, communication: 5, problemSolving: 5, comments: '' });
    } catch (error) {
      console.error("Failed to submit feedback", error);
      alert("Failed to submit feedback");
    }
  };

  const loadResume = async (studentId: string) => {
    if (!id) return;

    setResumeStatus((prev) => ({
      ...prev,
      [studentId]: { loading: true }
    }));

    try {
      const response = await api.get(`/students/${studentId}/resume`, {
        params: { opportunityId: id },
        responseType: 'blob',
      });
      const contentTypeHeader = response.headers['content-type'];
      const contentType = Array.isArray(contentTypeHeader)
        ? contentTypeHeader[0]
        : typeof contentTypeHeader === 'string'
          ? contentTypeHeader
          : 'application/pdf';
      const blob = new Blob([response.data], { type: contentType });
      const url = URL.createObjectURL(blob);
      setResumeStatus((prev) => ({
        ...prev,
        [studentId]: { loading: false, url }
      }));
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || 'Resume not available for this opportunity.';
      setResumeStatus((prev) => ({
        ...prev,
        [studentId]: { loading: false, error: message }
      }));
    }
  };

  if (authLoading || loading) {
    return <div className="p-8 text-center text-text-secondary">Loading candidates...</div>;
  }

  if (!opportunity) {
    return <div className="p-8 text-center text-error-text">Opportunity not found.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="font-fraunces text-3xl font-bold text-primary">{opportunity.title}</h1>
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-text-secondary">
            <span className="bg-border px-3 py-1 rounded-full capitalize">{opportunity.type}</span>
            <span className="bg-border px-3 py-1 rounded-full">{opportunity.isRemote ? 'Remote' : opportunity.location}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide font-semibold text-text-secondary mb-1">Total Candidates</p>
          <p className="text-3xl font-fraunces font-bold text-primary">{candidates.length}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-4">Ranked Candidate Shortlist</h2>
        <p className="text-sm text-text-secondary mb-6">
          Candidates are proactively ranked by the Skill Gap Engine based on their verified skill passport matching your requirements.
        </p>

        {candidates.length === 0 ? (
          <Card className="text-center p-12 bg-surface/50 border-dashed border-2">
            <CardContent>
              <p className="text-text-secondary">No candidates matched for this opportunity yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {candidates.map((candidate, idx) => {
              const application = applications.find(a => a.studentId._id === candidate.studentId);
              
              return (
                <Card key={candidate.studentId} className={`border-l-4 ${idx < 3 ? 'border-l-[var(--pine)] bg-primary/5' : 'border-l-[var(--ochre)]'}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <h3 className="font-bold text-lg text-text-primary">{candidate.student.name}</h3>
                          {application && (
                            <span className="text-xs bg-primary text-[var(--on-pine)] px-2 py-1 rounded capitalize">
                              Applied ({new Date(application.appliedAt).toLocaleDateString()})
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary mt-1">{candidate.student.email}</p>
                        
                        <div className="mt-4">
                          <p className="text-xs font-semibold uppercase text-text-primary mb-2">Matched Requirements</p>
                          <div className="flex flex-wrap gap-2">
                            {candidate.matchResult.matchedSkills.map(ms => (
                              <span key={ms.skillId} className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded">
                                ✓ {ms.name} ({ms.studentScore}%)
                              </span>
                            ))}
                            {candidate.matchResult.gapSkills.map(gs => (
                              <span key={gs.skillId} className="text-xs bg-[var(--rust)]/10 text-error-text border border-[var(--rust)]/20 px-2 py-1 rounded">
                                ⚠ {gs.name} (Gap: {gs.gap}%)
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end min-w-[200px] border-l border-border pl-6">
                        <p className="text-xs uppercase tracking-wide font-semibold text-text-secondary mb-1">Match Score</p>
                        <p className="text-4xl font-fraunces font-bold text-primary">{candidate.matchResult.overallScore}%</p>

                        <div className="mt-4 w-full">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => loadResume(candidate.studentId)}
                            disabled={resumeStatus[candidate.studentId]?.loading}
                          >
                            {resumeStatus[candidate.studentId]?.loading ? 'Loading resume...' : 'View resume'}
                          </Button>
                          {resumeStatus[candidate.studentId]?.error && (
                            <p className="mt-2 text-xs text-error-text">{resumeStatus[candidate.studentId].error}</p>
                          )}
                        </div>
                        
                        {application && (
                          <div className="mt-6 w-full space-y-2">
                            <p className="text-xs font-semibold uppercase text-text-secondary mb-1">Status: {application.status.replace('_', ' ')}</p>
                            {application.status === 'applied' && (
                              <div className="flex gap-2">
                                <Button size="sm" className="flex-1" onClick={() => updateApplicationStatus(application._id, 'shortlisted')}>
                                  Shortlist
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1 text-error-text border-[var(--rust)] hover:bg-[var(--rust)]/10" onClick={() => updateApplicationStatus(application._id, 'rejected')}>
                                  Reject
                                </Button>
                              </div>
                            )}
                            {application.status === 'shortlisted' && (
                              <div className="flex gap-2">
                                <Button size="sm" className="flex-1" onClick={() => updateApplicationStatus(application._id, 'selected')}>
                                  Select Candidate
                                </Button>
                              </div>
                            )}
                            {application.status === 'selected' && (
                              <div className="mt-4">
                                {feedbackAppId !== application._id ? (
                                  <Button size="sm" variant="outline" className="w-full" onClick={() => setFeedbackAppId(application._id)}>
                                    Leave Feedback
                                  </Button>
                                ) : (
                                  <div className="space-y-3 p-3 bg-border/20 border border-border rounded mt-2">
                                    <h4 className="text-xs font-semibold uppercase">Post-Internship Feedback</h4>
                                    <div className="space-y-2 text-xs">
                                      <label className="block">Technical (1-10)
                                        <input type="number" min="1" max="10" className="w-full mt-1 p-1 border rounded" 
                                          value={feedbackData.technicalSkills} 
                                          onChange={e => setFeedbackData({...feedbackData, technicalSkills: parseInt(e.target.value)})} />
                                      </label>
                                      <label className="block">Communication (1-10)
                                        <input type="number" min="1" max="10" className="w-full mt-1 p-1 border rounded" 
                                          value={feedbackData.communication} 
                                          onChange={e => setFeedbackData({...feedbackData, communication: parseInt(e.target.value)})} />
                                      </label>
                                      <label className="block">Problem Solving (1-10)
                                        <input type="number" min="1" max="10" className="w-full mt-1 p-1 border rounded" 
                                          value={feedbackData.problemSolving} 
                                          onChange={e => setFeedbackData({...feedbackData, problemSolving: parseInt(e.target.value)})} />
                                      </label>
                                      <label className="block">Comments
                                        <textarea className="w-full mt-1 p-1 border rounded h-16" 
                                          value={feedbackData.comments} 
                                          onChange={e => setFeedbackData({...feedbackData, comments: e.target.value})} />
                                      </label>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                      <Button size="sm" className="flex-1 text-xs h-7" onClick={() => submitFeedback(application._id)}>Submit</Button>
                                      <Button size="sm" variant="outline" className="flex-1 text-xs h-7" onClick={() => setFeedbackAppId(null)}>Cancel</Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
