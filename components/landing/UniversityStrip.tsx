const universities = ["UNILAG", "OAU", "LASU", "UI", "FUTA", "ABU", "UNIBEN", "and 50+ Nigerian universities"];

export default function UniversityStrip() {
  return (
    <section className="bg-white py-10 border-y border-border-light">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm text-muted">
          Built for students at{" "}
          {universities.map((uni, i) => (
            <span key={uni}>
              <span className="font-semibold text-teal">{uni}</span>
              {i < universities.length - 1 && " · "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
