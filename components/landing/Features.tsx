import { BookOpen, Briefcase, FlaskConical, ShoppingBag, Users, IdCard, type LucideIcon } from "lucide-react";

type Feature = {
  phase: string;
  icon: LucideIcon;
  title: string;
  body: string;
};

const features: Feature[] = [
  {
    phase: "Phase 1",
    icon: BookOpen,
    title: "Academic Success Hub",
    body: "Personal AI coach, CBT mock exams for JAMB, WAEC, NECO, and Post-UTME with performance tracking.",
  },
  {
    phase: "Phase 2",
    icon: Briefcase,
    title: "Career & Future Planning",
    body: "Career discovery engine, scholarship portal, and university admission navigator for Nigerian and international schools.",
  },
  {
    phase: "Phase 3",
    icon: FlaskConical,
    title: "Research Support",
    body: "Proposal guidance, data analysis support, and a research marketplace connecting students with analysts and supervisors.",
  },
  {
    phase: "Phase 4",
    icon: ShoppingBag,
    title: "Student Economy",
    body: "Buy textbooks and laptops, find and book verified student hostels — all through WhatsApp or the app.",
  },
  {
    phase: "Phase 5",
    icon: Users,
    title: "Community & Mentorship",
    body: "Join student communities by interest and book sessions with graduates, lecturers, and professionals.",
  },
  {
    phase: "Phase 6",
    icon: IdCard,
    title: "Digital Portfolio",
    body: "Every student gets a verified profile — academic records, certificates, projects, and research outputs.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-xs tracking-widest text-teal text-center">WHAT&apos;S INSIDE</p>
        <h2 className="text-4xl font-bold text-teal text-center mt-3">
          Everything a student needs, in one place
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-xl border border-border-light p-6 bg-white flex flex-col"
              >
                <span className="text-xs bg-cream text-teal font-medium px-3 py-1 rounded-full w-fit">
                  {feature.phase}
                </span>
                <Icon className="text-teal mt-4" size={24} />
                <h3 className="font-bold text-lg text-teal mt-3">{feature.title}</h3>
                <p className="text-sm text-muted mt-1 leading-relaxed">{feature.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
