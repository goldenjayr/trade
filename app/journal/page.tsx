import { JournalView } from "@/components/journal/journal-view";
import { loadJournalIndex } from "@/lib/load";

export const metadata = {
  title: "Journal",
};

export default function JournalIndexPage() {
  const dates = loadJournalIndex();
  const latest = dates[dates.length - 1] ?? "2026-09-07";
  return <JournalView date={latest} dates={dates} />;
}
