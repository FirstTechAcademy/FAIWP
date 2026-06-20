'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';

export default function PostJobPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', type: 'full-time', location: '', is_remote: false,
    salary_min: '', salary_max: '', experience_level: 'entry', deadline: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) { setSkills(prev => [...prev, s]); setSkillInput(''); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    let { data: emp } = await supabase.from('employers').select('id').eq('user_id', user.id).maybeSingle();
    if (!emp) {
      const { data: newEmp } = await supabase.from('employers').insert({ user_id: user.id, company_name: 'My Company' }).select().maybeSingle();
      emp = newEmp;
    }
    if (!emp) { toast.error('Failed to get employer profile'); setLoading(false); return; }
    const { error } = await supabase.from('jobs').insert({
      employer_id: emp.id,
      title: form.title,
      description: form.description,
      type: form.type,
      location: form.location || null,
      is_remote: form.is_remote,
      salary_min: form.salary_min ? parseInt(form.salary_min) : null,
      salary_max: form.salary_max ? parseInt(form.salary_max) : null,
      experience_level: form.experience_level,
      required_skills: skills,
      deadline: form.deadline || null,
    });
    setLoading(false);
    if (error) { toast.error('Failed to post job'); }
    else { toast.success('Job posted successfully!'); router.push('/employer'); }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/employer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Post a New Job</h1>
          <p className="text-muted-foreground mt-1">Reach thousands of qualified young professionals.</p>
        </div>

        <form onSubmit={submit}>
          <Card>
            <CardHeader><CardTitle className="text-base">Job Details</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label>Job Title *</Label>
                <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  placeholder="e.g. Frontend Developer Intern" required className="mt-1.5" />
              </div>
              <div>
                <Label>Description *</Label>
                <Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="Describe the role, responsibilities, and what you're looking for..." required className="mt-1.5 min-h-[140px]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Job Type</Label>
                  <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['full-time','part-time','internship','contract','freelance'].map(t => (
                        <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Experience Level</Label>
                  <Select value={form.experience_level} onValueChange={v => setForm({...form, experience_level: v})}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['entry','junior','mid','senior'].map(l => (
                        <SelectItem key={l} value={l} className="capitalize">{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Location</Label>
                <Input value={form.location} onChange={e => setForm({...form, location: e.target.value})}
                  placeholder="e.g. Lagos, Nigeria" className="mt-1.5" />
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.is_remote} onCheckedChange={v => setForm({...form, is_remote: v})} />
                <Label className="cursor-pointer">Remote / Hybrid allowed</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Min Salary (USD/yr)</Label>
                  <Input type="number" value={form.salary_min} onChange={e => setForm({...form, salary_min: e.target.value})}
                    placeholder="e.g. 20000" className="mt-1.5" />
                </div>
                <div>
                  <Label>Max Salary (USD/yr)</Label>
                  <Input type="number" value={form.salary_max} onChange={e => setForm({...form, salary_max: e.target.value})}
                    placeholder="e.g. 40000" className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label>Required Skills</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Type a skill and press Enter" />
                  <Button type="button" variant="outline" onClick={addSkill}><Plus className="w-4 h-4" /></Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map(s => (
                      <span key={s} className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-lg">
                        {s}
                        <button type="button" onClick={() => setSkills(skills.filter(x => x !== s))}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label>Application Deadline</Label>
                <Input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})}
                  className="mt-1.5" min={new Date().toISOString().split('T')[0]} />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full mt-6 h-11" disabled={loading}>
            {loading ? 'Posting...' : 'Post Job'}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
