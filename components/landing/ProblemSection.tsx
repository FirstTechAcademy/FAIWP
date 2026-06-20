import { AlertTriangle, TrendingDown, GraduationCap, Target } from 'lucide-react';

const problems = [
  {
    icon: TrendingDown,
    stat: '60%',
    title: 'Youth Unemployment',
    description: 'Of African youth between 15-34 are unemployed or underemployed despite having educational qualifications.',
    color: 'text-destructive',
    bg: 'bg-destructive/10',
  },
  {
    icon: GraduationCap,
    stat: '72%',
    title: 'Skills Mismatch',
    description: 'Graduates lack the practical digital skills employers need, creating a massive gap between education and industry.',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    icon: AlertTriangle,
    stat: '80%',
    title: 'No Career Guidance',
    description: 'Young people make career decisions without proper assessment or guidance, leading to poor career fit and outcomes.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: Target,
    stat: '5x',
    title: 'Harder to Get Hired',
    description: 'Without industry connections or a verifiable portfolio, youth are 5x less likely to land their first tech job.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
];

export default function ProblemSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">The Challenge</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-4">
            African Youth Deserve Better Opportunities
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The gap between education and employment is costing millions of young Africans their futures. Here is what we are solving.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map(({ icon: Icon, stat, title, description, color, bg }) => (
            <div key={title} className="group p-6 rounded-2xl border border-border bg-card card-hover">
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div className={`text-3xl font-bold ${color} mb-2`}>{stat}</div>
              <h3 className="font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-center">
          <p className="text-xl font-semibold text-foreground">
            FAIWP bridges this gap with AI-powered guidance, structured learning, and real employer connections.
          </p>
        </div>
      </div>
    </section>
  );
}
