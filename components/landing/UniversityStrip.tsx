const universities = [
  "UNILAG",
  "OAU",
  "LASU",
  "UI",
  "FUTA",
  "ABU",
  "UNIBEN",
  "and 50+ Nigerian universities",
];

export default function UniversityStrip() {
  const loop = [...universities, ...universities];

  return (
    <section className="bg-cream py-8 border-y border-border-light overflow-hidden">
      <p className="text-center text-xs tracking-widest text-muted mb-4">
        BUILT FOR STUDENTS AT
      </p>
      <div className="relative">
        <div className="flex w-max animate-marquee gap-4">
          {loop.map((uni, i) => (
            <span
              key={`${uni}-${i}`}
              className="shrink-0 rounded-full bg-white px-5 py-2 text-sm font-semibold text-teal shadow-neu-light-inset border border-white/60"
            >
              {uni}
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cream to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-cream to-transparent" />
      </div>
    </section>
  );
}
