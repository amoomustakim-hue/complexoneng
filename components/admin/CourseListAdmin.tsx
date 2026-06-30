"use client";

import { useState } from "react";
import Link from "next/link";

type Course = {
  id: string;
  subject: string;
  title: string;
  levelTag: string;
  description: string | null;
  order: number;
  moduleCount: number;
  enrollmentCount: number;
};

export default function CourseListAdmin({ initialCourses }: { initialCourses: Course[] }) {
  const [courses, setCourses] = useState(initialCourses);
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [levelTag, setLevelTag] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function addCourse(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject,
        title,
        levelTag,
        description,
        order: Number(order) || 0,
      }),
    });

    setSubmitting(false);
    if (res.ok) {
      const data = await res.json();
      setCourses((prev) => [...prev, { ...data.course, moduleCount: 0, enrollmentCount: 0 }]);
      setSubject("");
      setTitle("");
      setLevelTag("");
      setDescription("");
      setOrder("");
    }
  }

  async function deleteCourse(id: string) {
    await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div>
      <form onSubmit={addCourse} className="flex flex-wrap gap-2 mb-6">
        <input
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject e.g. Mathematics"
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal flex-1 min-w-[160px]"
        />
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Course title"
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal flex-1 min-w-[160px]"
        />
        <input
          required
          value={levelTag}
          onChange={(e) => setLevelTag(e.target.value)}
          placeholder="Level tag e.g. SS1"
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal w-32"
        />
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          placeholder="Order"
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal w-24"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal flex-1 min-w-[220px]"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-teal text-cream font-semibold px-4 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          Add course
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex items-center justify-between rounded-lg border border-border-light bg-white p-3 gap-3"
          >
            <Link href={`/admin/courses/${course.id}`} className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-teal">{course.title}</p>
              <p className="text-xs text-muted">
                {course.subject} · {course.levelTag} · {course.moduleCount} module
                {course.moduleCount === 1 ? "" : "s"} · {course.enrollmentCount} enrolled
              </p>
            </Link>
            <button
              onClick={() => deleteCourse(course.id)}
              className="text-xs text-red-600 font-semibold shrink-0"
            >
              Delete
            </button>
          </div>
        ))}
        {courses.length === 0 && <p className="text-sm text-muted">No courses yet.</p>}
      </div>
    </div>
  );
}
