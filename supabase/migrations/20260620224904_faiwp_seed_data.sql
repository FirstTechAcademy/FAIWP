/*
# FAIWP Demo Seed Data

Seeds realistic demo data for courses, skills, mentors, employers, and jobs
so the platform looks populated on first visit.
*/

-- SKILLS SEED
INSERT INTO skills (name, category, description) VALUES
('Python', 'Programming', 'General-purpose programming language'),
('JavaScript', 'Programming', 'Web programming language'),
('React', 'Frontend', 'UI component library'),
('Node.js', 'Backend', 'JavaScript runtime for servers'),
('SQL', 'Database', 'Structured Query Language'),
('Data Analysis', 'Data', 'Analyzing datasets to extract insights'),
('Machine Learning', 'AI/ML', 'Training models to make predictions'),
('UI/UX Design', 'Design', 'User interface and experience design'),
('Figma', 'Design', 'Collaborative design tool'),
('Digital Marketing', 'Marketing', 'Online marketing strategies'),
('SEO', 'Marketing', 'Search engine optimization'),
('Project Management', 'Business', 'Planning and executing projects'),
('Communication', 'Soft Skills', 'Effective communication'),
('Leadership', 'Soft Skills', 'Leading teams and initiatives'),
('TypeScript', 'Programming', 'Typed superset of JavaScript'),
('AWS', 'Cloud', 'Amazon Web Services cloud platform'),
('Docker', 'DevOps', 'Container platform'),
('Git', 'DevOps', 'Version control system'),
('Cybersecurity', 'Security', 'Protecting digital systems'),
('Blockchain', 'Emerging Tech', 'Distributed ledger technology')
ON CONFLICT (name) DO NOTHING;

-- COURSES SEED
INSERT INTO courses (title, description, category, level, duration_hours, thumbnail_url, instructor_name, instructor_avatar, price, rating, enrolled_count, is_published, skills_taught) VALUES
(
  'Full-Stack Web Development Bootcamp',
  'Master modern web development from HTML to deployment. Build real-world projects with React, Node.js, and PostgreSQL.',
  'Web Development', 'beginner', 40,
  'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Sarah Johnson', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
  0, 4.8, 2340, true, ARRAY['JavaScript','React','Node.js','SQL']
),
(
  'Python for Data Science & AI',
  'Learn Python programming and apply it to data analysis, visualization, and machine learning projects.',
  'Data Science', 'beginner', 35,
  'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Dr. Michael Chen', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
  0, 4.9, 3120, true, ARRAY['Python','Data Analysis','Machine Learning']
),
(
  'UI/UX Design Fundamentals',
  'Design beautiful, user-centered interfaces using Figma. Learn design thinking, wireframing, and prototyping.',
  'Design', 'beginner', 20,
  'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Amina Osei', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
  0, 4.7, 1890, true, ARRAY['UI/UX Design','Figma']
),
(
  'Digital Marketing Mastery',
  'Learn SEO, social media marketing, content strategy, and paid advertising to grow businesses online.',
  'Marketing', 'beginner', 25,
  'https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg?auto=compress&cs=tinysrgb&w=600',
  'James Mwangi', 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
  0, 4.6, 1450, true, ARRAY['Digital Marketing','SEO']
),
(
  'Cloud Computing with AWS',
  'Get hands-on with AWS services including EC2, S3, Lambda, and RDS. Prepare for the AWS Solutions Architect exam.',
  'Cloud', 'intermediate', 30,
  'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Kwame Asante', 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
  0, 4.7, 980, true, ARRAY['AWS','Docker','Git']
),
(
  'Cybersecurity Essentials',
  'Understand threats, vulnerabilities, and defenses. Learn ethical hacking basics and how to secure systems.',
  'Cybersecurity', 'intermediate', 28,
  'https://images.pexels.com/photos/5240547/pexels-photo-5240547.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Fatima Al-Hassan', 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
  0, 4.8, 756, true, ARRAY['Cybersecurity','Git']
),
(
  'Mobile App Development with React Native',
  'Build cross-platform mobile apps for iOS and Android using React Native and Expo.',
  'Mobile', 'intermediate', 32,
  'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Tolu Adeyemi', 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
  0, 4.5, 1120, true, ARRAY['React','JavaScript','TypeScript']
),
(
  'Project Management Professional (PMP) Prep',
  'Comprehensive PMP exam preparation covering all process groups, knowledge areas, and agile methodologies.',
  'Business', 'advanced', 45,
  'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Grace Ndlovu', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100',
  0, 4.9, 620, true, ARRAY['Project Management','Leadership','Communication']
)
ON CONFLICT DO NOTHING;

-- LESSONS SEED (for first course)
INSERT INTO lessons (course_id, title, content_type, duration_minutes, sort_order, is_free_preview)
SELECT 
  c.id,
  lesson.title,
  lesson.content_type,
  lesson.duration_minutes,
  lesson.sort_order,
  lesson.is_free_preview
FROM courses c,
  (VALUES
    ('Introduction to Web Development', 'video', 15, 1, true),
    ('Setting Up Your Development Environment', 'video', 20, 2, true),
    ('HTML Fundamentals', 'video', 45, 3, false),
    ('CSS Styling & Flexbox', 'video', 60, 4, false),
    ('JavaScript Basics', 'video', 90, 5, false),
    ('React Components & Props', 'video', 75, 6, false),
    ('State Management with Hooks', 'video', 80, 7, false),
    ('Building a REST API with Node.js', 'video', 90, 8, false),
    ('Database Design with PostgreSQL', 'video', 60, 9, false),
    ('Final Project: Full-Stack App', 'project', 120, 10, false)
  ) AS lesson(title, content_type, duration_minutes, sort_order, is_free_preview)
WHERE c.title = 'Full-Stack Web Development Bootcamp'
ON CONFLICT DO NOTHING;
