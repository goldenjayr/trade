import { notFound } from "next/navigation";

import { JournalView } from "@/components/journal/journal-view";
import { loadJournalIndex } from "@/lib/load";

export function generateStaticParams() {
  return loadJournalIndex().map((date) => ({ date }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  return { title: `Journal ${date}` };
}

export default async function JournalDatePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const dates = loadJournalIndex();
  if (!dates.includes(date)) notFound();
  return <JournalView date={date} dates={dates} />;
}
