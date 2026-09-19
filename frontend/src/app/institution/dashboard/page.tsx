"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface AnalyticsData {
  totalStudents: number;
  assessedStudents: number;
  assessmentCompletionRate: number;
  avgReadiness: number;
  skillResultsCount: number;
  topSkillGaps: Array<{ count: number; name: string }>;
  verifiedSkills: number;
  activeOpportunities: number;
}

interface InstitutionStudent {
  id: string;
  name: string;
  email: string;
  assessed: boolean;
  readiness: number;
  verifiedSkills: number;
  skillGaps: number;
}

export default function InstitutionDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<InstitutionStudent[]>([]);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'institution')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/institution');
        setData(res.data.data);
        const studentsRes = await api.get('/institution/students');
        setStudents(studentsRes.data.data);
      } catch (error) {
        console.error("Failed to fetch institution analytics", error);
      } finally {
        setLoading(false);
      }
    };
    if (user && user.role === 'institution') {
      fetchAnalytics();
    }
  }, [user]);

  if (authLoading || loading) {
    return <div className="p-8 text-center text-text-secondary">Loading Institution Analytics...</div>;
  }

  if (!data) return null;

  return (
    <div className="mx-auto max-w-6xl p-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-fraunces text-3xl font-bold text-text-primary">Institution Dashboard</h1>
        <p className="mt-1 text-text-secondary">Overview of student readiness and skill gaps.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-primary text-[var(--on-pine)] border-none">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--on-pine-muted)]">Avg Readiness</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-3xl font-bold">{data.avgReadiness}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Enrolled Students</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-3xl font-bold text-text-primary">{data.totalStudents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Assessed Students</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-3xl font-bold text-text-primary">{data.assessedStudents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-3xl font-bold text-text-primary">{data.assessmentCompletionRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2"><CardTitle className="text-sm font-medium text-text-secondary">Verified Skills</CardTitle></CardHeader>
          <CardContent className="p-4 pt-0"><p className="text-3xl font-bold text-text-primary">{data.verifiedSkills}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2"><CardTitle className="text-sm font-medium text-text-secondary">Active Opportunities</CardTitle></CardHeader>
          <CardContent className="p-4 pt-0"><p className="text-3xl font-bold text-text-primary">{data.activeOpportunities}</p></CardContent>
        </Card>
      </div>

      <section>
        <h2 className="font-fraunces text-xl font-semibold text-text-primary border-b border-border pb-2 mb-4">Students</h2>
        {students.length === 0 ? (
          <p className="text-sm text-text-secondary">No students are associated with this institution yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-border/30 text-text-secondary"><tr><th className="p-3">Student</th><th className="p-3">Assessment</th><th className="p-3">Readiness</th><th className="p-3">Verified</th><th className="p-3">Gaps</th></tr></thead>
              <tbody>{students.map((student) => <tr key={student.id} className="border-t border-border"><td className="p-3"><div className="font-medium">{student.name}</div><div className="text-xs text-text-secondary">{student.email}</div></td><td className="p-3">{student.assessed ? 'Assessed' : 'Not assessed'}</td><td className="p-3">{student.readiness}%</td><td className="p-3">{student.verifiedSkills}</td><td className="p-3">{student.skillGaps}</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </section>

      {/* Skill Gap Trend */}
      <div>
        <h2 className="font-fraunces text-xl font-semibold text-error-text border-b border-border pb-2 mb-4">
          Top Skill Gaps
        </h2>
        {data.topSkillGaps && data.topSkillGaps.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.topSkillGaps.map((gap, idx) => (
              <Card key={idx} className="border-l-4 border-l-[var(--rust)]">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg text-text-primary">{gap.name}</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    {gap.count} student{gap.count > 1 ? 's' : ''} need{gap.count === 1 ? 's' : ''} improvement
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-secondary">No significant skill gaps identified yet.</p>
        )}
      </div>
    </div>
  );
}
