"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface Application {
  _id: string;
  opportunityId: {
    _id: string;
    title: string;
    industryId: {
      name: string;
    };
  };
  status: string;
  matchResultSnapshot: {
    overallScore: number;
  };
  appliedAt: string;
}

export default function StudentApplications() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/my');
        setApplications(res.data.data);
      } catch (error) {
        console.error("Failed to fetch applications", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchApplications();
  }, [user]);

  if (authLoading || loading) {
    return <div className="p-8 text-center text-text-secondary">Loading Applications...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl p-4 py-8">
      <div className="mb-8">
        <h1 className="font-fraunces text-3xl font-bold text-primary">My Applications</h1>
        <p className="mt-2 text-text-secondary">Track the status of your internship and job applications.</p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary mb-4">You haven&apos;t applied to any opportunities yet.</p>
          <Link href="/opportunities">
            <Button>Explore Opportunities</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(app => (
            <Card key={app._id} className="flex flex-col md:flex-row md:items-center justify-between p-6">
              <div>
                <h3 className="font-bold text-lg text-text-primary">{app.opportunityId.title}</h3>
                <p className="text-sm font-medium text-text-secondary mt-1">{app.opportunityId.industryId.name}</p>
                <p className="text-xs text-text-secondary mt-2">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-6 mt-4 md:mt-0">
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide font-semibold text-text-secondary mb-1">Readiness Snapshot</p>
                  <p className="text-2xl font-bold font-fraunces text-primary">{app.matchResultSnapshot?.overallScore}%</p>
                </div>
                <div className="text-right min-w-[120px]">
                  <p className="text-xs uppercase tracking-wide font-semibold text-text-secondary mb-1">Status</p>
                  <span className="inline-block bg-border px-3 py-1 rounded-full text-sm font-medium capitalize text-text-primary">
                    {app.status.replace('_', ' ')}
                  </span>
                </div>
                <Link href={`/opportunities/${app.opportunityId._id}`}>
                  <Button variant="outline">View Posting</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
