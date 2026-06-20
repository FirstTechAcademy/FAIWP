'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Briefcase, TrendingUp, Award, Building2, Activity, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const enrollmentData = [
  { month: 'Jan', students: 420 }, { month: 'Feb', students: 580 }, { month: 'Mar', students: 720 },
  { month: 'Apr', students: 890 }, { month: 'May', students: 1050 }, { month: 'Jun', students: 1280 },
];

const jobData = [
  { month: 'Jan', jobs: 45 }, { month: 'Feb', jobs: 62 }, { month: 'Mar', jobs: 78 },
  { month: 'Apr', jobs: 95 }, { month: 'May', jobs: 112 }, { month: 'Jun', jobs: 134 },
];

const categoryData = [
  { name: 'Web Dev', value: 35 }, { name: 'Data Science', value: 25 },
  { name: 'Design', value: 18 }, { name: 'Marketing', value: 12 }, { name: 'Cloud', value: 10 },
];
const COLORS = ['#2563EB', '#14B8A6', '#F59E0B', '#8B5CF6', '#EF4444'];

const stats = [
  { label: 'Total Users', value: '15,234', change: '+12%', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Active Courses', value: '128', change: '+5%', icon: BookOpen, color: 'text-accent', bg: 'bg-accent/10' },
  { label: 'Job Postings', value: '486', change: '+23%', icon: Briefcase, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { label: 'Placements', value: '2,341', change: '+18%', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
  { label: 'Certificates Issued', value: '8,920', change: '+31%', icon: Award, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { label: 'Partner Companies', value: '87', change: '+7%', icon: Building2, color: 'text-orange-500', bg: 'bg-orange-500/10' },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-6 h-6" /> Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Platform analytics and management overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map(({ label, value, change, icon: Icon, color, bg }) => (
            <Card key={label}>
              <CardContent className="p-4">
                <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-2`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="text-xl font-bold text-foreground">{value}</div>
                <div className="text-muted-foreground text-xs">{label}</div>
                <div className="text-green-500 text-xs mt-0.5 font-medium">{change} this month</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Enrollment Chart */}
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Activity className="w-4 h-4" />Monthly Enrollments</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="students" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Jobs Chart */}
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Briefcase className="w-4 h-4" />Job Postings Growth</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={jobData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="jobs" stroke="#14B8A6" strokeWidth={2} dot={{ fill: '#14B8A6', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Course Category Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Course Categories</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={categoryData} innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {categoryData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="font-medium">{d.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Recent Platform Activity</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'New user registered', user: 'Fatima Diallo', time: '2 min ago', type: 'user' },
                  { action: 'Course completed', user: 'Emmanuel Osei', time: '15 min ago', type: 'course' },
                  { action: 'Job posted by Paystack', user: 'HR Team', time: '1 hr ago', type: 'job' },
                  { action: 'Certificate issued', user: 'Kofi Mensah', time: '2 hr ago', type: 'cert' },
                  { action: 'Mentor session booked', user: 'Aisha Kamara', time: '3 hr ago', type: 'mentor' },
                  { action: 'New employer registered', user: 'Flutterwave', time: '5 hr ago', type: 'employer' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
