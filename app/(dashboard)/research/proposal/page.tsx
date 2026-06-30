import ProposalBuilder from "@/components/research/ProposalBuilder";

export default function ProposalBuilderPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">RESEARCH SUPPORT</p>
      <h1 className="text-2xl font-bold text-teal mt-1">Research proposal builder</h1>
      <p className="text-sm text-muted mt-1">
        Fill in your research details and get a structured academic proposal draft in seconds.
      </p>

      <div className="bg-white border border-border-light rounded-xl p-6 mt-6">
        <ProposalBuilder />
      </div>
    </div>
  );
}
