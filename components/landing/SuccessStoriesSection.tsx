import { Star, Quote } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const stories = [
  {
    name: 'Aisha Kamara',
    role: 'Frontend Developer at Paystack',
    location: 'Lagos, Nigeria',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    quote: "FAIWP's AI career assessment showed me frontend development was my calling. Six months later, I landed my dream job at Paystack with a portfolio built entirely on this platform.",
    rating: 5,
    achievement: 'Hired in 6 months',
  },
  {
    name: 'Emmanuel Osei',
    role: 'Data Analyst at MTN',
    location: 'Accra, Ghana',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
    quote: "The personalized learning path and mentorship sessions were game-changers. My mentor helped me prep for interviews and now I analyze data for one of Africa's biggest telecoms.",
    rating: 5,
    achievement: 'Salary 3x previous role',
  },
  {
    name: 'Fatima Diallo',
    role: 'UX Designer at Flutterwave',
    location: 'Dakar, Senegal',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    quote: "As a non-technical background person, I was intimidated. The AI coach guided me step by step, the community kept me motivated, and now I design products used by millions.",
    rating: 5,
    achievement: 'From 0 to UX Designer',
  },
];

export default function SuccessStoriesSection() {
  return (
    <section className="py-20 bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Success Stories</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-4">
            Real People, Real Results
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of young Africans who have transformed their careers with FAIWP.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map(({ name, role, location, avatar, quote, rating, achievement }) => (
            <div key={name} className="bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <Quote className="w-8 h-8 text-primary/30" />
                <Badge variant="secondary" className="text-xs bg-accent/10 text-accent border-accent/20">
                  {achievement}
                </Badge>
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed mb-6 flex-1 italic">
                "{quote}"
              </p>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="w-11 h-11">
                  <AvatarImage src={avatar} alt={name} />
                  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground text-sm">{name}</p>
                  <p className="text-muted-foreground text-xs">{role}</p>
                  <p className="text-muted-foreground text-xs">{location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
