"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function NewOpportunityPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [domainId, setDomainId] = useState('');
  const [domains, setDomains] = useState<{ _id: string; name: string }[]>([]);
  const [skills, setSkills] = useState<{ _id: string; name: string }[]>([]);
  const [roles, setRoles] = useState<{ _id: string; name: string; requirements: { skillId: { _id: string }; minProficiency: number }[] }[]>([]);
  const [roleId, setRoleId] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'internship',
    description: '',
    location: '',
    isRemote: false,
    durationWeeks: 12,
  });
  
  const [selectedSkills, setSelectedSkills] = useState<{ skillId: string; minProficiency: number }[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'industry')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchDomainAndSkills = async () => {
      try {
        const domainRes = await api.get('/domains');
        const supportedDomains = domainRes.data.data.filter((domain: { name: string }) =>
          ['Engineering', 'Medical / Healthcare'].includes(domain.name)
        );
        setDomains(supportedDomains);
        if (supportedDomains.length > 0) {
          const dId = supportedDomains[0]._id;
          setDomainId(dId);
          const skillsRes = await api.get(`/domains/${dId}/skills`);
          setSkills(skillsRes.data.data);
          const rolesRes = await api.get(`/career-roles?domainId=${dId}`);
          setRoles(rolesRes.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch skills", error);
      } finally {
        setLoading(false);
      }
    };
    if (user && user.role === 'industry') {
      fetchDomainAndSkills();
    }
  }, [user]);

  const handleDomainChange = async (nextDomainId: string) => {
    setDomainId(nextDomainId);
    const skillsRes = await api.get(`/domains/${nextDomainId}/skills`);
    setSkills(skillsRes.data.data);
    const rolesRes = await api.get(`/career-roles?domainId=${nextDomainId}`);
    setRoles(rolesRes.data.data);
    setRoleId('');
    setSelectedSkills([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSkills.length === 0) {
      alert("Please require at least one skill.");
      return;
    }
    
    setSubmitting(true);
    try {
      await api.post('/opportunities', {
        ...formData,
        domainId,
        roleId: roleId || undefined,
        requiredSkills: selectedSkills,
      });
      router.push('/industry/dashboard');
    } catch (error) {
      console.error("Failed to create opportunity", error);
      alert("Failed to post opportunity");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkillToggle = (skillId: string) => {
    if (selectedSkills.some(s => s.skillId === skillId)) {
      setSelectedSkills(prev => prev.filter(s => s.skillId !== skillId));
    } else {
      setSelectedSkills(prev => [...prev, { skillId, minProficiency: 50 }]);
    }
  };

  const updateSkillProficiency = (skillId: string, value: number) => {
    setSelectedSkills(prev => prev.map(s => s.skillId === skillId ? { ...s, minProficiency: value } : s));
  };

  if (authLoading || loading) return <div className="p-8 text-center text-text-secondary">Loading...</div>;

  return (
    <div className="mx-auto max-w-3xl p-4 py-8">
      <h1 className="font-fraunces text-3xl font-bold text-primary mb-6">Post New Opportunity</h1>
      <div className="mb-6 max-w-xl space-y-2">
        <label className="text-sm font-medium" htmlFor="domain">Opportunity domain</label>
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
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Career role (optional)</label>
              <select value={roleId} onChange={(event) => setRoleId(event.target.value)} className="flex h-10 w-full border border-border bg-transparent px-3 py-2 text-sm">
                <option value="">Create a custom opportunity role</option>
                {roles.map((role) => <option key={role._id} value={role._id}>{role.name}</option>)}
              </select>
              <p className="text-xs text-text-secondary">Select a catalog role to connect this opportunity with students’ career plans.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Title</label>
              <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Panchakarma Therapist Intern" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select className="flex h-10 w-full border border-border bg-transparent px-3 py-2 text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="internship">Internship</option>
                  <option value="micro_internship">Micro-internship</option>
                  <option value="job">Job</option>
                  <option value="live_project">Live Project</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (Weeks)</label>
                <Input type="number" required value={formData.durationWeeks} onChange={e => setFormData({...formData, durationWeeks: parseInt(e.target.value)})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="City, State" />
              </div>
              <div className="space-y-2 flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isRemote} onChange={e => setFormData({...formData, isRemote: e.target.checked})} />
                  <span className="text-sm font-medium">Is Remote?</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea 
                required 
                className="flex w-full border border-border bg-transparent px-3 py-2 text-sm min-h-[100px]" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Required Skills & Minimum Proficiency</h3>
              <p className="text-sm text-text-secondary mb-4">Select the skills required for this role and specify the minimum verified score expected.</p>
              
              <div className="space-y-3">
                {skills.map(skill => {
                  const isSelected = selectedSkills.some(s => s.skillId === skill._id);
                  const sel = selectedSkills.find(s => s.skillId === skill._id);
                  
                  return (
                    <div key={skill._id} className={`flex items-center justify-between p-3 border rounded-md ${isSelected ? 'border-primary bg-primary/5' : 'border-border'}`}>
                      <label className="flex items-center gap-3 cursor-pointer flex-1">
                        <input type="checkbox" checked={isSelected} onChange={() => handleSkillToggle(skill._id)} />
                        <span className="font-medium text-sm">{skill.name}</span>
                      </label>
                      
                      {isSelected && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-text-secondary">Min Score:</span>
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            className="w-20 h-8" 
                            value={sel?.minProficiency} 
                            onChange={e => updateSkillProficiency(skill._id, parseInt(e.target.value))} 
                          />
                          <span className="text-xs font-medium">%</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-[var(--bg-background)]">
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Posting...' : 'Post Opportunity'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
