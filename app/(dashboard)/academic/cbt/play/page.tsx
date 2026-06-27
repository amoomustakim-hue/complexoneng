import { redirect } from "next/navigation";
import CbtEngine from "@/components/cbt/CbtEngine";

export default async function CbtPlayPage({
  searchParams,
}: {
  searchParams: Promise<{ examType?: string; subject?: string }>;
}) {
  const { examType, subject } = await searchParams;

  if (!examType || !subject) {
    redirect("/academic/cbt");
  }

  return <CbtEngine examType={examType} subject={subject} />;
}
