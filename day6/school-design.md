# School Database Design

This database stores the students at a school, the courses they can take, and which students are enrolled on which courses (with their grade). The SQL is in `school.sql`.

## Tables

### students

One row per student.

- `id` is the primary key
- `name` is required (`NOT NULL`)
- `email` is required and `UNIQUE`, so no two students can share an email address

### courses

One row per course.

- `id` is the primary key
- `title` is required and `UNIQUE`
- `credits` is a whole number that defaults to 3

### enrolments

One row for each time a student is enrolled on a course. This is the join table.

- `student_id` is a foreign key to `students.id`
- `course_id` is a foreign key to `courses.id`
- `grade` is a number from 0 to 100, and it stays empty (`NULL`) until the student is graded
- `enrolled_on` is filled in automatically with the current date and time
- the primary key is the pair `(student_id, course_id)`, which is how the database stops the same student enrolling on the same course twice

## Relationships

- **students to enrolments is one-to-many.** One student can have many enrolments, but each enrolment belongs to exactly one student.
- **courses to enrolments is one-to-many.** One course can have many enrolments, but each enrolment belongs to exactly one course.
- **students to courses is many-to-many.** One student takes many courses, and one course has many students.

### Why a join table is needed

A foreign key can only point to one row. If `students` had a `course_id` column, each student could take only one course. If `courses` had a `student_id` column, each course could have only one student. Storing a list such as `"1,2,3"` in one column breaks the rule that each column holds one value, and it is hard to search and update.

The `enrolments` table solves this by turning one many-to-many relationship into two one-to-many relationships. Each row stores one pair of ids, so there is no limit on how many courses a student takes or how many students a course has. It is also the natural place for facts about the pair itself, such as the grade, which belongs to neither the student alone nor the course alone.

## Index

I would add an index on `enrolments(course_id)`:

```sql
CREATE INDEX idx_enrolments_course_id ON enrolments(course_id);
```

The primary key `(student_id, course_id)` already makes it fast to find all the courses for one student. But finding all the students on one course, or counting the students per course, searches by `course_id`, and without an index the database would have to read every row in `enrolments`. With the index it jumps straight to the right rows. The cost is that every new enrolment also updates the index, which is a small price for a table that is read far more often than it is written.

## SQL or NoSQL?

I would choose SQL (a relational database such as PostgreSQL or SQLite). The data is clearly structured, with the same fields for every student and course, and it is built from relationships: students belong to courses through enrolments. SQL is excellent at those relationships, using foreign keys and JOINs to answer questions such as "which students have no enrolments?". It also enforces the rules inside the database itself: unique emails, grades between 0 and 100, and no duplicate enrolments, so the data stays correct whichever program changes it. Grades and enrolments matter, so correctness is more important than a flexible shape. A document database could store each student with their courses inside one document, but then a course's details would be copied into many documents and would be hard to keep consistent when they change.
