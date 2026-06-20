import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Learning Portal', href: '/learning' },
    { label: 'Jobs & Internships', href: '/jobs' },
    { label: 'Mentorship', href: '/mentorship' },
    { label: 'AI Career Coach', href: '/ai-coach' },
  ],
  Company: [
    { label: 'About Us', href: '#about' },
    { label: 'Our Mission', href: '#mission' },
    { label: 'Partners', href: '#partners' },
    { label: 'Careers', href: '#' },
  ],
  'For Employers': [
    { label: 'Post a Job', href: '/employer' },
    { label: 'Find Talent', href: '/employer/search' },
    { label: 'Employer Dashboard', href: '/employer' },
    { label: 'Partnerships', href: '#' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Community', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/images/FIRSTTECH-removebg-preview_(2).png" alt="FirstTech" width={36} height={36} className="object-contain" />
              <span className="font-bold text-lg">FirstTech</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Empowering the next generation of African tech talent through AI-powered career guidance, skills training, and employer connections.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Github, href: '#' },
                { icon: Mail, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-semibold text-sm mb-4">{heading}</h4>
              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-white/60 text-sm hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} FirstTech. All rights reserved.
          </p>
          <p className="text-white/40 text-sm">
            Built with passion to reduce youth unemployment across Africa.
          </p>
        </div>
      </div>
    </footer>
  );
}
