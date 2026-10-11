-- School database: students, courses and enrolments
-- Written for SQLite (works in sqliteonline.com)

PRAGMA foreign_keys = ON;  -- SQLite only enforces foreign keys when this is on

-- Start clean so the file can be run again and again
DROP TABLE IF EXISTS enrolments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;


-- ============================================================
-- 1. Tables
-- ============================================================

CREATE TABLE students (
  id     INTEGER PRIMARY KEY,
  name   TEXT NOT NULL,
  email  TEXT NOT NULL UNIQUE          -- no two students share an email
);

CREATE TABLE courses (
  id       INTEGER PRIMARY KEY,
  title    TEXT NOT NULL UNIQUE,
  credits  INTEGER NOT NULL DEFAULT 3
);

-- The join table: one row = one student enrolled on one course
CREATE TABLE enrolments (
  student_id   INTEGER NOT NULL,
  course_id    INTEGER NOT NULL,
  grade        INTEGER CHECK (grade BETWEEN 0 AND 100),  -- empty until graded
  enrolled_on  TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (student_id, course_id),   -- the same student cannot join the same course twice
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id)  REFERENCES courses(id)  ON DELETE CASCADE
);

-- Speeds up "which students are on this course?" (the primary key already covers student_id)
CREATE INDEX idx_enrolments_course_id ON enrolments(course_id);


-- ============================================================
-- 2. Sample data
-- ============================================================

INSERT INTO students (name, email) VALUES
  ('Amina Otieno',   'amina@example.com'),
  ('Brian Kamau',    'brian@example.com'),
  ('Cynthia Wanjiru', 'cynthia@example.com'),
  ('David Mwangi',   'david@example.com');      -- David has not enrolled on anything yet

INSERT INTO courses (title, credits) VALUES
  ('Web Foundations',          4),
  ('Introduction to Databases', 3),
  ('Computer Networks',        3),
  ('Data Structures',          4);              -- nobody has joined this one yet

INSERT INTO enrolments (student_id, course_id, grade) VALUES
  (1, 1, 85),
  (1, 2, 78),
  (2, 1, 90),
  (2, 3, NULL),    -- NULL = not graded yet
  (3, 1, 72),
  (3, 2, NULL);


-- ============================================================
-- 3. Queries
-- ============================================================

-- Query 1: all courses for one student (by name)
SELECT courses.title, enrolments.grade
FROM students
JOIN enrolments ON enrolments.student_id = students.id
JOIN courses    ON courses.id = enrolments.course_id
WHERE students.name = 'Amina Otieno'
ORDER BY courses.title;

-- Query 2: all students on one course
SELECT students.name, students.email
FROM courses
JOIN enrolments ON enrolments.course_id = courses.id
JOIN students   ON students.id = enrolments.student_id
WHERE courses.title = 'Web Foundations'
ORDER BY students.name;

-- Query 3: number of students per course
-- LEFT JOIN keeps courses that have no students (they show 0)
SELECT courses.title, COUNT(enrolments.student_id) AS student_count
FROM courses
LEFT JOIN enrolments ON enrolments.course_id = courses.id
GROUP BY courses.id
ORDER BY student_count DESC, courses.title;

-- Query 4: students who have no enrolments
SELECT students.name, students.email
FROM students
LEFT JOIN enrolments ON enrolments.student_id = students.id
WHERE enrolments.student_id IS NULL;

-- Query 5: update one enrolment's grade (Brian's grade in Computer Networks)
UPDATE enrolments
SET grade = 88
WHERE student_id = (SELECT id FROM students WHERE name = 'Brian Kamau')
  AND course_id  = (SELECT id FROM courses  WHERE title = 'Computer Networks');

-- Check that the update worked
SELECT students.name, courses.title, enrolments.grade
FROM enrolments
JOIN students ON students.id = enrolments.student_id
JOIN courses  ON courses.id = enrolments.course_id
WHERE students.name = 'Brian Kamau';
