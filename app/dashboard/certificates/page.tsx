'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import { Certificate, Course } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Download, ExternalLink, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function CertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<(Certificate & { course: Course })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from('certificates').select('*, course:courses(*)').eq('user_id', user.id)
      .then(({ data }) => { setCertificates((data ?? []) as any); setLoading(false); });
  }, [user]);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-500" /> My Certificates
          </h1>
          <p className="text-muted-foreground mt-1">Your earned certificates and credentials.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />)}
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-20">
            <Award className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No certificates yet</h3>
            <p className="text-muted-foreground text-sm mb-6">Complete courses to earn your first certificate.</p>
            <Button asChild><Link href="/learning"><BookOpen className="mr-2 w-4 h-4" />Browse Courses</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map(({ id, issued_at, course }) => (
              <div key={id} className="relative overflow-hidden rounded-2xl border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 p-6">
                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/10 rounded-full -mr-8 -mt-8" />
                <Award className="w-8 h-8 text-yellow-500 mb-3" />
                <h3 className="font-bold text-foreground text-lg mb-1">{course.title}</h3>
                <p className="text-muted-foreground text-sm mb-1">{course.category} · {course.level}</p>
                <p className="text-muted-foreground text-xs">Issued {format(new Date(issued_at), 'MMM d, yyyy')}</p>
                <div className="flex items-center gap-2 mt-4">
                  <Button size="sm" variant="outline" className="border-yellow-400/50">
                    <Download className="w-3 h-3 mr-1" /> Download
                  </Button>
                  <Button size="sm" variant="ghost">
                    <ExternalLink className="w-3 h-3 mr-1" /> Share
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
