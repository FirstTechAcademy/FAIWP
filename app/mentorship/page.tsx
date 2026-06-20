'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mentor } from '@/lib/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Star, Calendar, Users, Clock, Linkedin, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const DEMO_MENTORS: Mentor[] = [
  { id: '1', user_id: '', title: 'Senior Software Engineer', company: 'Google', expertise: ['JavaScript', 'React', 'System Design'], bio: 'Ex-Google engineer with 8 years building scalable web applications. Passionate about mentoring the next generation of African developers.', hourly_rate: 0, rating: 4.9, total_sessions: 127, is_available: true, avatar_url: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200', linkedin_url: '#', created_at: '' },
  { id: '2', user_id: '', title: 'Data Science Lead', company: 'MTN', expertise: ['Python', 'Machine Learning', 'Data Analysis'], bio: 'Leading data science initiatives at MTN Ghana. Previously at Microsoft Research. Love helping students break into data science.', hourly_rate: 0, rating: 4.8, total_sessions: 89, is_available: true, avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200', linkedin_url: '#', created_at: '' },
  { id: '3', user_id: '', title: 'UX Director', company: 'Flutterwave', expertise: ['UI/UX Design', 'Figma', 'User Research'], bio: 'Design director shaping products used by millions across Africa. Advocate for accessible, user-first design at scale.', hourly_rate: 0, rating: 4.7, total_sessions: 64, is_available: true, avatar_url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200', linkedin_url: '#', created_at: '' },
  { id: '4', user_id: '', title: 'DevOps Engineer', company: 'Andela', expertise: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'], bio: 'Cloud infrastructure engineer helping companies scale. Former Andela fellow turned full-time DevOps practitioner.', hourly_rate: 0, rating: 4.9, total_sessions: 55, is_available: true, avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200', linkedin_url: '#', created_at: '' },
  { id: '5', user_id: '', title: 'Product Manager', company: 'Paystack', expertise: ['Product Management', 'Agile', 'Leadership'], bio: 'PM at Paystack driving fintech product strategy. Helping PMs and aspiring PMs build better products and careers.', hourly_rate: 0, rating: 4.8, total_sessions: 78, is_available: false, avatar_url: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200', linkedin_url: '#', created_at: '' },
  { id: '6', user_id: '', title: 'Cybersecurity Analyst', company: 'Standard Bank', expertise: ['Cybersecurity', 'Ethical Hacking', 'CISSP'], bio: 'Protecting digital assets for one of Africa\'s biggest banks. Helping young people break into the cybersecurity field safely.', hourly_rate: 0, rating: 4.6, total_sessions: 42, is_available: true, avatar_url: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=200', linkedin_url: '#', created_at: '' },
];

export default function MentorshipPage() {
  const { user } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>(DEMO_MENTORS);
  const [filtered, setFiltered] = useState<Mentor[]>(DEMO_MENTORS);
  const [search, setSearch] = useState('');
  const [bookMentor, setBookMentor] = useState<Mentor | null>(null);
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    let result = mentors;
    if (search) result = result.filter(m =>
      m.title?.toLowerCase().includes(search.toLowerCase()) ||
      m.company?.toLowerCase().includes(search.toLowerCase()) ||
      m.expertise?.some(e => e.toLowerCase().includes(search.toLowerCase()))
    );
    setFiltered(result);
  }, [search, mentors]);

  const bookSession = async () => {
    if (!user) { toast.error('Please sign in to book a session'); return; }
    if (!date || !topic) { toast.error('Please fill in all fields'); return; }
    setBooking(true);
    await new Promise(r => setTimeout(r, 800));
    setBooking(false);
    toast.success('Session booked! You will receive a confirmation email.');
    setBookMentor(null);
    setTopic('');
    setDate('');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="gradient-hero pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Mentorship Hub</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
              Learn from industry professionals who have been where you want to go.
            </p>
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by expertise, role, or company..."
                className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(mentor => (
              <div key={mentor.id} className="bg-card rounded-2xl border border-border p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={mentor.avatar_url ?? ''} />
                    <AvatarFallback className="bg-primary text-white text-lg">{mentor.title?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{mentor.title}</h3>
                        <p className="text-muted-foreground text-sm">{mentor.company}</p>
                      </div>
                      {mentor.is_available ? (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs border-0">Available</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Busy</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-sm">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />{mentor.rating}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />{mentor.total_sessions} sessions
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">{mentor.bio}</p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {mentor.expertise?.slice(0, 4).map(exp => (
                    <Badge key={exp} variant="secondary" className="text-xs">{exp}</Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span className="text-sm text-accent font-medium">Free Session</span>
                  </div>
                  <Button size="sm" disabled={!mentor.is_available} onClick={() => setBookMentor(mentor)}>
                    {mentor.is_available ? 'Book Session' : 'Unavailable'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No mentors match your search.</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!bookMentor} onOpenChange={() => setBookMentor(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book a Session</DialogTitle>
            <DialogDescription>Schedule a 1-on-1 with {bookMentor?.title} at {bookMentor?.company}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Session Topic</Label>
              <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Career transition into tech" className="mt-1.5" />
            </div>
            <div>
              <Label>Preferred Date & Time</Label>
              <Input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} className="mt-1.5" min={new Date().toISOString().slice(0, 16)} />
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
              Sessions are 60 minutes and completely free.
            </div>
            <Button className="w-full" onClick={bookSession} disabled={booking}>
              {booking ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
