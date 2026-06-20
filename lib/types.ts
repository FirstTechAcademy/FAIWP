export type UserRole = 'student' | 'mentor' | 'employer' | 'admin';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  bio: string | null;
  location: string | null;
  phone: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  website_url: string | null;
  career_score: number;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_hours: number;
  thumbnail_url: string | null;
  instructor_name: string | null;
  instructor_avatar: string | null;
  price: number;
  rating: number;
  enrolled_count: number;
  is_published: boolean;
  skills_taught: string[] | null;
  created_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  content_url: string | null;
  content_type: 'video' | 'article' | 'quiz' | 'project';
  duration_minutes: number;
  sort_order: number;
  is_free_preview: boolean;
  created_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  progress: number;
  completed_lessons: string[];
  completed_at: string | null;
  created_at: string;
  course?: Course;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  certificate_url: string | null;
  issued_at: string;
  course?: Course;
}

export interface Mentor {
  id: string;
  user_id: string;
  title: string | null;
  company: string | null;
  expertise: string[] | null;
  bio: string | null;
  hourly_rate: number;
  rating: number;
  total_sessions: number;
  is_available: boolean;
  avatar_url: string | null;
  linkedin_url: string | null;
  created_at: string;
  profile?: Profile;
}

export interface MentorshipSession {
  id: string;
  mentor_id: string;
  student_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  topic: string | null;
  meeting_url: string | null;
  notes: string | null;
  rating: number | null;
  created_at: string;
  mentor?: Mentor;
}

export interface Employer {
  id: string;
  user_id: string;
  company_name: string;
  industry: string | null;
  company_size: string | null;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  location: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  description: string | null;
  type: 'full-time' | 'part-time' | 'internship' | 'contract' | 'freelance';
  location: string | null;
  is_remote: boolean;
  salary_min: number | null;
  salary_max: number | null;
  required_skills: string[] | null;
  experience_level: 'entry' | 'junior' | 'mid' | 'senior';
  deadline: string | null;
  is_active: boolean;
  application_count: number;
  created_at: string;
  employer?: Employer;
}

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  cover_letter: string | null;
  resume_url: string | null;
  status: 'applied' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';
  created_at: string;
  job?: Job;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  link: string | null;
  created_at: string;
}
