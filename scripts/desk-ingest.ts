import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

import { finalizeBook } from "../lib/books";
import { dailyPacketSchema } from "../lib/schema";
import type {
  DayLog,
  DeskState,
  JournalEntry,
  Settings,
  Snapshot,
  Trade,
  Watchlists,
} from "../lib/types";

const root = process.cwd();
const dataDir = join(root, "data");
const inboxDir = join(root, "inbox");
const journalDir = join(dataDir, "journal");

function readJson<T>(path: string, fallback?: T): T {
  if (!existsSync(path)) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required file: ${path}`);
  }
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function writeJson(path: string, value: unknown) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function packetPaths(): string[] {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  if (args.length > 0) {
    return args.map((a) => resolve(root, a));
  }
  if (!existsSync(inboxDir)) return [];
  return readdirSync(inboxDir)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .map((f) => join(inboxDir, f))
    .sort();
}

function ingestOne(path: string) {
  if (!existsSync(path)) {
    throw new Error(`Packet not found: ${path}`);
  }
  const raw: unknown = JSON.parse(readFileSync(path, "utf8"));
  const packet = dailyPacketSchema.parse(raw);
  if (packet.journal.date !== packet.date) {
    throw new Error(
      `Journal date ${packet.journal.date} does not match packet date ${packet.date}`,
    );
  }

  const settings = readJson<Settings>(join(dataDir, "settings.json"));
  if (packet.usdphp) {
    settings.usdphp = packet.usdphp;
    settings.fxAsOf = packet.date;
    writeJson(join(dataDir, "settings.json"), settings);
  }

  const coins = finalizeBook(packet.books.coins, settings);
  const gotrade = finalizeBook(packet.books.gotrade, settings);

  const journal: JournalEntry = packet.journal;
  writeJson(join(journalDir, `${packet.date}.json`), journal);

  const indexPath = join(journalDir, "index.json");
  const index = readJson<string[]>(indexPath, []);
  if (!index.includes(packet.date)) index.push(packet.date);
  index.sort();
  writeJson(indexPath, index);

  const days = readJson<DayLog[]>(join(dataDir, "days.json"), []);
  const day: DayLog = {
    date: packet.date,
    stance: packet.stance,
    summary: packet.notes ?? packet.stanceReason,
    tradeCount: (packet.trades ?? []).filter((t) => !t.skipped).length,
    coinsEquity: coins.equity,
    gotradeEquity: gotrade.equity,
  };
  const dayIdx = days.findIndex((d) => d.date === packet.date);
  if (dayIdx >= 0) days[dayIdx] = day;
  else days.push(day);
  days.sort((a, b) => a.date.localeCompare(b.date));
  writeJson(join(dataDir, "days.json"), days);

  const snapshots = readJson<Snapshot[]>(join(dataDir, "snapshots.json"), []);
  const snap: Snapshot = {
    date: packet.date,
    coinsEquity: coins.equity,
    gotradeEquity: gotrade.equity,
    coinsCash: coins.cash,
    gotradeCash: gotrade.cash,
    usdphp: packet.usdphp ?? settings.usdphp,
  };
  const snapIdx = snapshots.findIndex((s) => s.date === packet.date);
  if (snapIdx >= 0) snapshots[snapIdx] = snap;
  else snapshots.push(snap);
  snapshots.sort((a, b) => a.date.localeCompare(b.date));
  writeJson(join(dataDir, "snapshots.json"), snapshots);

  if (packet.trades?.length) {
    const trades = readJson<Trade[]>(join(dataDir, "trades.json"), []);
    const ids = new Set(trades.map((t) => t.id));
    for (const trade of packet.trades) {
      if (ids.has(trade.id)) {
        const i = trades.findIndex((t) => t.id === trade.id);
        trades[i] = trade;
      } else {
        trades.push(trade);
        ids.add(trade.id);
      }
    }
    trades.sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
    writeJson(join(dataDir, "trades.json"), trades);
  }

  if (packet.watchlistMarks?.length) {
    const lists = readJson<Watchlists>(join(dataDir, "watchlists.json"));
    const marks = new Map(
      packet.watchlistMarks.map((m) => [m.symbol.toUpperCase(), m]),
    );
    for (const item of [...lists.crypto, ...lists.us]) {
      const mark = marks.get(item.symbol.toUpperCase());
      if (!mark) continue;
      item.last = mark.last;
      if (mark.changePct !== undefined) item.changePct = mark.changePct;
    }
    lists.asOf = packet.date;
    writeJson(join(dataDir, "watchlists.json"), lists);
  }

  const current = readJson<DeskState>(join(dataDir, "desk.json"));
  if (packet.date >= current.asOf) {
    const desk: DeskState = {
      asOf: packet.date,
      timezone: "Asia/Manila",
      stance: packet.stance,
      stanceReason: packet.stanceReason,
      primaries: packet.primaries ?? current.primaries,
      books: { coins, gotrade },
      catalysts: packet.catalysts ?? current.catalysts,
    };
    writeJson(join(dataDir, "desk.json"), desk);
  } else if (packet.catalysts) {
    current.catalysts = packet.catalysts;
    writeJson(join(dataDir, "desk.json"), current);
  }

  console.log(`ingested ${basename(path)} → ${packet.date} ${packet.stance}`);
}

function main() {
  const paths = packetPaths();
  if (paths.length === 0) {
    console.log("desk:ingest — no packets. Drop JSON in inbox/ or pass a path.");
    process.exit(0);
  }
  for (const path of paths) ingestOne(path);
}

main();
