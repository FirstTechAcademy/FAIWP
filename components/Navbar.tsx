'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, Menu, X, ChevronDown, Sparkles, BookOpen, Briefcase, Users, LayoutDashboard, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Learn', href: '/learning', icon: BookOpen },
  { label: 'Jobs', href: '/jobs', icon: Briefcase },
  { label: 'Mentors', href: '/mentorship', icon: Users },
  { label: 'AI Coach', href: '/ai-coach', icon: Sparkles },
];

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dashboardHref = profile?.role === 'employer' ? '/employer' : profile?.role === 'admin' ? '/admin' : '/dashboard';

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/images/FIRSTTECH-removebg-preview_(2).png"
              alt="FirstTech"
              width={36}
              height={36}
              className="object-contain"
            />
            <span className={cn(
              'font-bold text-lg hidden sm:block transition-colors',
              scrolled ? 'text-foreground' : 'text-white'
            )}>
              FirstTech
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  scrolled ? 'text-foreground/70 hover:text-foreground hover:bg-muted' : 'text-white/80 hover:text-white hover:bg-white/10'
                )}>
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                scrolled ? 'text-foreground/70 hover:text-foreground hover:bg-muted' : 'text-white/80 hover:text-white hover:bg-white/10'
              )}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/10 transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={profile?.avatar_url ?? ''} />
                      <AvatarFallback className="bg-primary text-white text-xs">
                        {profile?.full_name?.charAt(0) ?? user.email?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className={cn('w-3 h-3', scrolled ? 'text-foreground/60' : 'text-white/60')} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{profile?.full_name ?? 'User'}</p>
                    <p className="text-xs text-muted-foreground capitalize">{profile?.role ?? 'student'}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={dashboardHref} className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className={cn(scrolled ? '' : 'text-white hover:bg-white/10')}>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              className={cn('md:hidden p-2 rounded-lg transition-colors', scrolled ? 'text-foreground' : 'text-white')}
              onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border pb-4">
            {navLinks.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors">
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
            {!user && (
              <div className="px-4 pt-3 flex flex-col gap-2">
                <Button variant="outline" asChild><Link href="/auth/login">Sign In</Link></Button>
                <Button asChild><Link href="/auth/register">Get Started Free</Link></Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
