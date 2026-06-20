'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Employer } from '@/lib/types';

const sizes = ['1-10', '11-50', '51-200', '201-500', '500+'];
const industries = ['Technology', 'Fintech', 'Telecoms', 'Healthcare', 'Education', 'E-commerce', 'Media', 'Finance', 'Consulting', 'Other'];

export default function EmployerProfilePage() {
  const { user } = useAuth();
  const [employer, setEmployer] = useState<Partial<Employer>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('employers').select('*').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => { if (data) setEmployer(data); });
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const payload = { ...employer, user_id: user.id };
    const { error } = employer.id
      ? await supabase.from('employers').update(payload).eq('id', employer.id)
      : await supabase.from('employers').insert(payload);
    setLoading(false);
    if (error) toast.error('Save failed');
    else toast.success('Company profile saved!');
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Company Profile</h1>
        <form onSubmit={save}>
          <Card>
            <CardHeader><CardTitle className="text-base">Company Information</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label>Company Name *</Label>
                <Input value={employer.company_name ?? ''} onChange={e => setEmployer({...employer, company_name: e.target.value})}
                  placeholder="Acme Corp" required className="mt-1.5" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Industry</Label>
                  <Select value={employer.industry ?? ''} onValueChange={v => setEmployer({...employer, industry: v})}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>{industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Company Size</Label>
                  <Select value={employer.company_size ?? ''} onValueChange={v => setEmployer({...employer, company_size: v})}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>{sizes.map(s => <SelectItem key={s} value={s}>{s} employees</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Location</Label>
                <Input value={employer.location ?? ''} onChange={e => setEmployer({...employer, location: e.target.value})}
                  placeholder="Lagos, Nigeria" className="mt-1.5" />
              </div>
              <div>
                <Label>Website</Label>
                <Input value={employer.website_url ?? ''} onChange={e => setEmployer({...employer, website_url: e.target.value})}
                  placeholder="https://yourcompany.com" className="mt-1.5" />
              </div>
              <div>
                <Label>Company Description</Label>
                <Textarea value={employer.description ?? ''} onChange={e => setEmployer({...employer, description: e.target.value})}
                  placeholder="Tell talent about your company, culture, and mission..." className="mt-1.5 min-h-[100px]" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : 'Save Company Profile'}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
