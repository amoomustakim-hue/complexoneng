import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const questions = [
  // English Language
  {
    examType: "JAMB" as const,
    subject: "English Language",
    year: 2023,
    question: "Choose the option that best completes the sentence: She is _____ honest woman.",
    options: ["a", "an", "the", "no article needed"],
    answer: "an",
    explanation: "'Honest' begins with a silent 'h', so the vowel sound requires 'an'.",
  },
  {
    examType: "JAMB" as const,
    subject: "English Language",
    year: 2022,
    question: "Select the correctly spelt word.",
    options: ["Necessary", "Neccessary", "Neccesary", "Necesary"],
    answer: "Necessary",
    explanation: "Only one 'c' and double 's' in 'necessary'.",
  },
  {
    examType: "JAMB" as const,
    subject: "English Language",
    year: 2021,
    question: "Find the antonym of 'benevolent'.",
    options: ["Generous", "Malevolent", "Kind", "Charitable"],
    answer: "Malevolent",
    explanation: "'Benevolent' means kind/generous; 'malevolent' means having ill will.",
  },
  // Mathematics
  {
    examType: "JAMB" as const,
    subject: "Mathematics",
    year: 2023,
    question: "Simplify: 2/3 + 1/6",
    options: ["5/6", "1/2", "3/9", "4/6"],
    answer: "5/6",
    explanation: "2/3 = 4/6, so 4/6 + 1/6 = 5/6.",
  },
  {
    examType: "JAMB" as const,
    subject: "Mathematics",
    year: 2022,
    question: "If x + 3 = 10, what is the value of x?",
    options: ["5", "6", "7", "8"],
    answer: "7",
    explanation: "x = 10 - 3 = 7.",
  },
  {
    examType: "JAMB" as const,
    subject: "Mathematics",
    year: 2021,
    question: "What is the value of 5! (5 factorial)?",
    options: ["20", "60", "120", "150"],
    answer: "120",
    explanation: "5! = 5 × 4 × 3 × 2 × 1 = 120.",
  },
  // Physics
  {
    examType: "JAMB" as const,
    subject: "Physics",
    year: 2023,
    question: "The SI unit of electric current is the:",
    options: ["Volt", "Ohm", "Ampere", "Watt"],
    answer: "Ampere",
    explanation: "Electric current is measured in amperes (A).",
  },
  {
    examType: "JAMB" as const,
    subject: "Physics",
    year: 2022,
    question: "Which law states that for every action there is an equal and opposite reaction?",
    options: [
      "Newton's First Law",
      "Newton's Second Law",
      "Newton's Third Law",
      "Law of Conservation of Energy",
    ],
    answer: "Newton's Third Law",
    explanation: "Newton's Third Law of Motion describes action-reaction force pairs.",
  },
  {
    examType: "JAMB" as const,
    subject: "Physics",
    year: 2021,
    question: "What is the speed of light in a vacuum, approximately?",
    options: ["3 x 10^6 m/s", "3 x 10^8 m/s", "3 x 10^10 m/s", "3 x 10^5 m/s"],
    answer: "3 x 10^8 m/s",
    explanation: "The speed of light in a vacuum is approximately 3 x 10^8 m/s.",
  },
  // Biology
  {
    examType: "JAMB" as const,
    subject: "Biology",
    year: 2023,
    question: "The powerhouse of the cell is the:",
    options: ["Nucleus", "Ribosome", "Mitochondrion", "Golgi body"],
    answer: "Mitochondrion",
    explanation: "Mitochondria generate most of the cell's ATP via respiration.",
  },
  {
    examType: "JAMB" as const,
    subject: "Biology",
    year: 2022,
    question: "Photosynthesis occurs mainly in which part of the plant cell?",
    options: ["Mitochondrion", "Chloroplast", "Nucleus", "Vacuole"],
    answer: "Chloroplast",
    explanation: "Chloroplasts contain chlorophyll, which captures light for photosynthesis.",
  },
  {
    examType: "JAMB" as const,
    subject: "Biology",
    year: 2021,
    question: "Which blood cells are responsible for fighting infection?",
    options: ["Red blood cells", "White blood cells", "Platelets", "Plasma"],
    answer: "White blood cells",
    explanation: "White blood cells (leukocytes) are part of the immune system.",
  },
];

const opportunities = [
  {
    title: "MTN Foundation STEM Scholarship",
    provider: "MTN Foundation",
    type: "SCHOLARSHIP" as const,
    category: "TECHNOLOGY" as const,
    description: "Tuition support for undergraduates studying STEM fields in Nigerian universities.",
    eligibility: "Nigerian undergraduate, STEM discipline, CGPA 3.5+",
    deadline: new Date("2026-09-30"),
    link: "https://www.mtnonline.com/foundation",
    level: null,
  },
  {
    title: "Chevening Scholarships",
    provider: "UK Government",
    type: "SCHOLARSHIP" as const,
    category: null,
    description: "Fully-funded master's scholarships in the UK for future leaders.",
    eligibility: "2+ years work experience, undergraduate degree",
    deadline: new Date("2026-11-03"),
    link: "https://www.chevening.org",
    level: "POSTGRAD" as const,
  },
  {
    title: "Mastercard Foundation Scholars Program",
    provider: "Mastercard Foundation",
    type: "SCHOLARSHIP" as const,
    category: null,
    description: "Full scholarships for academically talented but economically disadvantaged students.",
    eligibility: "Financial need, strong academic record",
    deadline: new Date("2026-08-15"),
    link: "https://mastercardfdn.org",
    level: null,
  },
  {
    title: "NNPC/Total National Merit Scholarship",
    provider: "NNPC/TotalEnergies",
    type: "SCHOLARSHIP" as const,
    category: "ENGINEERING" as const,
    description: "Annual scholarship for Nigerian undergraduates in selected fields.",
    eligibility: "Nigerian undergraduate, JAMB score 200+",
    deadline: new Date("2026-10-01"),
    link: "https://totalenergies.com.ng",
    level: null,
  },
  {
    title: "Google Africa Developer Scholarship",
    provider: "Google",
    type: "FELLOWSHIP" as const,
    category: "TECHNOLOGY" as const,
    description: "Free mobile/web development training with mentorship and certification.",
    eligibility: "18+, basic programming interest",
    deadline: new Date("2026-07-31"),
    link: "https://developers.google.com/africa",
    level: null,
  },
  {
    title: "Civil Engineering National Quiz Competition",
    provider: "Nigerian Society of Engineers",
    type: "COMPETITION" as const,
    category: "ENGINEERING" as const,
    description: "Annual quiz competition for engineering undergraduates with cash prizes.",
    eligibility: "Engineering undergraduate, any Nigerian university",
    deadline: new Date("2026-09-15"),
    link: "https://nse.org.ng",
    level: null,
  },
  {
    title: "Andela Technical Leadership Internship",
    provider: "Andela",
    type: "INTERNSHIP" as const,
    category: "TECHNOLOGY" as const,
    description: "Paid software engineering internship with mentorship for early-career developers.",
    eligibility: "Strong programming fundamentals, portfolio of projects",
    deadline: new Date("2026-08-01"),
    link: "https://andela.com",
    level: null,
  },
  {
    title: "PwC Nigeria Graduate Internship",
    provider: "PwC Nigeria",
    type: "INTERNSHIP" as const,
    category: "BUSINESS" as const,
    description: "Summer internship program for final-year and recent graduates in accounting/business.",
    eligibility: "Final year or recent graduate, strong academic record",
    deadline: new Date("2026-07-15"),
    link: "https://pwc.com/ng",
    level: null,
  },
];

const universityPrograms = [
  {
    name: "University of Lagos (UNILAG)",
    country: "Nigeria",
    program: "Medicine & Surgery (MBBS)",
    requirements: "JAMB 250+, Post-UTME, O'level: Biology, Chemistry, Physics, Maths (credits)",
    link: "https://unilag.edu.ng",
  },
  {
    name: "Obafemi Awolowo University (OAU)",
    country: "Nigeria",
    program: "Computer Science",
    requirements: "JAMB 220+, Post-UTME, O'level: Maths, Physics, Chemistry/Biology",
    link: "https://oauife.edu.ng",
  },
  {
    name: "University of Ibadan (UI)",
    country: "Nigeria",
    program: "Law (LLB)",
    requirements: "JAMB 250+, Post-UTME, O'level: English, Literature, Government",
    link: "https://ui.edu.ng",
  },
  {
    name: "University of Toronto",
    country: "Canada",
    program: "Engineering Science",
    requirements: "WAEC/IB/A-level, SAT optional, strong Maths & Physics",
    link: "https://utoronto.ca",
  },
  {
    name: "University of Manchester",
    country: "United Kingdom",
    program: "BSc Data Science",
    requirements: "A-level/WAEC equivalent, strong Maths, IELTS 6.5+",
    link: "https://manchester.ac.uk",
  },
  {
    name: "Arizona State University",
    country: "United States",
    program: "BSc Computer Science",
    requirements: "WAEC/SAT, TOEFL/IELTS, strong Maths background",
    link: "https://asu.edu",
  },
];

const inventoryItems = [
  {
    name: "Zoology Made Easy",
    category: "TEXTBOOK" as const,
    price: 3500,
    stock: 12,
    condition: "Good",
    format: "Physical",
    description: "Comprehensive zoology textbook for JAMB and university first-year students.",
  },
  {
    name: "Campbell Biology 9th Edition",
    category: "TEXTBOOK" as const,
    price: 6000,
    stock: 5,
    condition: "Like new",
    format: "Physical",
    description: "Standard reference biology textbook used across Nigerian universities.",
  },
  {
    name: "UNILAG Post-UTME Past Questions (2019-2023)",
    category: "ACADEMIC_MATERIAL" as const,
    price: 1500,
    stock: 999,
    condition: null,
    format: "Digital",
    description: "Five-year pack of UNILAG Post-UTME past questions, delivered as PDF.",
  },
  {
    name: "JAMB CBT Practice Pack (9-year)",
    category: "ACADEMIC_MATERIAL" as const,
    price: 2500,
    stock: 999,
    condition: null,
    format: "Digital",
    description: "Nine-year JAMB past question pack with answers and explanations.",
  },
  {
    name: "HP Stream 14",
    category: "LAPTOP" as const,
    price: 75000,
    stock: 3,
    condition: "Refurbished, good",
    format: "Physical",
    description: "Lightweight laptop suitable for browsing, typing, and light coursework.",
  },
  {
    name: "Lenovo IdeaPad 1",
    category: "LAPTOP" as const,
    price: 92000,
    stock: 4,
    condition: "New",
    format: "Physical",
    description: "Entry-level laptop for students, new and sealed.",
  },
  {
    name: "Acer Aspire 3",
    category: "LAPTOP" as const,
    price: 88000,
    stock: 2,
    condition: "Refurbished, excellent",
    format: "Physical",
    description: "Reliable mid-range laptop, great for coding and coursework.",
  },
];

const hostels = [
  {
    name: "Akoka Student Lodge",
    type: "PARTNER" as const,
    area: "Akoka / Yaba (near UNILAG)",
    pricePerYear: 180000,
    deposit: 30000,
    roomsAvailable: 3,
    amenities: ["Water", "24hr generator", "Security", "WiFi"],
  },
  {
    name: "Yaba Comfort Rooms",
    type: "PARTNER" as const,
    area: "Akoka / Yaba (near UNILAG)",
    pricePerYear: 150000,
    deposit: 25000,
    roomsAvailable: 5,
    amenities: ["Water", "Security"],
  },
  {
    name: "ComplexOne Halls",
    type: "OWNED" as const,
    area: "Akoka / Yaba (near UNILAG)",
    pricePerYear: 220000,
    deposit: 44000,
    roomsAvailable: 4,
    amenities: ["24hr water", "Generator", "Security", "WiFi", "Study room"],
  },
  {
    name: "Surulere Student Annex",
    type: "PARTNER" as const,
    area: "Surulere",
    pricePerYear: 160000,
    deposit: 30000,
    roomsAvailable: 2,
    amenities: ["Water", "Security", "WiFi"],
  },
];

async function main() {
  console.log(`Seeding ${questions.length} questions...`);
  await prisma.question.deleteMany();
  for (const q of questions) {
    await prisma.question.create({ data: q });
  }

  console.log(`Seeding ${opportunities.length} opportunities...`);
  await prisma.opportunity.deleteMany();
  for (const o of opportunities) {
    await prisma.opportunity.create({ data: o });
  }

  console.log(`Seeding ${universityPrograms.length} university programs...`);
  await prisma.universityProgram.deleteMany();
  for (const u of universityPrograms) {
    await prisma.universityProgram.create({ data: u });
  }

  console.log(`Seeding ${inventoryItems.length} inventory items...`);
  await prisma.inventoryItem.deleteMany();
  for (const i of inventoryItems) {
    await prisma.inventoryItem.create({ data: i });
  }

  console.log(`Seeding ${hostels.length} hostels...`);
  await prisma.hostel.deleteMany();
  for (const h of hostels) {
    await prisma.hostel.create({ data: h });
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
