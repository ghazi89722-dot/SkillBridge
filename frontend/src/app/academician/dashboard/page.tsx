"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface Collaboration {
  _id: string;
  type: string;
  title: string;
  description: string;
  status: string;
  postedById: {
    profile: {
      firstName: string;
      lastName: string;
    };
    role: string;
  };
  domainId: {
    name: string;
  };
  interestedAcademicianIds: string[];
}

export default function AcademicianDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'academician')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchCollaborations = async () => {
    try {
      const res = await api.get('/collaborations');
      setCollaborations(res.data.data);
    } catch (error) {
      console.error("Failed to fetch collaborations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'academician') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchCollaborations();
    }
  }, [user]);

  const handleExpressInterest = async (id: string) => {
    try {
      await api.post(`/collaborations/${id}/interest`);
      fetchCollaborations(); // Refresh list to show updated interest
    } catch (error) {
      console.error("Failed to express interest", error);
    }
  };

  if (authLoading || loading) {
    return <div className="p-8 text-center text-text-secondary">Loading Collaborations...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-fraunces text-3xl font-bold text-text-primary">Academician Collaboration</h1>
          <p className="mt-1 text-text-secondary">Browse and request research, FDP, or curriculum improvements.</p>
        </div>
        <Button>Post New Request</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {collaborations.length === 0 ? (
          <p className="text-text-secondary">No active collaborations found.</p>
        ) : (
          collaborations.map(collab => (
            <Card key={collab._id} className="border-border flex flex-col h-full">
              <CardHeader className="pb-2 border-b border-border">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    {collab.type.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {collab.status}
                  </span>
                </div>
                <CardTitle className="text-lg mt-2 text-text-primary leading-snug">{collab.title}</CardTitle>
                <p className="text-xs text-text-secondary mt-1">
                  Posted by: {collab.postedById?.profile?.firstName} {collab.postedById?.profile?.lastName} ({collab.postedById?.role})
                </p>
              </CardHeader>
              <CardContent className="pt-4 flex-grow text-sm text-text-secondary">
                {collab.description}
                <div className="mt-4 text-xs font-medium text-primary">
                  Domain: {collab.domainId?.name}
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-border flex justify-between items-center">
                <span className="text-xs text-text-secondary">
                  {collab.interestedAcademicianIds.length} interested
                </span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleExpressInterest(collab._id)}
                  disabled={collab.interestedAcademicianIds.includes(user!.id)}
                >
                  {collab.interestedAcademicianIds.includes(user!.id) ? 'Interest Expressed' : 'Express Interest'}
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
