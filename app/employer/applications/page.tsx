'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Application, Job } from '@/lib/types';
import { Users, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

type AppWithJob = Application & { job: Job };

const statusColors: Record<string, string> = {
  applied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  reviewing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  shortlisted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  hired: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<AppWithJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: emp } = await supabase.from('employers').select('id').eq('user_id', user.id).maybeSingle();
      if (!emp) { setLoading(false); return; }
      const { data: jobs } = await supabase.from('jobs').select('id').eq('employer_id', emp.id);
      if (!jobs?.length) { setLoading(false); return; }
      const jobIds = jobs.map(j => j.id);
      const { data } = await supabase.from('applications').select('*, job:jobs(*)').in('job_id', jobIds).order('created_at', { ascending: false });
      setApplications((data ?? []) as any);
      setLoading(false);
    };
    load();
  }, [user]);

  const updateStatus = async (appId: string, status: string) => {
    const { error } = await supabase.from('applications').update({ status }).eq('id', appId);
    if (!error) {
      setApplications(apps => apps.map(a => a.id === appId ? { ...a, status: status as any } : a));
      toast.success('Status updated');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
          <Users className="w-6 h-6" /> Applications
        </h1>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />)}</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground">No applications yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map(app => (
              <div key={app.id} className="p-5 rounded-2xl border border-border bg-card hover:border-primary/20 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground">{app.job?.title ?? 'Unknown Role'}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[app.status]}`}>{app.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Applied {formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}</p>
                    {app.cover_letter && (
                      <p className="text-sm text-foreground/60 mt-2 line-clamp-2 max-w-xl">{app.cover_letter}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={app.status} onValueChange={v => updateStatus(app.id, v)}>
                      <SelectTrigger className="w-36 text-xs h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['applied','reviewing','shortlisted','rejected','hired'].map(s => (
                          <SelectItem key={s} value={s} className="capitalize text-xs">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
