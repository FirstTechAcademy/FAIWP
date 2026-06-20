'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Job, Employer } from '@/lib/types';
import { Briefcase, Users, TrendingUp, Plus, Eye, Edit, Trash2, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function EmployerDashboard() {
  const { user, profile } = useAuth();
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: emp } = await supabase.from('employers').select('*').eq('user_id', user.id).maybeSingle();
      setEmployer(emp);
      if (emp) {
        const { data: jobData } = await supabase.from('jobs').select('*').eq('employer_id', emp.id).order('created_at', { ascending: false });
        setJobs(jobData ?? []);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const totalApplications = jobs.reduce((sum, j) => sum + j.application_count, 0);

  const stats = [
    { label: 'Active Jobs', value: jobs.filter(j => j.is_active).length, icon: Briefcase, color: 'text-primary' },
    { label: 'Total Applications', value: totalApplications, icon: Users, color: 'text-accent' },
    { label: 'Total Postings', value: jobs.length, icon: TrendingUp, color: 'text-yellow-500' },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {employer ? `${employer.company_name} Dashboard` : 'Employer Dashboard'}
            </h1>
            <p className="text-muted-foreground mt-1">Manage your job postings and find top talent.</p>
          </div>
          <Button asChild>
            <Link href="/employer/post"><Plus className="w-4 h-4 mr-2" />Post a Job</Link>
          </Button>
        </div>

        {!employer && !loading && (
          <Card className="mb-8 border-primary/30 bg-primary/5">
            <CardContent className="p-6 text-center">
              <p className="text-foreground font-semibold mb-2">Complete your company profile</p>
              <p className="text-muted-foreground text-sm mb-4">Set up your employer profile to start posting jobs and finding talent.</p>
              <Button asChild><Link href="/employer/profile">Set Up Company Profile</Link></Button>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{value}</div>
                    <div className="text-muted-foreground text-xs">{label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Job Listings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Job Postings</CardTitle>
            <Button size="sm" asChild><Link href="/employer/post">Add New</Link></Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />)}</div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-muted-foreground">No jobs posted yet.</p>
                <Button className="mt-4" asChild><Link href="/employer/post">Post Your First Job</Link></Button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map(job => (
                  <div key={job.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{job.title}</p>
                          <Badge variant={job.is_active ? 'default' : 'secondary'} className="text-xs">
                            {job.is_active ? 'Active' : 'Closed'}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">{job.type}</Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location ?? 'Remote'}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" />{job.application_count} applications</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost"><Edit className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
