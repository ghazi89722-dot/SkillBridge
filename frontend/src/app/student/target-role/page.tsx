"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface Role {
  _id: string;
  name: string;
  description: string;
  category?: string;
  requirements: { skillId: { _id: string; name: string }; minProficiency: number }[];
}

export default function TargetRolePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [roleId, setRoleId] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'student')) router.replace('/login');
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const roleRes = await api.get('/career-roles');
        setRoles(roleRes.data.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const saveRole = async () => {
    if (!roleId) return;
    setSaving(true);
    try {
      await api.patch('/students/target-role', { targetRoleId: roleId });
      router.push('/student/dashboard');
    } finally {
      setSaving(false);
    }
  };

  const visibleRoles = roles.filter((role) => role.name.toLowerCase().includes(search.toLowerCase()));

  if (authLoading || loading) return <div className="p-8 text-center text-text-secondary">Loading target roles...</div>;

  return (
    <div className="mx-auto max-w-4xl p-4 py-8 space-y-8">
      <div>
        <h1 className="font-fraunces text-3xl font-bold text-primary">What role are you targeting?</h1>
        <p className="mt-2 text-text-secondary">Choose a role to see the skills you have and the skills you need to improve.</p>
      </div>
      <div className="space-y-4">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search roles" className="flex h-10 w-full border border-border bg-surface px-3 py-2 text-sm" />
        <div className="grid gap-4 md:grid-cols-2">
          {visibleRoles.map((role) => (
            <Card key={role._id} onClick={() => setRoleId(role._id)} className={`cursor-pointer transition-colors ${roleId === role._id ? 'border-primary bg-primary/5' : 'hover:border-primary'}`}>
              <CardHeader><CardTitle className="text-xl">{role.name}</CardTitle><CardDescription>{role.description}</CardDescription></CardHeader>
              <CardContent><p className="text-sm text-text-secondary">{role.requirements.length} required skills</p><div className="mt-3 flex flex-wrap gap-2">{role.requirements.map((requirement) => <span key={requirement.skillId._id} className="rounded-md border border-border px-2 py-1 text-xs">{requirement.skillId.name}</span>)}</div></CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex justify-end"><Button size="lg" disabled={!roleId || saving} onClick={saveRole}>{saving ? 'Saving...' : 'Set Target Role'}</Button></div>
    </div>
  );
}
