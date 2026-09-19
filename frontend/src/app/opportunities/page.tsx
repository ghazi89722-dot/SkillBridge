"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

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
  requiredSkills: {
    skillId: {
      _id: string;
      name: string;
    };
    minProficiency: number;
  }[];
}

export default function OpportunitiesFeed() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user && user.role !== 'student') {
      router.replace(user.role === 'industry' ? '/industry/dashboard' : user.role === 'institution' ? '/institution/dashboard' : user.role === 'ministry' ? '/ministry/dashboard' : '/');
      return;
    }
    if (authLoading || (user && user.role !== 'student')) {
      return;
    }

    const fetchOpportunities = async () => {
      try {
        const res = await api.get('/opportunities');
        setOpportunities(res.data.data);
      } catch (error) {
        console.error("Failed to fetch opportunities", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunities();
  }, [authLoading, router, user]);

  if (authLoading || (user && user.role !== 'student') || loading) {
    return <div className="p-8 text-center text-text-secondary">Loading Opportunities...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl p-4 py-8">
      <div className="mb-8">
        <h1 className="font-fraunces text-3xl font-bold text-primary">Opportunities</h1>
        <p className="mt-2 text-text-secondary">Find internships, jobs, and live projects that match your skills.</p>
      </div>

      {opportunities.length === 0 ? (
        <p className="text-text-secondary">No open opportunities found at this time.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {opportunities.map((opp) => (
            <Card key={opp._id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{opp.title}</CardTitle>
                    <CardDescription className="mt-1 font-medium text-text-primary">
                      {opp.industryId.name} • {opp.type}
                    </CardDescription>
                  </div>
                  <span className="text-xs bg-border px-2 py-1 rounded-md text-text-secondary font-medium capitalize">
                    {opp.isRemote ? 'Remote' : opp.location}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-text-secondary line-clamp-3 mb-4">{opp.description}</p>
                <div>
                  <h4 className="text-xs font-semibold text-text-primary mb-2 uppercase tracking-wide">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {opp.requiredSkills.map(rs => (
                      <span key={rs.skillId._id} className="text-xs bg-[var(--bg-background)] border border-border px-2 py-1 rounded-md text-text-secondary">
                        {rs.skillId.name} (Min: {rs.minProficiency}%)
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-border">
                <Link href={`/opportunities/${opp._id}`} className="w-full">
                  <Button className="w-full">View Match & Apply</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
