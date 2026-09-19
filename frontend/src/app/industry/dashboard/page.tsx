"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface Opportunity {
  _id: string;
  title: string;
  type: string;
  status: string;
  industryId: {
    _id: string;
    name: string;
  };
  requiredSkills: {
    skillId: {
      name: string;
    };
    minProficiency: number;
  }[];
}

export default function IndustryDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'industry')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await api.get('/opportunities?status=open');
        // Filter for this industry user's opportunities
        const myOpps = res.data.data.filter((opp: Opportunity) => opp.industryId._id === user?.id);
        setOpportunities(myOpps);
      } catch (error) {
        console.error("Failed to fetch opportunities", error);
      } finally {
        setLoading(false);
      }
    };
    if (user && user.role === 'industry') {
      fetchOpportunities();
    }
  }, [user]);

  if (authLoading || loading) {
    return <div className="p-8 text-center text-text-secondary">Loading Dashboard...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl p-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-fraunces text-3xl font-bold text-primary">Industry Dashboard</h1>
          <p className="mt-2 text-text-secondary">Manage your posted opportunities and review ranked candidates.</p>
        </div>
        <Link href="/industry/opportunity/new">
          <Button>Post New Opportunity</Button>
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-4">Your Active Postings</h2>
        
        {opportunities.length === 0 ? (
          <Card className="text-center p-12 bg-surface/50 border-dashed border-2">
            <CardContent>
              <p className="text-text-secondary mb-4">You haven&apos;t posted any opportunities yet.</p>
              <Link href="/industry/opportunity/new">
                <Button variant="outline">Create Your First Posting</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {opportunities.map(opp => (
              <Card key={opp._id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{opp.title}</CardTitle>
                  <CardDescription className="capitalize">{opp.type} • {opp.status}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {opp.requiredSkills.map((rs, idx) => (
                        <span key={idx} className="text-xs bg-border px-2 py-1 rounded text-text-primary">
                          {rs.skillId.name} (&gt;{rs.minProficiency}%)
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border">
                  <Link href={`/industry/opportunity/${opp._id}`} className="w-full">
                    <Button className="w-full" variant="outline">View Candidates</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
