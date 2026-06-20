'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, Sparkles, Users, BookOpen, Briefcase, TrendingUp } from 'lucide-react';

const stats = [
  { value: '15,000+', label: 'Youth Trained', icon: Users },
  { value: '500+', label: 'Courses Available', icon: BookOpen },
  { value: '2,000+', label: 'Job Placements', icon: Briefcase },
  { value: '85%', label: 'Employment Rate', icon: TrendingUp },
];

const roles = ['Developer', 'Designer', 'Data Scientist', 'Digital Marketer', 'Cloud Engineer'];

export default function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setRoleIndex(i => (i + 1) % roles.length), 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/15 px-4 py-1.5 text-sm">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-accent" />
            AI-Powered Career Platform for African Youth
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Launch Your Career as a{' '}
            <span className="text-gradient inline-block min-w-[280px]">
              {roles[roleIndex]}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            FAIWP combines AI career coaching, in-demand skills training, mentorship, and direct employer connections to get you job-ready faster than ever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-white px-8 h-12 text-base shadow-lg shadow-primary/30">
              <Link href="/auth/register">
                Start Your Journey Free <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 h-12 text-base bg-transparent">
              <Play className="mr-2 w-4 h-4 fill-current" /> Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="glass rounded-2xl p-4 sm:p-6">
                <Icon className="w-5 h-5 text-accent mb-2 mx-auto" />
                <div className="text-2xl sm:text-3xl font-bold text-white">{value}</div>
                <div className="text-white/60 text-xs sm:text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L60 69.3C120 58.7 240 37.3 360 32C480 26.7 600 37.3 720 48C840 58.7 960 69.3 1080 69.3C1200 69.3 1320 58.7 1380 53.3L1440 48V80H0Z"
            className="fill-background" />
        </svg>
      </div>
    </section>
  );
}
