import Link from "next/link";
import { BookOpen, Laptop, Home, ReceiptText } from "lucide-react";

const modules = [
  {
    href: "/economy/shop",
    icon: BookOpen,
    title: "Textbooks & Materials",
    body: "Buy textbooks, past questions, and academic materials.",
  },
  {
    href: "/economy/shop?category=LAPTOP",
    icon: Laptop,
    title: "Laptops & Devices",
    body: "Browse affordable laptops for coursework.",
  },
  {
    href: "/economy/hostels",
    icon: Home,
    title: "Hostels",
    body: "Find and book verified student hostels.",
  },
  {
    href: "/economy/orders",
    icon: ReceiptText,
    title: "My Orders",
    body: "Track your purchases and bookings.",
  },
];

export default function EconomyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">STUDENT ECONOMY</p>
      <h1 className="text-2xl font-bold text-teal mt-1">Buy, book, and get supplies</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.href}
              href={m.href}
              className="rounded-xl border border-border-light bg-white p-5 hover:border-teal transition"
            >
              <Icon className="text-teal" size={22} />
              <h2 className="font-bold text-teal mt-3">{m.title}</h2>
              <p className="text-sm text-muted mt-1">{m.body}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
