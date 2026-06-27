import { openDB, type IDBPDatabase } from "idb";

export type CachedQuestion = {
  id: string;
  examType: string;
  subject: string;
  year: number | null;
  question: string;
  options: string[];
  answer: string;
  explanation: string | null;
};

const DB_NAME = "complexone-cbt";
const STORE_NAME = "questions";

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (typeof window === "undefined") return null;
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "key" });
        }
      },
    });
  }
  return dbPromise;
}

function cacheKey(examType: string, subject: string) {
  return `${examType}:${subject}`;
}

export async function getCachedQuestions(
  examType: string,
  subject: string
): Promise<CachedQuestion[] | null> {
  const db = await getDb();
  if (!db) return null;
  const record = await db.get(STORE_NAME, cacheKey(examType, subject));
  return record?.questions ?? null;
}

export async function setCachedQuestions(
  examType: string,
  subject: string,
  questions: CachedQuestion[]
) {
  const db = await getDb();
  if (!db) return;
  await db.put(STORE_NAME, {
    key: cacheKey(examType, subject),
    questions,
    cachedAt: Date.now(),
  });
}
