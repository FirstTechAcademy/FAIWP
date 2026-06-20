import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';

const benefits = [
  'Free to get started',
  'AI-personalized career path',
  'Industry-recognized certificates',
  'Direct employer connections',
];

export default function CTASection() {
  return (
    <section className="py-24 gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
          Your Future Starts Today
        </h2>
        <p className="text-white/70 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
          Join over 15,000 young Africans who are building in-demand skills and landing their dream jobs with FAIWP.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          {benefits.map(b => (
            <div key={b} className="flex items-center gap-2 text-white/80 text-sm">
              <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
              {b}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-white px-8 h-12 text-base shadow-xl shadow-primary/30">
            <Link href="/auth/register">
              Create Free Account <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild
            className="border-white/30 text-white hover:bg-white/10 px-8 h-12 text-base bg-transparent">
            <Link href="/employer">I am an Employer</Link>
          </Button>
        </div>

        <p className="text-white/40 text-sm mt-6">No credit card required. Start learning in minutes.</p>
      </div>
    </section>
  );
}
