import Link from "next/link";
import {
  BookOpen,
  HelpCircle,
  Award,
  GraduationCap,
  ShoppingBag,
  Home as HomeIcon,
  Receipt,
  Users,
} from "lucide-react";

const sections = [
  { href: "/admin/courses", icon: BookOpen, title: "Courses", body: "Manage courses, modules, lessons, videos, and PDFs." },
  { href: "/admin/questions", icon: HelpCircle, title: "Questions", body: "CBT question bank for JAMB, WAEC, NECO, Post-UTME." },
  { href: "/admin/opportunities", icon: Award, title: "Opportunities", body: "Scholarships, fellowships, competitions, and internships." },
  { href: "/admin/programs", icon: GraduationCap, title: "Programs", body: "University programs for the admission navigator." },
  { href: "/admin/inventory", icon: ShoppingBag, title: "Inventory", body: "Marketplace items for the student economy." },
  { href: "/admin/hostels", icon: HomeIcon, title: "Hostels", body: "Verified student hostel listings." },
  { href: "/admin/orders", icon: Receipt, title: "Orders", body: "Marketplace and hostel orders." },
  { href: "/admin/mentors", icon: Users, title: "Mentors", body: "Review and approve mentor applications." },
];

export default function AdminHomePage() {
  return (
    <div>
      <p className="text-xs tracking-widest text-teal">ADMIN</p>
      <h1 className="text-2xl font-bold text-teal mt-1">Platform admin</h1>
      <p className="text-sm text-muted mt-1">
        Manage everything students see — courses, exam questions, opportunities, the
        marketplace, and the mentor network.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.href}
              href={s.href}
              className="rounded-xl border border-border-light bg-white p-5 hover:border-teal transition flex flex-col gap-2"
            >
              <Icon className="text-teal" size={22} />
              <h2 className="font-bold text-teal">{s.title}</h2>
              <p className="text-sm text-muted">{s.body}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
