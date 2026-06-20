import { Brain, Code, BarChart3, MessageSquare, Search, Trophy, FileText, Calendar } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Career Advisor',
    description: 'Get personalized career recommendations, skill gap analysis, and learning roadmaps powered by GPT-4.',
    tag: 'AI-Powered',
    tagColor: 'bg-primary/10 text-primary',
  },
  {
    icon: Code,
    title: 'Project-Based Learning',
    description: 'Learn by building real projects. Our courses are designed around industry-relevant deliverables, not just theory.',
    tag: 'Hands-On',
    tagColor: 'bg-accent/10 text-accent',
  },
  {
    icon: BarChart3,
    title: 'Skills Dashboard',
    description: 'Track your skill development with visual progress charts, career match scores, and growth analytics.',
    tag: 'Analytics',
    tagColor: 'bg-orange-500/10 text-orange-500',
  },
  {
    icon: MessageSquare,
    title: 'AI Career Coach Chat',
    description: 'Chat with your AI career coach 24/7. Get resume feedback, interview prep tips, and career advice instantly.',
    tag: 'AI Chat',
    tagColor: 'bg-primary/10 text-primary',
  },
  {
    icon: Search,
    title: 'Smart Job Matching',
    description: 'Our AI matches you with jobs and internships based on your skills, certificates, and career interests.',
    tag: 'Matching',
    tagColor: 'bg-accent/10 text-accent',
  },
  {
    icon: Trophy,
    title: 'Verified Certificates',
    description: 'Earn certificates recognized by top employers. Add them to your portfolio and LinkedIn profile instantly.',
    tag: 'Credentials',
    tagColor: 'bg-yellow-500/10 text-yellow-600',
  },
  {
    icon: FileText,
    title: 'AI Resume Builder',
    description: 'Build an ATS-optimized resume with AI suggestions. Upload your resume for instant analysis and scoring.',
    tag: 'Resume AI',
    tagColor: 'bg-primary/10 text-primary',
  },
  {
    icon: Calendar,
    title: 'Mentorship Booking',
    description: 'Book 1-on-1 sessions with industry professionals. Get guidance from people doing the job you want.',
    tag: 'Mentorship',
    tagColor: 'bg-purple-500/10 text-purple-600',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Platform Features</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A complete ecosystem of tools, resources, and connections designed to take you from zero to job-ready.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, description, tag, tagColor }) => (
            <div key={title} className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${tagColor}`}>{tag}</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-base">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
