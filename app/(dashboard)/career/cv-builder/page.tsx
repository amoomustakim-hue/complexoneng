import CVBuilder from "@/components/career/CVBuilder";

export default function CVBuilderPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">INTERNSHIP PLACEMENT</p>
      <h1 className="text-2xl font-bold text-teal mt-1">CV & cover letter generator</h1>
      <p className="text-sm text-muted mt-1">
        Enter your details and get a tailored professional summary and cover letter opening for your internship application.
      </p>

      <div className="bg-white border border-border-light rounded-xl p-6 mt-6">
        <CVBuilder />
      </div>
    </div>
  );
}
