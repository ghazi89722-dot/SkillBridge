"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface Skill {
  _id: string;
  name: string;
  description: string;
  categoryId?: {
    name: string;
  };
}

interface Domain {
  _id: string;
  name: string;
  description: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading, updateDomain } = useAuth();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [domainId, setDomainId] = useState(user?.domainId || '');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [claimedSkillIds, setClaimedSkillIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const domainRes = await api.get('/domains');
        const supportedDomains = domainRes.data.data.filter((domain: Domain) =>
          ['Engineering', 'Medical / Healthcare'].includes(domain.name)
        );
        setDomains(supportedDomains);
        const selectedDomainId = user?.domainId || supportedDomains[0]?._id;
        if (selectedDomainId) {
          setDomainId(selectedDomainId);
          const skillsRes = await api.get(`/domains/${selectedDomainId}/skills`);
          setSkills(skillsRes.data.data);
          const claimedRes = await api.get(`/students/${user!.id}/skills`);
          setClaimedSkillIds(claimedRes.data.data.map((result: { skillId: { _id: string } }) => result.skillId._id));
        }
      } catch (error) {
        console.error("Failed to fetch skills", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchSkills();
    }
  }, [user]);

  const handleDomainChange = async (nextDomainId: string) => {
    setDomainId(nextDomainId);
    const skillsRes = await api.get(`/domains/${nextDomainId}/skills`);
    setSkills(skillsRes.data.data);
    setSelectedSkills([]);
  };

  const toggleSkill = (id: string) => {
    if (claimedSkillIds.includes(id)) return;
    setSelectedSkills(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleClaimSkills = async () => {
    if (selectedSkills.length === 0) return;
    setSubmitting(true);
    setError('');
    try {
      // Existing student domains are locked after signup. Only legacy accounts
      // without a domain may use onboarding to set it once.
      if (!user?.domainId) {
        const domainRes = await api.patch('/auth/domain', { domainId });
        updateDomain(domainRes.data.data.domainId);
      }
      await api.post('/students/skills/claim', { skillIds: selectedSkills });
      router.push('/student/dashboard');
    } catch (error) {
      console.error("Failed to claim skills", error);
      setError((error as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message || 'Unable to save your skills. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return <div className="p-8 text-center text-text-secondary">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl p-4 py-8">
      <div className="mb-8">
        <h1 className="font-fraunces text-3xl font-bold text-primary">Claim Your Skills</h1>
        <p className="mt-2 text-text-secondary">Select the skills you already possess. We will assess them to build your verified Skill Passport.</p>
      </div>

      {!user?.domainId && <div className="mb-8 max-w-xl space-y-2">
        <label className="text-sm font-medium" htmlFor="domain">Choose your domain</label>
        <select
          id="domain"
          value={domainId}
          onChange={(event) => handleDomainChange(event.target.value)}
          className="flex h-10 w-full border border-border bg-transparent px-3 py-2 text-sm"
        >
          {domains.map((domain) => (
            <option key={domain._id} value={domain._id}>{domain.name}</option>
          ))}
        </select>
      </div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <Card 
            key={skill._id}
          className={`cursor-pointer transition-colors hover:border-primary ${claimedSkillIds.includes(skill._id) ? 'border-primary bg-primary/5 opacity-75' : selectedSkills.includes(skill._id) ? 'border-primary bg-primary/5' : ''}`}
            onClick={() => toggleSkill(skill._id)}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{skill.name}</CardTitle>
            {claimedSkillIds.includes(skill._id) && <p className="text-xs font-medium text-primary">Already claimed</p>}
              {/* If we populated category, we could show it here */}
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <p className="text-sm text-text-secondary line-clamp-3">{skill.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button 
          size="lg" 
          disabled={selectedSkills.length === 0 || submitting}
          onClick={handleClaimSkills}
        >
          {submitting ? 'Claiming...' : `Claim ${selectedSkills.length} Skills & Continue`}
        </Button>
      </div>
      {error && <p className="mt-4 text-right text-sm text-error-text">{error}</p>}
    </div>
  );
}
