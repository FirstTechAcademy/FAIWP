'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, MapPin, Star, Award, Briefcase } from 'lucide-react';

const DEMO_TALENT = [
  { name: 'Kofi Mensah', role: 'Frontend Developer', skills: ['React', 'TypeScript', 'CSS'], location: 'Accra, Ghana', score: 92, certs: 3, experience: 'Entry-level', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { name: 'Amara Diallo', role: 'Data Analyst', skills: ['Python', 'SQL', 'Tableau'], location: 'Dakar, Senegal', score: 88, certs: 2, experience: 'Junior', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { name: 'Tunde Adeyemi', role: 'UX Designer', skills: ['Figma', 'UI/UX Design', 'User Research'], location: 'Lagos, Nigeria', score: 85, certs: 2, experience: 'Entry-level', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { name: 'Fatima Hassan', role: 'Backend Developer', skills: ['Node.js', 'Python', 'PostgreSQL'], location: 'Nairobi, Kenya', score: 90, certs: 4, experience: 'Junior', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { name: 'Emmanuel Osei', role: 'DevOps Engineer', skills: ['AWS', 'Docker', 'Kubernetes'], location: 'Kumasi, Ghana', score: 87, certs: 3, experience: 'Mid-level', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { name: 'Aisha Kamara', role: 'Digital Marketer', skills: ['SEO', 'Digital Marketing', 'Analytics'], location: 'Freetown, Sierra Leone', score: 82, certs: 2, experience: 'Entry-level', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100' },
];

export default function TalentSearchPage() {
  const [search, setSearch] = useState('');
  const filtered = DEMO_TALENT.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.role.toLowerCase().includes(search.toLowerCase()) ||
    t.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Search className="w-6 h-6" />Talent Search</h1>
          <p className="text-muted-foreground mt-1">Discover skilled young professionals ready to join your team.</p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, role, or skill..."
            className="pl-12 h-11" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((talent, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={talent.avatar} />
                  <AvatarFallback className="bg-primary text-white">{talent.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{talent.name}</p>
                  <p className="text-muted-foreground text-sm">{talent.role}</p>
                  <p className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{talent.location}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold">{talent.score}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">AI score</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {talent.skills.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><Award className="w-3 h-3" />{talent.certs} certs</span>
                <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{talent.experience}</span>
              </div>

              <Button size="sm" className="w-full">View Profile & Contact</Button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
