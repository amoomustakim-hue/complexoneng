export type CareerCategory =
  | "MEDICINE"
  | "ENGINEERING"
  | "DATA_SCIENCE"
  | "LAW"
  | "BUSINESS"
  | "ARTS_HUMANITIES"
  | "EDUCATION"
  | "TECHNOLOGY";

export const CAREER_INFO: Record<
  CareerCategory,
  { label: string; description: string; courses: string[] }
> = {
  MEDICINE: {
    label: "Medicine & Health Sciences",
    description: "Diagnosing, treating, and caring for people's health.",
    courses: ["Medicine & Surgery", "Nursing", "Pharmacy", "Physiotherapy"],
  },
  ENGINEERING: {
    label: "Engineering",
    description: "Designing and building physical systems and infrastructure.",
    courses: ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering"],
  },
  DATA_SCIENCE: {
    label: "Data Science & Analytics",
    description: "Finding patterns in data to drive decisions.",
    courses: ["Statistics", "Mathematics", "Data Science", "Actuarial Science"],
  },
  LAW: {
    label: "Law",
    description: "Arguing cases, resolving disputes, and fighting for justice.",
    courses: ["Law", "Political Science", "International Relations"],
  },
  BUSINESS: {
    label: "Business & Management",
    description: "Building, growing, and leading organizations.",
    courses: ["Business Administration", "Economics", "Accounting", "Marketing"],
  },
  ARTS_HUMANITIES: {
    label: "Arts & Humanities",
    description: "Telling stories and expressing ideas creatively.",
    courses: ["English", "Fine Art", "Theatre Arts", "Mass Communication"],
  },
  EDUCATION: {
    label: "Education",
    description: "Teaching and shaping the next generation.",
    courses: ["Education", "Educational Psychology", "Curriculum Studies"],
  },
  TECHNOLOGY: {
    label: "Technology & Computing",
    description: "Building software and digital products that scale.",
    courses: ["Computer Science", "Software Engineering", "Information Technology"],
  },
};

export type QuizOption = { category: CareerCategory; label: string };
export type QuizQuestion = { id: string; text: string; options: QuizOption[] };

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "subject",
    text: "Which subject do you enjoy most?",
    options: [
      { category: "MEDICINE", label: "Biology / Chemistry" },
      { category: "ENGINEERING", label: "Physics / Further Maths" },
      { category: "DATA_SCIENCE", label: "Statistics / Maths" },
      { category: "LAW", label: "Government / CRS / IRS" },
      { category: "BUSINESS", label: "Economics / Commerce" },
      { category: "ARTS_HUMANITIES", label: "Literature / Fine Art" },
      { category: "EDUCATION", label: "Education / Psychology" },
      { category: "TECHNOLOGY", label: "Computer Studies" },
    ],
  },
  {
    id: "problem",
    text: "What kind of problems excite you most?",
    options: [
      { category: "MEDICINE", label: "Diagnosing and helping people heal" },
      { category: "ENGINEERING", label: "Building physical systems" },
      { category: "DATA_SCIENCE", label: "Finding patterns in data" },
      { category: "LAW", label: "Arguing and resolving disputes" },
      { category: "BUSINESS", label: "Growing a business" },
      { category: "ARTS_HUMANITIES", label: "Telling stories and creating" },
      { category: "EDUCATION", label: "Teaching others" },
      { category: "TECHNOLOGY", label: "Writing code and building apps" },
    ],
  },
  {
    id: "weekend",
    text: "Pick your ideal weekend activity",
    options: [
      { category: "MEDICINE", label: "Volunteering at a clinic" },
      { category: "ENGINEERING", label: "Tinkering with gadgets or machines" },
      { category: "DATA_SCIENCE", label: "Analyzing sports or election stats" },
      { category: "LAW", label: "Joining a debate" },
      { category: "BUSINESS", label: "Running a side hustle" },
      { category: "ARTS_HUMANITIES", label: "Painting or writing" },
      { category: "EDUCATION", label: "Tutoring a younger sibling" },
      { category: "TECHNOLOGY", label: "Building a small app or website" },
    ],
  },
  {
    id: "environment",
    text: "Your ideal work environment is a...",
    options: [
      { category: "MEDICINE", label: "Hospital or clinic" },
      { category: "ENGINEERING", label: "Construction site or lab" },
      { category: "DATA_SCIENCE", label: "Office full of dashboards" },
      { category: "LAW", label: "Courtroom or law firm" },
      { category: "BUSINESS", label: "Startup or company HQ" },
      { category: "ARTS_HUMANITIES", label: "Studio or publishing house" },
      { category: "EDUCATION", label: "Classroom or school" },
      { category: "TECHNOLOGY", label: "Tech company" },
    ],
  },
  {
    id: "motivation",
    text: "Which statement fits you best?",
    options: [
      { category: "MEDICINE", label: "I want to save lives" },
      { category: "ENGINEERING", label: "I want to build things that last" },
      { category: "DATA_SCIENCE", label: "I want to predict the future from data" },
      { category: "LAW", label: "I want to fight for justice" },
      { category: "BUSINESS", label: "I want to build wealth and lead people" },
      { category: "ARTS_HUMANITIES", label: "I want to express ideas creatively" },
      { category: "EDUCATION", label: "I want to shape young minds" },
      { category: "TECHNOLOGY", label: "I want to build software that scales" },
    ],
  },
  {
    id: "strength",
    text: "What's your biggest strength?",
    options: [
      { category: "MEDICINE", label: "Empathy and care under pressure" },
      { category: "ENGINEERING", label: "Practical problem-solving" },
      { category: "DATA_SCIENCE", label: "Logical and analytical thinking" },
      { category: "LAW", label: "Persuasive communication" },
      { category: "BUSINESS", label: "Leadership and negotiation" },
      { category: "ARTS_HUMANITIES", label: "Creativity and imagination" },
      { category: "EDUCATION", label: "Patience and explaining clearly" },
      { category: "TECHNOLOGY", label: "Structured, technical thinking" },
    ],
  },
];

export function scoreQuiz(answers: CareerCategory[]): { category: CareerCategory; score: number }[] {
  const counts = new Map<CareerCategory, number>();
  for (const category of answers) {
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([category, score]) => ({ category, score }))
    .sort((a, b) => b.score - a.score);
}
