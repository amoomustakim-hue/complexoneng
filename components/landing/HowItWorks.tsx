const steps = [
  {
    num: "01",
    title: "Create your account",
    body: "Sign up, choose your academic level, school, and target exam.",
  },
  {
    num: "02",
    title: "Access your tools",
    body: "Your AI coach, CBT practice engine, and career resources are ready immediately.",
  },
  {
    num: "03",
    title: "Grow and connect",
    body: "Find hostels, buy materials, meet mentors, and build your student portfolio.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-cream py-24">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-xs tracking-widest text-teal text-center">HOW IT WORKS</p>
        <h2 className="text-4xl font-bold text-teal text-center mt-3">
          Up and running in minutes
        </h2>

        <div className="flex flex-col md:flex-row items-start mt-16 gap-12 md:gap-0">
          {steps.map((step, i) => (
            <div key={step.num} className="contents md:flex md:flex-1 md:items-start">
              <div className="flex-1">
                <p className="font-[family-name:var(--font-instrument)] text-6xl text-teal font-light">
                  {step.num}
                </p>
                <h3 className="font-bold text-lg text-teal mt-2">{step.title}</h3>
                <p className="text-sm text-muted mt-1">{step.body}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block flex-1 border-t border-dashed border-teal opacity-30 mt-8 mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
