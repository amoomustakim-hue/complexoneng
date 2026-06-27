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

async function main() {
  console.log(`Seeding ${questions.length} questions...`);
  for (const q of questions) {
    await prisma.question.create({ data: q });
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
