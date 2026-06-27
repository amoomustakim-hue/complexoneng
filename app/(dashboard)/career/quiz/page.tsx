import CareerQuiz from "@/components/career/CareerQuiz";

export default function CareerQuizPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">CAREER DISCOVERY</p>
      <h1 className="text-2xl font-bold text-teal mt-1">Find your career path</h1>
      <p className="text-sm text-muted mt-1">
        Answer a few quick questions and we&apos;ll suggest career paths that fit you.
      </p>

      <div className="bg-white border border-border-light rounded-xl p-6 mt-6">
        <CareerQuiz />
      </div>
    </div>
  );
}
