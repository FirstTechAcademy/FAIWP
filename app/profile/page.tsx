'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Linkedin, Github, Globe, MapPin, Phone } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { profile, user, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? '',
    bio: profile?.bio ?? '',
    location: profile?.location ?? '',
    phone: profile?.phone ?? '',
    linkedin_url: profile?.linkedin_url ?? '',
    github_url: profile?.github_url ?? '',
    website_url: profile?.website_url ?? '',
  });
  const [loading, setLoading] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from('profiles').update({ ...form, updated_at: new Date().toISOString() }).eq('id', user.id);
    setLoading(false);
    if (error) toast.error('Save failed');
    else { toast.success('Profile updated!'); refreshProfile(); }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
          <User className="w-6 h-6" /> My Profile
        </h1>

        <div className="grid gap-6">
          {/* Avatar card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-5">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile?.avatar_url ?? ''} />
                  <AvatarFallback className="bg-primary text-white text-2xl">
                    {profile?.full_name?.charAt(0) ?? user?.email?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{profile?.full_name ?? 'Your Name'}</h2>
                  <p className="text-muted-foreground text-sm">{user?.email}</p>
                  <Badge variant="secondary" className="mt-1 capitalize">{profile?.role ?? 'student'}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit form */}
          <form onSubmit={save}>
            <Card>
              <CardHeader><CardTitle className="text-base">Personal Information</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <Label>Full Name</Label>
                  <Input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})}
                    placeholder="Your full name" className="mt-1.5" />
                </div>
                <div>
                  <Label>Bio</Label>
                  <Textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})}
                    placeholder="Tell us about yourself, your skills, and career goals..." className="mt-1.5 min-h-[100px]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Location</Label>
                    <Input value={form.location} onChange={e => setForm({...form, location: e.target.value})}
                      placeholder="Lagos, Nigeria" className="mt-1.5" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone</Label>
                    <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                      placeholder="+234 800 000 0000" className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label className="flex items-center gap-1"><Linkedin className="w-3.5 h-3.5" /> LinkedIn</Label>
                  <Input value={form.linkedin_url} onChange={e => setForm({...form, linkedin_url: e.target.value})}
                    placeholder="https://linkedin.com/in/username" className="mt-1.5" />
                </div>
                <div>
                  <Label className="flex items-center gap-1"><Github className="w-3.5 h-3.5" /> GitHub</Label>
                  <Input value={form.github_url} onChange={e => setForm({...form, github_url: e.target.value})}
                    placeholder="https://github.com/username" className="mt-1.5" />
                </div>
                <div>
                  <Label className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Portfolio / Website</Label>
                  <Input value={form.website_url} onChange={e => setForm({...form, website_url: e.target.value})}
                    placeholder="https://yourportfolio.com" className="mt-1.5" />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Profile'}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
