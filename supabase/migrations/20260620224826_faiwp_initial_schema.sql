/*
# FAIWP Initial Schema — FirstTech AI Workforce Platform

## Summary
Creates the full multi-role workforce platform schema with 15 tables covering users,
learning, jobs, mentorship, and employer functionality.

## New Tables
1. `profiles` — Extended user profiles (role: student/mentor/employer/admin)
2. `skills` — Skill taxonomy catalog
3. `user_skills` — Junction table linking users to skills with proficiency
4. `assessments` — AI career assessments per user
5. `learning_paths` — Personalized learning roadmaps
6. `courses` — Course catalog with category and metadata
7. `lessons` — Individual lessons within courses
8. `enrollments` — User course enrollments with progress
9. `certificates` — Earned certificates per user per course
10. `mentors` — Mentor profiles with expertise and availability
11. `mentorship_sessions` — Scheduled sessions between mentors and students
12. `employers` — Employer/company profiles
13. `jobs` — Job and internship postings
14. `applications` — Job/internship applications
15. `notifications` — In-app notifications

## Security
- RLS enabled on all tables
- Authenticated-user policies with ownership checks
- Public read on courses, skills, jobs, mentors, employers
*/

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student','mentor','employer','admin')),
  bio text,
  location text,
  phone text,
  linkedin_url text,
  github_url text,
  website_url text,
  career_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select" ON profiles;
CREATE POLICY "profiles_select" ON profiles FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "profiles_insert" ON profiles;
CREATE POLICY "profiles_insert" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_update" ON profiles;
CREATE POLICY "profiles_update" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_delete" ON profiles;
CREATE POLICY "profiles_delete" ON profiles FOR DELETE TO authenticated USING (auth.uid() = id);

-- SKILLS
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "skills_select" ON skills;
CREATE POLICY "skills_select" ON skills FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "skills_insert" ON skills;
CREATE POLICY "skills_insert" ON skills FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "skills_update" ON skills;
CREATE POLICY "skills_update" ON skills FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "skills_delete" ON skills;
CREATE POLICY "skills_delete" ON skills FOR DELETE TO authenticated USING (true);

-- USER SKILLS
CREATE TABLE IF NOT EXISTS user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  proficiency integer DEFAULT 1 CHECK (proficiency BETWEEN 1 AND 5),
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, skill_id)
);
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_skills_select" ON user_skills;
CREATE POLICY "user_skills_select" ON user_skills FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "user_skills_insert" ON user_skills;
CREATE POLICY "user_skills_insert" ON user_skills FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "user_skills_update" ON user_skills;
CREATE POLICY "user_skills_update" ON user_skills FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "user_skills_delete" ON user_skills;
CREATE POLICY "user_skills_delete" ON user_skills FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ASSESSMENTS
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  interests text[],
  current_skills text[],
  education_level text,
  goals text,
  recommended_careers jsonb,
  skill_gaps jsonb,
  learning_roadmap jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "assessments_select" ON assessments;
CREATE POLICY "assessments_select" ON assessments FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "assessments_insert" ON assessments;
CREATE POLICY "assessments_insert" ON assessments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "assessments_update" ON assessments;
CREATE POLICY "assessments_update" ON assessments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "assessments_delete" ON assessments;
CREATE POLICY "assessments_delete" ON assessments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- LEARNING PATHS
CREATE TABLE IF NOT EXISTS learning_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  target_career text,
  progress integer DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "learning_paths_select" ON learning_paths;
CREATE POLICY "learning_paths_select" ON learning_paths FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "learning_paths_insert" ON learning_paths;
CREATE POLICY "learning_paths_insert" ON learning_paths FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "learning_paths_update" ON learning_paths;
CREATE POLICY "learning_paths_update" ON learning_paths FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "learning_paths_delete" ON learning_paths;
CREATE POLICY "learning_paths_delete" ON learning_paths FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- COURSES
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  level text DEFAULT 'beginner' CHECK (level IN ('beginner','intermediate','advanced')),
  duration_hours integer DEFAULT 0,
  thumbnail_url text,
  instructor_name text,
  instructor_avatar text,
  price decimal(10,2) DEFAULT 0,
  rating decimal(3,2) DEFAULT 0,
  enrolled_count integer DEFAULT 0,
  is_published boolean DEFAULT true,
  skills_taught text[],
  created_at timestamptz DEFAULT now()
);
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "courses_select" ON courses;
CREATE POLICY "courses_select" ON courses FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "courses_insert" ON courses;
CREATE POLICY "courses_insert" ON courses FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "courses_update" ON courses;
CREATE POLICY "courses_update" ON courses FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "courses_delete" ON courses;
CREATE POLICY "courses_delete" ON courses FOR DELETE TO authenticated USING (true);

-- LESSONS
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  content_url text,
  content_type text DEFAULT 'video' CHECK (content_type IN ('video','article','quiz','project')),
  duration_minutes integer DEFAULT 0,
  sort_order integer DEFAULT 0,
  is_free_preview boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lessons_select" ON lessons;
CREATE POLICY "lessons_select" ON lessons FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "lessons_insert" ON lessons;
CREATE POLICY "lessons_insert" ON lessons FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "lessons_update" ON lessons;
CREATE POLICY "lessons_update" ON lessons FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "lessons_delete" ON lessons;
CREATE POLICY "lessons_delete" ON lessons FOR DELETE TO authenticated USING (true);

-- ENROLLMENTS
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress integer DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  completed_lessons uuid[] DEFAULT '{}',
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "enrollments_select" ON enrollments;
CREATE POLICY "enrollments_select" ON enrollments FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "enrollments_insert" ON enrollments;
CREATE POLICY "enrollments_insert" ON enrollments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "enrollments_update" ON enrollments;
CREATE POLICY "enrollments_update" ON enrollments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "enrollments_delete" ON enrollments;
CREATE POLICY "enrollments_delete" ON enrollments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- CERTIFICATES
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_url text,
  issued_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "certificates_select" ON certificates;
CREATE POLICY "certificates_select" ON certificates FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "certificates_insert" ON certificates;
CREATE POLICY "certificates_insert" ON certificates FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "certificates_update" ON certificates;
CREATE POLICY "certificates_update" ON certificates FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "certificates_delete" ON certificates;
CREATE POLICY "certificates_delete" ON certificates FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- MENTORS
CREATE TABLE IF NOT EXISTS mentors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text,
  company text,
  expertise text[],
  bio text,
  hourly_rate decimal(10,2) DEFAULT 0,
  rating decimal(3,2) DEFAULT 0,
  total_sessions integer DEFAULT 0,
  is_available boolean DEFAULT true,
  avatar_url text,
  linkedin_url text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "mentors_select" ON mentors;
CREATE POLICY "mentors_select" ON mentors FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "mentors_insert" ON mentors;
CREATE POLICY "mentors_insert" ON mentors FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "mentors_update" ON mentors;
CREATE POLICY "mentors_update" ON mentors FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "mentors_delete" ON mentors;
CREATE POLICY "mentors_delete" ON mentors FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- MENTORSHIP SESSIONS
CREATE TABLE IF NOT EXISTS mentorship_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  student_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  status text DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  topic text,
  meeting_url text,
  notes text,
  rating integer CHECK (rating BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE mentorship_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "sessions_select" ON mentorship_sessions;
CREATE POLICY "sessions_select" ON mentorship_sessions FOR SELECT TO authenticated
  USING (auth.uid() = student_id OR EXISTS (SELECT 1 FROM mentors WHERE mentors.id = mentor_id AND mentors.user_id = auth.uid()));
DROP POLICY IF EXISTS "sessions_insert" ON mentorship_sessions;
CREATE POLICY "sessions_insert" ON mentorship_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);
DROP POLICY IF EXISTS "sessions_update" ON mentorship_sessions;
CREATE POLICY "sessions_update" ON mentorship_sessions FOR UPDATE TO authenticated
  USING (auth.uid() = student_id OR EXISTS (SELECT 1 FROM mentors WHERE mentors.id = mentor_id AND mentors.user_id = auth.uid()));
DROP POLICY IF EXISTS "sessions_delete" ON mentorship_sessions;
CREATE POLICY "sessions_delete" ON mentorship_sessions FOR DELETE TO authenticated USING (auth.uid() = student_id);

-- EMPLOYERS
CREATE TABLE IF NOT EXISTS employers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  industry text,
  company_size text,
  description text,
  logo_url text,
  website_url text,
  location text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "employers_select" ON employers;
CREATE POLICY "employers_select" ON employers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "employers_insert" ON employers;
CREATE POLICY "employers_insert" ON employers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "employers_update" ON employers;
CREATE POLICY "employers_update" ON employers FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "employers_delete" ON employers;
CREATE POLICY "employers_delete" ON employers FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- JOBS
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  type text DEFAULT 'full-time' CHECK (type IN ('full-time','part-time','internship','contract','freelance')),
  location text,
  is_remote boolean DEFAULT false,
  salary_min integer,
  salary_max integer,
  required_skills text[],
  experience_level text DEFAULT 'entry' CHECK (experience_level IN ('entry','junior','mid','senior')),
  deadline timestamptz,
  is_active boolean DEFAULT true,
  application_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "jobs_select" ON jobs;
CREATE POLICY "jobs_select" ON jobs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "jobs_insert" ON jobs;
CREATE POLICY "jobs_insert" ON jobs FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM employers WHERE employers.id = employer_id AND employers.user_id = auth.uid()));
DROP POLICY IF EXISTS "jobs_update" ON jobs;
CREATE POLICY "jobs_update" ON jobs FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM employers WHERE employers.id = employer_id AND employers.user_id = auth.uid()));
DROP POLICY IF EXISTS "jobs_delete" ON jobs;
CREATE POLICY "jobs_delete" ON jobs FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM employers WHERE employers.id = employer_id AND employers.user_id = auth.uid()));

-- APPLICATIONS
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  cover_letter text,
  resume_url text,
  status text DEFAULT 'applied' CHECK (status IN ('applied','reviewing','shortlisted','rejected','hired')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, job_id)
);
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "applications_select" ON applications;
CREATE POLICY "applications_select" ON applications FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM jobs j JOIN employers e ON e.id = j.employer_id
    WHERE j.id = job_id AND e.user_id = auth.uid()
  ));
DROP POLICY IF EXISTS "applications_insert" ON applications;
CREATE POLICY "applications_insert" ON applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "applications_update" ON applications;
CREATE POLICY "applications_update" ON applications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM jobs j JOIN employers e ON e.id = j.employer_id
    WHERE j.id = job_id AND e.user_id = auth.uid()
  ));
DROP POLICY IF EXISTS "applications_delete" ON applications;
CREATE POLICY "applications_delete" ON applications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info','success','warning','error')),
  is_read boolean DEFAULT false,
  link text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "notifications_select" ON notifications;
CREATE POLICY "notifications_select" ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "notifications_insert" ON notifications;
CREATE POLICY "notifications_insert" ON notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "notifications_update" ON notifications;
CREATE POLICY "notifications_update" ON notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "notifications_delete" ON notifications;
CREATE POLICY "notifications_delete" ON notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);
