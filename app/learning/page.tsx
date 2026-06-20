'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Course } from '@/lib/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star, Clock, Users, BookOpen, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase as sb } from '@/lib/supabase';
import { toast } from 'sonner';

const categories = ['All', 'Web Development', 'Data Science', 'Design', 'Marketing', 'Cloud', 'Cybersecurity', 'Mobile', 'Business'];
const levels = ['All Levels', 'beginner', 'intermediate', 'advanced'];

export default function LearningPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filtered, setFiltered] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All Levels');
  const [enrolling, setEnrolling] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('courses').select('*').eq('is_published', true).order('enrolled_count', { ascending: false })
      .then(({ data }) => { setCourses(data ?? []); setFiltered(data ?? []); setLoading(false); });
  }, []);

  useEffect(() => {
    let result = courses;
    if (search) result = result.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase()));
    if (category !== 'All') result = result.filter(c => c.category === category);
    if (level !== 'All Levels') result = result.filter(c => c.level === level);
    setFiltered(result);
  }, [search, category, level, courses]);

  const enroll = async (courseId: string) => {
    if (!user) { toast.error('Please sign in to enroll'); return; }
    setEnrolling(courseId);
    const { error } = await sb.from('enrollments').insert({ user_id: user.id, course_id: courseId });
    setEnrolling(null);
    if (error && error.code !== '23505') { toast.error('Failed to enroll'); }
    else { toast.success('Enrolled successfully!'); }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="gradient-hero pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Learning Portal</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
              Build in-demand skills with project-based courses designed for Africa&apos;s digital economy.
            </p>
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/15"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" /> Filter:
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${category === cat ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground text-sm">{filtered.length} courses found</p>
          </div>

          {/* Courses Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
                  <div className="h-44 bg-muted" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-8 bg-muted rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(course => (
                <CourseCard key={course.id} course={course} onEnroll={enroll} enrolling={enrolling === course.id} />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No courses match your filters.</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSearch(''); setCategory('All'); setLevel('All Levels'); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

function CourseCard({ course, onEnroll, enrolling }: { course: Course; onEnroll: (id: string) => void; enrolling: boolean }) {
  const levelColors = { beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', intermediate: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
  return (
    <div className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="relative overflow-hidden">
        <img src={course.thumbnail_url ?? 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400'} alt={course.title}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className={`absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-lg ${levelColors[course.level]}`}>
          {course.level}
        </div>
        {course.price === 0 && (
          <div className="absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-lg bg-accent text-white">FREE</div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <Badge variant="secondary" className="text-xs w-fit mb-2">{course.category}</Badge>
        <h3 className="font-semibold text-foreground text-sm mb-2 line-clamp-2 flex-1">{course.title}</h3>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{course.rating.toFixed(1)}</span>
          </div>
          <span className="text-muted-foreground text-xs">({course.enrolled_count.toLocaleString()} enrolled)</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration_hours}h</span>
          {course.instructor_name && <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.instructor_name.split(' ')[0]}</span>}
        </div>
        <Button size="sm" className="w-full" onClick={() => onEnroll(course.id)} disabled={enrolling}>
          {enrolling ? 'Enrolling...' : 'Enroll Free'}
        </Button>
      </div>
    </div>
  );
}
