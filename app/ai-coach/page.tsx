'use client';

import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Sparkles, Bot, User, RefreshCw, Lightbulb } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `Hello! I am your AI Career Coach, powered by FirstTech FAIWP. I am here to help you navigate your career journey.

Here is what I can help you with:
- **Career path recommendations** based on your interests and skills
- **Skill gap analysis** — what you need to learn to reach your goal
- **Resume and interview tips** tailored to your target role
- **Learning roadmap** — step-by-step guide to your dream job
- **Job market insights** for the African tech industry

To get started, tell me a bit about yourself: What are your interests, current skills, and career goals?`,
  timestamp: new Date(),
};

const QUICK_PROMPTS = [
  'What career paths suit a Python developer?',
  'How do I break into data science?',
  'What skills do I need for UX design?',
  'Help me prepare for a tech interview',
  'What are the highest paying tech jobs in Africa?',
  'How do I build a portfolio as a developer?',
];

const AI_RESPONSES: Record<string, string> = {
  default: `That is a great question! Based on what you have shared, here is my guidance:

**Key Recommendations:**
1. Start with foundational skills in your area of interest
2. Build 2-3 portfolio projects that demonstrate real-world problem solving
3. Earn at least one industry-recognized certificate (e.g., AWS, Google, Meta)
4. Network actively — attend local tech meetups and engage on LinkedIn
5. Apply to internships first to gain hands-on experience

**Estimated Timeline:** 4-6 months to job-ready with consistent effort (8-10 hrs/week)

Would you like me to create a personalized learning roadmap for a specific career track?`,
  python: `**Python Career Paths — Excellent Choice!**

Python is one of the most versatile languages. Here are your top career options:

1. **Data Scientist / Analyst** — Average salary: $45-80K+
   - Learn: pandas, numpy, matplotlib, scikit-learn
   - Courses: "Python for Data Science & AI" on FAIWP

2. **Backend Developer** — Average salary: $40-75K+
   - Learn: Django, FastAPI, REST APIs, PostgreSQL
   
3. **Machine Learning Engineer** — Average salary: $60-100K+
   - Learn: TensorFlow, PyTorch, MLOps
   
4. **DevOps / Automation** — Average salary: $45-80K+
   - Learn: scripting, CI/CD, infrastructure automation

**Your Next Step:** Enroll in our "Python for Data Science & AI" course — it is free!`,
  data: `**Breaking Into Data Science — Here's Your Roadmap:**

**Phase 1 (Months 1-2): Foundations**
- Python programming (pandas, numpy)
- Statistics and probability basics
- SQL for data querying

**Phase 2 (Months 3-4): Core Skills**
- Data visualization (matplotlib, seaborn, Tableau)
- Machine learning fundamentals (scikit-learn)
- Exploratory data analysis

**Phase 3 (Months 5-6): Specialization**
- Deep learning basics (TensorFlow/PyTorch)
- Build 3 portfolio projects
- Kaggle competitions for real experience

**Certificates to Earn:**
- Google Data Analytics Certificate
- IBM Data Science Professional Certificate
- AWS Cloud Practitioner (for MLOps)

Start with our free "Python for Data Science & AI" course on FAIWP today!`,
  ux: `**Breaking Into UX Design — Your Career Roadmap:**

**Skills You Need:**
- Design thinking and user research
- Wireframing and prototyping (Figma — industry standard)
- Usability testing methods
- Visual design fundamentals
- Understanding of accessibility (WCAG)

**Portfolio Projects to Build:**
1. Redesign a popular African app (show before/after)
2. End-to-end case study for a fintech app
3. Mobile app for a local small business

**Tools to Master:**
- Figma (primary tool)
- FigJam (ideation)
- Maze or UserTesting (research)
- Hotjar (analytics)

**Timeline:** 3-4 months to your first UX role with dedication.

Start with our free "UI/UX Design Fundamentals" course on FAIWP!`,
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('python')) return AI_RESPONSES.python;
  if (lower.includes('data science') || lower.includes('data analyst')) return AI_RESPONSES.data;
  if (lower.includes('ux') || lower.includes('design') || lower.includes('ui')) return AI_RESPONSES.ux;
  return AI_RESPONSES.default;
}

export default function AICoachPage() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text ?? input.trim();
    if (!content) return;
    setInput('');
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 800));
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getAIResponse(content),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-semibold text-foreground mt-2">{line.slice(2, -2)}</p>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-4 list-disc text-foreground/80">{formatInline(line.slice(2))}</li>;
      }
      if (/^\d+\./.test(line)) {
        return <li key={i} className="ml-4 list-decimal text-foreground/80">{formatInline(line.replace(/^\d+\.\s*/, ''))}</li>;
      }
      if (line === '') return <div key={i} className="h-1" />;
      return <p key={i} className="text-foreground/80">{formatInline(line)}</p>;
    });
  };

  const formatInline = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((p, i) => i % 2 === 1 ? <strong key={i} className="font-semibold text-foreground">{p}</strong> : p);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-border bg-card/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">AI Career Coach</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs text-muted-foreground">Online &mdash; Powered by FirstTech AI</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setMessages([WELCOME_MESSAGE])}>
              <RefreshCw className="w-4 h-4 mr-1.5" /> New Chat
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map(msg => (
            <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className={msg.role === 'assistant' ? 'bg-primary text-white' : 'bg-muted'}>
                  {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              <div className={cn(
                'max-w-[75%] rounded-2xl p-4 text-sm space-y-0.5',
                msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-card border border-border rounded-tl-sm'
              )}>
                {msg.role === 'assistant' ? (
                  <div className="space-y-1">{formatContent(msg.content)}</div>
                ) : (
                  <p>{msg.content}</p>
                )}
                <p className={cn('text-xs mt-2', msg.role === 'user' ? 'text-white/60' : 'text-muted-foreground')}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-white"><Bot className="w-4 h-4" /></AvatarFallback>
              </Avatar>
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm p-4">
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" /> Suggested questions
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map(p => (
                <button key={p} onClick={() => sendMessage(p)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-colors">
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border bg-card/50">
          <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex items-center gap-2">
            <Input
              value={input} onChange={e => setInput(e.target.value)}
              placeholder="Ask your AI career coach anything..."
              className="flex-1 h-11"
              disabled={loading}
            />
            <Button type="submit" size="icon" className="h-11 w-11 flex-shrink-0" disabled={loading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
