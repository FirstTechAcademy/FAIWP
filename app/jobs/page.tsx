'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Job } from '@/lib/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Clock, Briefcase, DollarSign, Building2, Filter, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const jobTypes = ['All', 'full-time', 'part-time', 'internship', 'contract', 'freelance'];
const levels = ['All Levels', 'entry', 'junior', 'mid', 'senior'];

export default function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filtered, setFiltered] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [level, setLevel] = useState('All Levels');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    supabase.from('jobs').select('*, employer:employers(*)').eq('is_active', true).order('created_at', { ascending: false })
      .then(({ data }) => { setJobs(data ?? []); setFiltered(data ?? []); setLoading(false); });
  }, []);

  useEffect(() => {
    let result = jobs;
    if (search) result = result.filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || j.description?.toLowerCase().includes(search.toLowerCase()));
    if (type !== 'All') result = result.filter(j => j.type === type);
    if (level !== 'All Levels') result = result.filter(j => j.experience_level === level);
    setFiltered(result);
  }, [search, type, level, jobs]);

  const apply = async () => {
    if (!user || !applyJob) { toast.error('Please sign in to apply'); return; }
    setApplying(true);
    const { error } = await supabase.from('applications').insert({ user_id: user.id, job_id: applyJob.id, cover_letter: coverLetter });
    setApplying(false);
    if (error && error.code !== '23505') { toast.error('Application failed'); }
    else if (error?.code === '23505') { toast.info('You have already applied'); }
    else { toast.success('Application submitted!'); setApplyJob(null); setCoverLetter(''); }
  };

  const typeColors: Record<string, string> = {
    internship: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'full-time': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'part-time': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    contract: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    freelance: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="gradient-hero pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Jobs & Internships</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
              Discover opportunities matched to your skills and career goals.
            </p>
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs..."
                className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {jobTypes.map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${type === t ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                {t}
              </button>
            ))}
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                {levels.map(l => <SelectItem key={l} value={l} className="capitalize">{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <p className="text-muted-foreground text-sm mb-6">{filtered.length} opportunities found</p>

          {loading ? (
            <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />)}</div>
          ) : (
            <div className="space-y-4">
              {filtered.map(job => (
                <div key={job.id}
                  className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedJob(job)}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{job.title}</h3>
                        <p className="text-muted-foreground text-sm mt-0.5">
                          {(job as any).employer?.company_name ?? 'Company'} &bull; {job.experience_level} level
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />{job.is_remote ? 'Remote' : (job.location ?? 'On-site')}
                          </span>
                          {job.salary_min && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <DollarSign className="w-3 h-3" />${job.salary_min.toLocaleString()}{job.salary_max ? ` - $${job.salary_max.toLocaleString()}` : '+'}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />{formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        {job.required_skills && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {job.required_skills.slice(0, 4).map(s => (
                              <span key={s} className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-md">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-lg capitalize ${typeColors[job.type] ?? 'bg-muted text-muted-foreground'}`}>
                        {job.type}
                      </span>
                      <Button size="sm" onClick={e => { e.stopPropagation(); setApplyJob(job); }}>
                        Apply <ArrowRight className="ml-1 w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-20">
                  <Briefcase className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No jobs match your filters.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Job detail dialog */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedJob.title}</DialogTitle>
                <DialogDescription>
                  {(selectedJob as any).employer?.company_name} &bull; {selectedJob.experience_level} level
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-lg capitalize ${typeColors[selectedJob.type]}`}>{selectedJob.type}</span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="w-4 h-4" />{selectedJob.is_remote ? 'Remote' : selectedJob.location}</span>
                  {selectedJob.salary_min && <span className="flex items-center gap-1 text-sm text-muted-foreground"><DollarSign className="w-4 h-4" />${selectedJob.salary_min.toLocaleString()}{selectedJob.salary_max ? ` - $${selectedJob.salary_max.toLocaleString()}` : '+'}/yr</span>}
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-foreground/80">{selectedJob.description ?? 'No description provided.'}</p>
                </div>
                {selectedJob.required_skills && (
                  <div>
                    <p className="font-semibold text-sm mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.required_skills.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                    </div>
                  </div>
                )}
                <Button className="w-full" onClick={() => { setApplyJob(selectedJob); setSelectedJob(null); }}>
                  Apply for this Role
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Apply dialog */}
      <Dialog open={!!applyJob} onOpenChange={() => setApplyJob(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply for {applyJob?.title}</DialogTitle>
            <DialogDescription>Submit your application for this role.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="coverLetter">Cover Letter (optional)</Label>
              <Textarea id="coverLetter" value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
                placeholder="Tell the employer why you are a great fit..."
                className="mt-1.5 min-h-[120px]" />
            </div>
            <Button className="w-full" onClick={apply} disabled={applying}>
              {applying ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
