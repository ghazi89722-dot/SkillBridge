"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student', // Defaulting to student for Phase 1
    domainId: '',
    profile: {} as { institutionId?: string },
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [institutions, setInstitutions] = useState<{ id: string; name: string }[]>([]);
  const [domains, setDomains] = useState<{ _id: string; name: string; description: string }[]>([]);

  useEffect(() => {
    const rolesRequiringDomain = ['student', 'industry', 'institution'];
    if (rolesRequiringDomain.includes(formData.role)) {
      api.get('/domains').then((res) => setDomains(res.data.data)).catch(() => setDomains([]));
    }
    if (formData.role === 'student') {
      api.get('/institution/directory').then((res) => setInstitutions(res.data.data)).catch(() => setInstitutions([]));
    }
  }, [formData.role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        login(res.data.data.token, res.data.data.user);
        if (formData.role === 'industry') {
          router.push('/industry/dashboard');
        } else if (formData.role === 'institution') {
          router.push('/institution/dashboard');
        } else if (formData.role === 'ministry') {
          router.push('/ministry/dashboard');
        } else {
          router.push('/student/onboarding'); // Redirect to onboarding
        }
      }
    } catch (err: unknown) {
      const apiError = err as {
        response?: {
          data?: {
            error?: {
              message?: string;
            };
          };
        };
      };
      setError(apiError.response?.data?.error?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Join SkillBridge to verify your readiness</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-rust/10 p-3 text-sm text-error-text">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="role">
                I am a...
              </label>
              <select
                id="role"
                name="role"
                className="flex h-10 w-full border border-border bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pine)]"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="industry">Industry Partner</option>
                <option value="institution">Institution / College</option>
                <option value="ministry">Ministry / NCISM</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="name">
                {formData.role === 'student' ? 'Full Name' : formData.role === 'industry' ? 'Contact Name' : 'Authorized Name'}
              </label>
              <Input
                id="name"
                name="name"
                placeholder={formData.role === 'student' ? 'John Doe' : 'Authorized Representative'}
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            {formData.role === 'student' && institutions.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="institutionId">Institution / College</label>
                <select
                  id="institutionId"
                  className="flex h-10 w-full border border-border bg-transparent px-3 py-2 text-sm"
                  onChange={(event) => setFormData({
                    ...formData,
                    profile: { institutionId: event.target.value },
                  })}
                >
                  <option value="">Select your institution</option>
                  {institutions.map((institution) => <option key={institution.id} value={institution.id}>{institution.name}</option>)}
                </select>
              </div>
            )}
            {['student', 'industry', 'institution'].includes(formData.role) && (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="domainId">What is your field?</label>
                <select id="domainId" name="domainId" required value={formData.domainId} onChange={handleChange} className="flex h-10 w-full border border-border bg-transparent px-3 py-2 text-sm text-input-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <option value="">Select Engineering or Medical / Healthcare</option>
                  {domains.map((domain) => <option key={domain._id} value={domain._id}>{domain.name}</option>)}
                </select>
                <p className="text-xs text-text-secondary">Your field controls the skills, assessments, careers, and opportunities you see.</p>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>
            <div className="text-center text-sm text-text-secondary">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
