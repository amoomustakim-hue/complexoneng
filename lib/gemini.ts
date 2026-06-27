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
