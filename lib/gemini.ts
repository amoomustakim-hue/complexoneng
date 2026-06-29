import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY ?? "";
const genAI = new GoogleGenerativeAI(apiKey);

export function getCoachModel() {
  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction:
      "You are ComplexOne's AI Academic Coach for Nigerian students preparing for JAMB, WAEC, NECO, and Post-UTME. " +
      "Give clear, encouraging, exam-focused study guidance: timetables, subject explanations, and practice strategies. " +
      "Keep responses concise and practical.",
  });
}

export function getQuizGeneratorModel() {
  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction:
      "You write short multiple-choice quiz questions for Nigerian students to check understanding of a " +
      "specific topic they just studied. Questions must be clear, exam-appropriate, and strictly based on the " +
      "topic given. Always respond with valid JSON only, matching the exact schema requested — no extra text.",
    generationConfig: { responseMimeType: "application/json" },
  });
}

export function getLessonHelperModel(lessonTitle: string, lessonContent: string) {
  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction:
      `You are ComplexOne's AI study helper for the specific lesson "${lessonTitle}". ` +
      `Lesson content: ${lessonContent ?? "No written content yet."}\n\n` +
      "Answer the student's questions about this lesson specifically — explain concepts, work through examples, " +
      "and clarify anything confusing. Stay focused on this lesson's topic. Keep responses concise.",
  });
}

export function getResearchAssistantModel() {
  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction:
      "You are ComplexOne's Research Assistant, supporting postgraduate students and researchers in Nigeria and Africa. " +
      "Help with research proposal structure, methodology choices, data analysis approaches (including SPSS/R/Python alternatives), " +
      "and academic referencing (APA, MLA, Harvard, Vancouver). Be precise and practical, and ask clarifying questions about " +
      "the student's field and research stage when it would change your advice. Keep responses concise.",
  });
}
