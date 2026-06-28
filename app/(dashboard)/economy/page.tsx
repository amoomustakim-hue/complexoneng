import Link from "next/link";
import { MessageCircle, BookOpen, Laptop, FileText, Home, ReceiptText } from "lucide-react";

function waLink(message: string) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

const quickStarts = [
  { icon: BookOpen, label: "Textbooks & notes", message: "Hi, I need textbooks" },
  { icon: Laptop, label: "Laptops & devices", message: "Hi, I need a laptop" },
  { icon: FileText, label: "Academic materials", message: "Hi, I need academic materials" },
  { icon: Home, label: "Hostel bookings", message: "Hi, I need a hostel" },
];

export default function EconomyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8 text-center">
      <p className="text-xs tracking-widest text-teal">STUDENT ECONOMY</p>
      <h1 className="text-2xl font-bold text-teal mt-1">Shop on WhatsApp</h1>
      <p className="text-sm text-muted mt-2 max-w-md mx-auto">
        Textbooks, laptops, academic materials, and verified hostels — browse and pay right inside
        WhatsApp. No app download, no extra steps.
      </p>

      <a
        href={waLink("Hi, I'd like to shop on ComplexOne")}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-teal text-cream font-semibold px-6 py-3.5 rounded-lg mt-6"
      >
        <MessageCircle size={18} />
        Chat with us on WhatsApp
      </a>

      <div className="grid grid-cols-2 gap-3 mt-8 text-left">
        {quickStarts.map((q) => {
          const Icon = q.icon;
          return (
            <a
              key={q.label}
              href={waLink(q.message)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-border-light bg-white p-4 hover:border-teal transition flex flex-col gap-2"
            >
              <Icon className="text-teal" size={20} />
              <p className="text-sm font-medium text-teal">{q.label}</p>
            </a>
          );
        })}
      </div>

      <Link
        href="/economy/orders"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-teal mt-8"
      >
        <ReceiptText size={16} />
        View my orders
      </Link>
    </div>
  );
}
