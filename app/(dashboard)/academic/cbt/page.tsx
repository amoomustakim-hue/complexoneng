import { getCurrentProfile } from "@/lib/profile";
import CbtPicker from "@/components/cbt/CbtPicker";

const SUBJECTS = ["English Language", "Mathematics", "Physics", "Biology"];
const EXAMS = ["JAMB", "WAEC", "NECO", "POST_UTME"];

export default async function CbtPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">CBT &amp; EXAMINATION CENTRE</p>
      <h1 className="text-2xl font-bold text-teal mt-1">Practice a mock exam</h1>
      <p className="text-sm text-muted mt-1">
        Pick an exam type and subject. Questions are cached for offline practice.
      </p>

      <CbtPicker
        exams={EXAMS}
        subjects={SUBJECTS}
        defaultExam={profile?.targetExam ?? undefined}
      />
    </div>
  );
}
