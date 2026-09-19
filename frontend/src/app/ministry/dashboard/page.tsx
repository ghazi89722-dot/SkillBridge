"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface MinistryData {
  totalStudents: number;
  totalInstitutions: number;
  totalSkillsAssessed: number;
  totalVerifiedSkills: number;
  studentsAssessed: number;
  activeOpportunities: number;
  nationalAvgReadiness: number;
  skillGapTrends: Array<{ name: string; count: number }>;
  institutionSummaries: Array<{ institutionName: string; students: number; assessed: number; averageReadiness: number }>;
}

export default function MinistryDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<MinistryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ministry')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/ministry');
        setData(res.data.data);
      } catch (error) {
        console.error("Failed to fetch ministry analytics", error);
      } finally {
        setLoading(false);
      }
    };
    if (user && user.role === 'ministry') {
      fetchAnalytics();
    }
  }, [user]);

  if (authLoading || loading) {
    return <div className="p-8 text-center text-text-secondary">Loading National Analytics...</div>;
  }

  if (!data) return null;

  return (
    <div className="mx-auto max-w-6xl p-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-fraunces text-3xl font-bold text-text-primary">Ministry Dashboard</h1>
        <p className="mt-1 text-text-secondary">National overview of skill readiness and institution participation.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-primary text-[var(--on-pine)] border-none">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--on-pine-muted)]">National Readiness</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-4xl font-bold">{data.nationalAvgReadiness}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Participating Institutions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-3xl font-bold text-text-primary">{data.totalInstitutions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Total Students</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-3xl font-bold text-text-primary">{data.totalStudents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Skills Assessed</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-3xl font-bold text-text-primary">{data.totalSkillsAssessed}</p>
          </CardContent>
        </Card>
        <Card><CardHeader className="p-4 pb-2"><CardTitle className="text-sm font-medium text-text-secondary">Assessed Students</CardTitle></CardHeader><CardContent className="p-4 pt-0"><p className="text-3xl font-bold text-text-primary">{data.studentsAssessed}</p></CardContent></Card>
        <Card><CardHeader className="p-4 pb-2"><CardTitle className="text-sm font-medium text-text-secondary">Verified Skills</CardTitle></CardHeader><CardContent className="p-4 pt-0"><p className="text-3xl font-bold text-text-primary">{data.totalVerifiedSkills}</p></CardContent></Card>
        <Card><CardHeader className="p-4 pb-2"><CardTitle className="text-sm font-medium text-text-secondary">Open Opportunities</CardTitle></CardHeader><CardContent className="p-4 pt-0"><p className="text-3xl font-bold text-text-primary">{data.activeOpportunities}</p></CardContent></Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Skill Gap Trends</CardTitle></CardHeader><CardContent className="space-y-3">{data.skillGapTrends.length ? data.skillGapTrends.map((gap) => <div key={gap.name} className="flex justify-between border-b border-border pb-2"><span>{gap.name}</span><span className="font-semibold text-error-text">{gap.count} learners</span></div>) : <p className="text-sm text-text-secondary">No aggregated gaps yet.</p>}</CardContent></Card>
        <Card><CardHeader><CardTitle>Institution Overview</CardTitle></CardHeader><CardContent className="space-y-3">{data.institutionSummaries.length ? data.institutionSummaries.map((institution) => <div key={institution.institutionName} className="border-b border-border pb-2"><div className="font-medium">{institution.institutionName}</div><div className="text-sm text-text-secondary">{institution.students} students · {institution.assessed} assessed · {institution.averageReadiness}% average readiness</div></div>) : <p className="text-sm text-text-secondary">No institution data yet.</p>}</CardContent></Card>
      </div>
    </div>
  );
}
