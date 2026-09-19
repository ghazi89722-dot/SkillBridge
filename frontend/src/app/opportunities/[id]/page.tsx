"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface SkillMatch {
  skillId: {
    _id: string;
    name: string;
  };
  studentScore: number;
  requiredScore: number;
}

interface MatchResult {
  overallScore: number;
  breakdown: {
    skillCompatibility: number;
    assessmentPerformance: number;
    eligibility: number;
    relevantExperience: number;
  };
  matchedSkills: SkillMatch[];
  gapSkills: SkillMatch[];
}

interface Opportunity {
  _id: string;
  title: string;
  type: string;
  description: string;
  location: string;
  isRemote: boolean;
  industryId: {
    _id: string;
    name: string;
  };
}

export default function OpportunityDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user && user.role !== 'student') {
      router.replace(user.role === 'industry' ? '/industry/dashboard' : user.role === 'institution' ? '/institution/dashboard' : user.role === 'ministry' ? '/ministry/dashboard' : '/');
      return;
    }

    const fetchData = async () => {
      try {
        const oppRes = await api.get(`/opportunities/${id}`);
        setOpportunity(oppRes.data.data);
        
        // If logged in as student, fetch match result
        if (user && user.role === 'student') {
          const matchRes = await api.get(`/opportunities/${id}/match`);
          setMatchResult(matchRes.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id && (!user || user.role === 'student')) fetchData();
  }, [id, router, user]);

  const handleApply = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    setApplying(true);
    setApplyMessage(null);
    try {
      await api.post('/applications', { opportunityId: id });
      setApplyMessage({ type: 'success', text: 'Successfully applied for this opportunity!' });
    } catch (error: unknown) {
      const apiError = error as {
        response?: {
          data?: {
            error?: {
              message?: string;
            };
          };
        };
      };
      setApplyMessage({
        type: 'error',
        text: apiError.response?.data?.error?.message || 'Failed to apply. You might have already applied.'
      });
    } finally {
      setApplying(false);
    }
  };

  if (loading || (user && user.role !== 'student')) {
    return <div className="p-8 text-center text-text-secondary">Loading Opportunity Details...</div>;
  }

  if (!opportunity) {
    return <div className="p-8 text-center text-error-text">Opportunity not found.</div>;
  }

  return (
    <div className="mx-auto max-w-5xl p-4 py-8 space-y-8">
      {/* Opportunity Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="font-fraunces text-3xl font-bold text-primary">{opportunity.title}</h1>
          <p className="mt-2 text-lg font-medium text-text-primary">{opportunity.industryId.name}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-text-secondary">
            <span className="bg-border px-3 py-1 rounded-full capitalize">{opportunity.type}</span>
            <span className="bg-border px-3 py-1 rounded-full">{opportunity.isRemote ? 'Remote' : opportunity.location}</span>
          </div>
        </div>
        <div>
          <Button size="lg" onClick={handleApply} disabled={applying || applyMessage?.type === 'success'}>
            {applying ? 'Applying...' : (applyMessage?.type === 'success' ? 'Applied' : 'Apply Now')}
          </Button>
          {applyMessage && (
            <p className={`mt-2 text-sm text-right ${applyMessage.type === 'success' ? 'text-primary' : 'text-error-text'}`}>
              {applyMessage.text}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">About the Opportunity</h2>
            <div className="text-text-secondary whitespace-pre-wrap">{opportunity.description}</div>
          </section>
        </div>

        {/* Match Card Section */}
        <div>
          {matchResult ? (
            <Card className="border-primary/50 shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Your Readiness Match</CardTitle>
                <CardDescription>Based on your verified Skill Passport</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-fraunces font-bold text-primary">{matchResult.overallScore}%</span>
                  <span className="text-sm font-medium text-text-secondary mb-1 uppercase">Overall Match</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wide mb-2">Matched Skills</h4>
                    {matchResult.matchedSkills.length > 0 ? (
                      <ul className="space-y-2">
                        {matchResult.matchedSkills.map(ms => (
                          <li key={ms.skillId._id} className="flex justify-between text-sm">
                            <span className="text-primary font-medium">✓ {ms.skillId.name}</span>
                            <span className="text-text-secondary">{ms.studentScore}% (Req: {ms.requiredScore}%)</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-text-secondary">No verified skills meet the requirements.</p>
                    )}
                  </div>

                  {matchResult.gapSkills.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wide mb-2 mt-4">Skill Gaps</h4>
                      <ul className="space-y-2">
                        {matchResult.gapSkills.map(gs => (
                          <li key={gs.skillId._id} className="flex justify-between text-sm">
                            <span className="text-error-text font-medium">⚠ {gs.skillId.name}</span>
                            <span className="text-text-secondary">
                              {gs.studentScore !== undefined ? `${gs.studentScore}%` : 'Not Assessed'} (Req: {gs.requiredScore}%)
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            user?.role === 'student' ? (
              <Card>
                <CardContent className="p-6 text-center text-text-secondary">
                  Loading match data...
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-text-secondary">
                  Log in as a student to see your explainable match score for this opportunity.
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}
