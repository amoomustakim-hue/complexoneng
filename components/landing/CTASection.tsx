export default function CTASection() {
  return (
    <section id="about" className="bg-teal py-24 text-center">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-[family-name:var(--font-instrument)] text-5xl text-cream font-light leading-tight">
          Your student journey
          <br />
          starts here.
        </h2>
        <p className="text-base text-cream opacity-75 mt-4 max-w-lg mx-auto">
          Join thousands of Nigerian students using ComplexOne to study smarter, find
          opportunities, and build their future.
        </p>
        <button className="bg-cream text-teal font-semibold px-8 py-4 rounded-lg mt-8 text-base hover:opacity-90 transition">
          Create free account
        </button>
      </div>
    </section>
  );
}
