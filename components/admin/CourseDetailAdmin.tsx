"use client";

import { useState } from "react";
import { PlayCircle, FileText as FileTextIcon } from "lucide-react";

type Lesson = {
  id: string;
  title: string;
  order: number;
  contentType: string;
  textContent: string | null;
  videoUrl: string | null;
  pdfUrl: string | null;
};

type Module = {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
};

type LessonFormState = {
  title: string;
  order: string;
  contentType: string;
  textContent: string;
  videoUrl: string;
  pdfUrl: string;
};

const emptyLessonForm: LessonFormState = {
  title: "",
  order: "",
  contentType: "TEXT",
  textContent: "",
  videoUrl: "",
  pdfUrl: "",
};

export default function CourseDetailAdmin({
  courseId,
  initialModules,
}: {
  courseId: string;
  initialModules: Module[];
}) {
  const [modules, setModules] = useState(initialModules);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleOrder, setModuleOrder] = useState("");
  const [addingModule, setAddingModule] = useState(false);

  const [lessonFormFor, setLessonFormFor] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState<LessonFormState>(emptyLessonForm);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [savingLesson, setSavingLesson] = useState(false);

  async function addModule(e: React.FormEvent) {
    e.preventDefault();
    setAddingModule(true);

    const res = await fetch("/api/admin/modules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, title: moduleTitle, order: Number(moduleOrder) || 0 }),
    });

    setAddingModule(false);
    if (res.ok) {
      const data = await res.json();
      setModules((prev) => [...prev, { ...data.module, lessons: [] }]);
      setModuleTitle("");
      setModuleOrder("");
    }
  }

  async function deleteModule(id: string) {
    await fetch(`/api/admin/modules/${id}`, { method: "DELETE" });
    setModules((prev) => prev.filter((m) => m.id !== id));
  }

  function openAddLesson(moduleId: string) {
    setLessonFormFor(moduleId);
    setEditingLessonId(null);
    setLessonForm(emptyLessonForm);
  }

  function openEditLesson(moduleId: string, lesson: Lesson) {
    setLessonFormFor(moduleId);
    setEditingLessonId(lesson.id);
    setLessonForm({
      title: lesson.title,
      order: String(lesson.order),
      contentType: lesson.contentType,
      textContent: lesson.textContent ?? "",
      videoUrl: lesson.videoUrl ?? "",
      pdfUrl: lesson.pdfUrl ?? "",
    });
  }

  function closeLessonForm() {
    setLessonFormFor(null);
    setEditingLessonId(null);
    setLessonForm(emptyLessonForm);
  }

  async function saveLesson(moduleId: string) {
    setSavingLesson(true);
    const payload = {
      title: lessonForm.title,
      order: Number(lessonForm.order) || 0,
      contentType: lessonForm.contentType,
      textContent: lessonForm.textContent,
      videoUrl: lessonForm.videoUrl,
      pdfUrl: lessonForm.pdfUrl,
    };

    const res = editingLessonId
      ? await fetch(`/api/admin/lessons/${editingLessonId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/admin/lessons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, moduleId }),
        });

    setSavingLesson(false);
    if (!res.ok) return;

    const data = await res.json();
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m;
        if (editingLessonId) {
          return { ...m, lessons: m.lessons.map((l) => (l.id === editingLessonId ? data.lesson : l)) };
        }
        return { ...m, lessons: [...m.lessons, data.lesson] };
      })
    );
    closeLessonForm();
  }

  async function deleteLesson(moduleId: string, lessonId: string) {
    await fetch(`/api/admin/lessons/${lessonId}`, { method: "DELETE" });
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m))
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={addModule} className="flex flex-wrap gap-2">
        <input
          required
          value={moduleTitle}
          onChange={(e) => setModuleTitle(e.target.value)}
          placeholder="New module title"
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal flex-1 min-w-[200px]"
        />
        <input
          type="number"
          value={moduleOrder}
          onChange={(e) => setModuleOrder(e.target.value)}
          placeholder="Order"
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal w-24"
        />
        <button
          type="submit"
          disabled={addingModule}
          className="bg-teal text-cream font-semibold px-4 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          Add module
        </button>
      </form>

      {modules.map((module_) => (
        <div key={module_.id} className="rounded-xl border border-border-light bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-teal">
              {module_.title} <span className="text-xs text-muted">(order {module_.order})</span>
            </p>
            <button onClick={() => deleteModule(module_.id)} className="text-xs text-red-600 font-semibold">
              Delete module
            </button>
          </div>

          <div className="flex flex-col gap-2 mt-3">
            {module_.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-cream/60 px-3 py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {lesson.contentType === "VIDEO" ? (
                    <PlayCircle size={14} className="text-teal shrink-0" />
                  ) : (
                    <FileTextIcon size={14} className="text-teal shrink-0" />
                  )}
                  <span className="text-sm text-teal truncate">{lesson.title}</span>
                  {lesson.videoUrl && <span className="text-[10px] text-muted shrink-0">· video</span>}
                  {lesson.pdfUrl && <span className="text-[10px] text-muted shrink-0">· pdf</span>}
                </div>
                <div className="flex gap-3 shrink-0">
                  <button
                    onClick={() => openEditLesson(module_.id, lesson)}
                    className="text-xs font-semibold text-teal"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteLesson(module_.id, lesson.id)}
                    className="text-xs font-semibold text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {module_.lessons.length === 0 && (
              <p className="text-xs text-muted">No lessons yet.</p>
            )}
          </div>

          {lessonFormFor === module_.id ? (
            <div className="flex flex-col gap-2 mt-3 border-t border-border-light pt-3">
              <div className="flex flex-wrap gap-2">
                <input
                  required
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Lesson title"
                  className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal flex-1 min-w-[160px]"
                />
                <input
                  type="number"
                  value={lessonForm.order}
                  onChange={(e) => setLessonForm((f) => ({ ...f, order: e.target.value }))}
                  placeholder="Order"
                  className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal w-24"
                />
                <select
                  value={lessonForm.contentType}
                  onChange={(e) => setLessonForm((f) => ({ ...f, contentType: e.target.value }))}
                  className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
                >
                  <option value="TEXT">TEXT</option>
                  <option value="VIDEO">VIDEO</option>
                </select>
              </div>
              <textarea
                value={lessonForm.textContent}
                onChange={(e) => setLessonForm((f) => ({ ...f, textContent: e.target.value }))}
                placeholder="Lesson text content"
                rows={3}
                className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
              />
              <input
                value={lessonForm.videoUrl}
                onChange={(e) => setLessonForm((f) => ({ ...f, videoUrl: e.target.value }))}
                placeholder="Video embed URL (e.g. https://www.youtube.com/embed/...)"
                className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
              />
              <input
                value={lessonForm.pdfUrl}
                onChange={(e) => setLessonForm((f) => ({ ...f, pdfUrl: e.target.value }))}
                placeholder="PDF URL"
                className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => saveLesson(module_.id)}
                  disabled={savingLesson || !lessonForm.title.trim()}
                  className="bg-teal text-cream font-semibold px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                >
                  {editingLessonId ? "Save lesson" : "Add lesson"}
                </button>
                <button
                  onClick={closeLessonForm}
                  className="text-sm font-semibold text-muted px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => openAddLesson(module_.id)}
              className="text-xs font-semibold text-teal mt-3"
            >
              + Add lesson
            </button>
          )}
        </div>
      ))}
      {modules.length === 0 && <p className="text-sm text-muted">No modules yet.</p>}
    </div>
  );
}
