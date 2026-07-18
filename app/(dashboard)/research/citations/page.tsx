import CitationFormatter from "@/components/research/CitationFormatter";

export default function CitationsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-teal">Citation Generator</h1>
        <p className="text-sm text-muted mt-2">
          Instantly create formatted citations in APA, MLA, Harvard, Vancouver, and Chicago styles.
        </p>
      </div>
      <CitationFormatter />
    </div>
  );
}
