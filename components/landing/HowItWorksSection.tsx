import { Brain, BookOpen, Award, Handshake } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Brain,
    title: 'Take AI Career Assessment',
    description: 'Answer questions about your interests, skills, and goals. Our AI analyzes your profile and recommends the perfect career paths.',
    color: 'from-primary to-blue-700',
  },
  {
    number: '02',
    icon: BookOpen,
    title: 'Follow Your Learning Path',
    description: 'Get a personalized roadmap with curated courses, projects, and certifications tailored to your target career.',
    color: 'from-accent to-teal-700',
  },
  {
    number: '03',
    icon: Award,
    title: 'Earn Verified Certificates',
    description: 'Complete courses and earn industry-recognized certificates that prove your skills to employers.',
    color: 'from-purple-500 to-purple-700',
  },
  {
    number: '04',
    icon: Handshake,
    title: 'Connect & Get Hired',
    description: 'Apply to matching jobs, book mentors, and get direct introductions to top employers looking for your skills.',
    color: 'from-orange-500 to-orange-700',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">The Process</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-4">
            How FAIWP Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From assessment to employment in four structured steps, powered by AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map(({ number, icon: Icon, title, description, color }, i) => (
            <div key={number} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-border to-transparent -z-0" style={{ width: 'calc(100% - 4rem)', left: 'calc(100% - 1rem)' }} />
              )}
              <div className="relative z-10 flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <span className="text-4xl font-black text-muted/30 absolute top-4 right-4">{number}</span>
                <h3 className="font-bold text-foreground mb-3 text-lg">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
