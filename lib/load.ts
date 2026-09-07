import { readFileSync } from "node:fs";
import { join } from "node:path";

import type {
  DayLog,
  DeskState,
  JournalEntry,
  RiskRails,
  Routine,
  Settings,
  Snapshot,
  Trade,
  Watchlists,
} from "./types";

const dataDir = join(process.cwd(), "data");

function readJson<T>(rel: string): T {
  return JSON.parse(readFileSync(join(dataDir, rel), "utf8")) as T;
}

export function loadSettings(): Settings {
  return readJson("settings.json");
}

export function loadDesk(): DeskState {
  return readJson("desk.json");
}

export function loadRisk(): RiskRails {
  return readJson("risk.json");
}

export function loadWatchlists(): Watchlists {
  return readJson("watchlists.json");
}

export function loadTrades(): Trade[] {
  return readJson("trades.json");
}

export function loadDays(): DayLog[] {
  return readJson("days.json");
}

export function loadSnapshots(): Snapshot[] {
  return readJson("snapshots.json");
}

export function loadRoutines(): Routine[] {
  return readJson("routines.json");
}

export function loadJournalIndex(): string[] {
  return readJson("journal/index.json");
}

export function loadJournal(date: string): JournalEntry {
  return readJson(`journal/${date}.json`);
}

export function loadLatestJournal(): JournalEntry {
  const index = loadJournalIndex();
  const latest = index[index.length - 1];
  if (!latest) {
    throw new Error("No journal entries. Run npm run desk:ingest with a daily packet.");
  }
  return loadJournal(latest);
}
