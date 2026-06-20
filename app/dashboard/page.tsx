'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import { Course, Enrollment, Job, MentorshipSession } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  BookOpen, Briefcase, Users, Award, TrendingUp, ArrowRight,
  Sparkles, Clock, MapPin, Star
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [enrollments, setEnrollments] = useState<(Enrollment & { course: Course })[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [{ data: enrolData }, { data: jobData }, { data: sessData }] = await Promise.all([
        supabase.from('enrollments').select('*, course:courses(*)').eq('user_id', user.id).limit(3),
        supabase.from('jobs').select('*, employer:employers(*)').eq('is_active', true).limit(4),
        supabase.from('mentorship_sessions').select('*').eq('student_id', user.id).gte('scheduled_at', new Date().toISOString()).limit(2),
      ]);
      setEnrollments((enrolData ?? []) as any);
      setJobs(jobData ?? []);
      setSessions(sessData ?? []);
      setLoading(false);
    };
    load();
  }, [user]);

  const stats = [
    { label: 'Courses Enrolled', value: enrollments.length, icon: BookOpen, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Skills Acquired', value: 12, icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Certificates', value: 3, icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Career Score', value: `${profile?.career_score ?? 72}%`, icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {profile?.full_name?.split(' ')[0] ?? 'there'}!
          </h1>
          <p className="text-muted-foreground mt-1">Here is what is happening with your career journey today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label} className="border-border">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">{value}</div>
                <div className="text-muted-foreground text-xs mt-1">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Learning Progress */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Continue Learning</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/learning">View all <ArrowRight className="ml-1 w-3 h-3" /></Link>
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />)}</div>
                ) : enrollments.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">No courses yet.</p>
                    <Button size="sm" className="mt-3" asChild><Link href="/learning">Browse Courses</Link></Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrollments.map(({ id, progress, course }) => (
                      <div key={id} className="flex gap-3 items-center">
                        <img src={course.thumbnail_url ?? ''} alt={course.title}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{course.title}</p>
                          <p className="text-xs text-muted-foreground mb-1.5">{course.category} · {course.level}</p>
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="flex-1 h-1.5" />
                            <span className="text-xs text-muted-foreground flex-shrink-0">{progress}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job Opportunities */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Matched Opportunities</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/jobs">View all <ArrowRight className="ml-1 w-3 h-3" /></Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {jobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="flex items-start gap-3 p-3 rounded-xl border border-border hover:border-primary/30 transition-colors group cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium text-foreground">{job.title}</p>
                          <Badge variant={job.type === 'internship' ? 'secondary' : 'outline'} className="text-xs ml-2 flex-shrink-0">
                            {job.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{job.location ?? 'Remote'}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />{formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Career Score */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Career Match Score</h3>
                </div>
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
                      strokeDasharray={`${(72 / 100) * 251} 251`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-foreground">72</span>
                    <span className="text-xs text-muted-foreground">/ 100</span>
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground">Complete your profile and earn more certificates to improve your score.</p>
                <Button size="sm" className="w-full mt-4" asChild>
                  <Link href="/ai-coach">Get AI Advice</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4" /> Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground text-xs">No sessions scheduled.</p>
                    <Button size="sm" variant="outline" className="mt-2" asChild>
                      <Link href="/mentorship">Book a Mentor</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sessions.map(session => (
                      <div key={session.id} className="p-3 rounded-xl bg-muted">
                        <p className="text-sm font-medium text-foreground">{session.topic ?? 'Mentorship Session'}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(session.scheduled_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <Badge className="mt-1.5 text-xs capitalize" variant="outline">{session.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: 'Take Career Assessment', href: '/ai-coach', icon: Sparkles, color: 'text-primary' },
                  { label: 'Browse Courses', href: '/learning', icon: BookOpen, color: 'text-accent' },
                  { label: 'Find Internships', href: '/jobs?type=internship', icon: Briefcase, color: 'text-orange-500' },
                  { label: 'Book a Mentor', href: '/mentorship', icon: Users, color: 'text-purple-500' },
                ].map(({ label, href, icon: Icon, color }) => (
                  <Link key={href} href={href}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors group">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-sm text-foreground/80 group-hover:text-foreground">{label}</span>
                    <ArrowRight className="w-3 h-3 ml-auto text-muted-foreground/50 group-hover:text-muted-foreground" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
