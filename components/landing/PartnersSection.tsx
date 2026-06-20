const partners = [
  { name: 'Paystack', category: 'Fintech' },
  { name: 'Flutterwave', category: 'Payments' },
  { name: 'Andela', category: 'Tech Talent' },
  { name: 'MTN', category: 'Telecoms' },
  { name: 'Microsoft', category: 'Technology' },
  { name: 'Google', category: 'Technology' },
  { name: 'Safaricom', category: 'Telecoms' },
  { name: 'Standard Bank', category: 'Finance' },
];

export default function PartnersSection() {
  return (
    <section className="py-16 bg-background border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-2">Trusted by leading organizations</p>
          <p className="text-foreground font-semibold text-lg">Our graduates work at top companies across Africa</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
          {partners.map(({ name, category }) => (
            <div key={name} className="flex flex-col items-center justify-center p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition-all duration-200 cursor-default group">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                <span className="text-primary font-bold text-lg">{name.charAt(0)}</span>
              </div>
              <span className="text-foreground font-semibold text-xs text-center">{name}</span>
              <span className="text-muted-foreground text-xs text-center">{category}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
