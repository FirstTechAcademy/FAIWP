'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Eye, EyeOff, Loader2, ArrowLeft, GraduationCap, Users, Building2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const roles = [
  { value: 'student', label: 'Student / Talent', description: 'Learn skills & find opportunities', icon: GraduationCap },
  { value: 'mentor', label: 'Mentor', description: 'Guide and inspire young talent', icon: Users },
  { value: 'employer', label: 'Employer', description: 'Find and hire skilled youth', icon: Building2 },
];

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, fullName, role);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Account created! Welcome to FAIWP.');
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 gradient-hero items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-primary/30 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center text-white px-12">
          <Image src="/images/FIRSTTECH-removebg-preview_(2).png" alt="FirstTech" width={80} height={80} className="mx-auto mb-6 object-contain" />
          <h2 className="text-3xl font-bold mb-4">Join 15,000+ Young Professionals</h2>
          <p className="text-white/70 text-lg">Build the career you deserve with AI-powered guidance and real employer connections.</p>
          <div className="mt-8 flex items-center justify-center gap-2 text-white/60 text-sm">
            <ShieldCheck className="w-4 h-4 text-accent" /> Free forever. No credit card needed.
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
            <p className="text-muted-foreground mt-2">Start your journey to career success</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="John Doe" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Input id="password" type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label className="mb-3 block">I am a...</Label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map(({ value, label, description, icon: Icon }) => (
                  <button key={value} type="button" onClick={() => setRole(value)}
                    className={cn(
                      'p-3 rounded-xl border-2 text-left transition-all',
                      role === value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
                    )}>
                    <Icon className={cn('w-5 h-5 mb-1.5', role === value ? 'text-primary' : 'text-muted-foreground')} />
                    <p className={cn('text-xs font-semibold', role === value ? 'text-primary' : 'text-foreground')}>{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{description}</p>
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {loading ? 'Creating account...' : 'Create Free Account'}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            By signing up you agree to our{' '}
            <Link href="#" className="text-primary hover:underline">Terms</Link> and{' '}
            <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
