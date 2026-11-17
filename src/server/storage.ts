/* ==========================================================================
   Storage for everything the API writes: orders, subscribers, messages.

   Development: JSON files in ./.data (git-ignored), so the whole flow works on
   a laptop with nothing to install.

   Vercel: serverless functions have a read-only, short-lived filesystem, so
   there is nowhere durable to write until a database is connected. Rather than
   pretend an order was saved, writes are refused with StorageUnavailableError
   and the API answers 503. To go live, implement `insert` and `findOne` against
   a database (Postgres, MongoDB…) and switch on its connection string below.
   ========================================================================== */

import { promises as fs } from "node:fs";
import path from "node:path";

export type Collection = "orders" | "subscribers" | "messages";
type Row = Record<string, unknown>;

export class StorageUnavailableError extends Error {
  constructor() {
    super("No durable storage is configured.");
    this.name = "StorageUnavailableError";
  }
}

export const storageMode: "file" | "none" = process.env.VERCEL ? "none" : "file";

const DATA_DIR = path.join(process.cwd(), ".data");
const fileFor = (collection: Collection) => path.join(DATA_DIR, `${collection}.json`);

// Writes run one at a time so two requests can't interleave a read-modify-write.
let queue: Promise<unknown> = Promise.resolve();
function inOrder<T>(job: () => Promise<T>): Promise<T> {
  const run = queue.then(job, job);
  queue = run.catch(() => undefined);
  return run;
}

async function readAll(collection: Collection): Promise<Row[]> {
  try {
    return JSON.parse(await fs.readFile(fileFor(collection), "utf8"));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

export async function insert<T extends Row>(collection: Collection, row: T): Promise<T> {
  if (storageMode === "none") throw new StorageUnavailableError();
  return inOrder(async () => {
    const rows = await readAll(collection);
    rows.push(row);
    await fs.mkdir(DATA_DIR, { recursive: true });
    // Write to a temp file and rename, so a crash mid-write can't corrupt the collection.
    const tmp = fileFor(collection) + ".tmp";
    await fs.writeFile(tmp, JSON.stringify(rows, null, 2), "utf8");
    await fs.rename(tmp, fileFor(collection));
    return row;
  });
}

export async function findOne(collection: Collection, match: (row: Row) => boolean): Promise<Row | undefined> {
  if (storageMode === "none") throw new StorageUnavailableError();
  return (await readAll(collection)).find(match);
}
