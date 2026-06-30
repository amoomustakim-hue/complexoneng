import CitationFormatter from "@/components/research/CitationFormatter";

export default function CitationsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">RESEARCH SUPPORT</p>
      <h1 className="text-2xl font-bold text-teal mt-1">Citation formatter</h1>
      <p className="text-sm text-muted mt-1">
        Enter source details and get a perfectly formatted APA, MLA, Harvard, or Vancouver citation.
      </p>

      <div className="bg-white border border-border-light rounded-xl p-6 mt-6">
        <CitationFormatter />
      </div>
    </div>
  );
}
