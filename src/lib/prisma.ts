import { readFileSync } from "node:fs";
import path from "node:path";
import { config as loadDotenv, parse as parseDotenv } from "dotenv";
import dbConnect from "@/lib/db";
import ArchitectureHero from "@/models/ArchitectureHero";
import ArchitectureLead from "@/models/ArchitectureLead";
import ArchitectureProject from "@/models/ArchitectureProject";
import ArchitectureMedia from "@/models/ArchitectureMedia";
import ArchitecturePageView from "@/models/ArchitecturePageView";
import ContactInquiry from "@/models/ContactInquiry";
import IngestionEvent from "@/models/IngestionEvent";
import Lead from "@/models/Lead";
import Notification from "@/models/Notification";
import Subscriber from "@/models/Subscriber";
import NewsletterSubscriber from "@/models/NewsletterSubscriber";
import Admin from "@/models/Admin";

const envCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), ".env.local"),
  path.resolve(process.cwd(), "../apps/api/.env"),
  path.resolve(process.cwd(), "../api/.env"),
  path.resolve(process.cwd(), "../../apps/api/.env"),
  path.resolve(process.cwd(), "apps/api/.env")
];

function mongodbUriIsConfigured() {
  return Boolean(process.env.MONGODB_URI?.trim());
}

function loadMongodbUriFromEnvFile(envPath: string) {
  loadDotenv({ path: envPath, override: false });
  if (mongodbUriIsConfigured()) return true;

  try {
    const parsed = parseDotenv(readFileSync(envPath));
    const uri = parsed.MONGODB_URI?.trim();
    if (!uri) return false;

    process.env.MONGODB_URI = uri;
    return true;
  } catch {
    return false;
  }
}

if (!mongodbUriIsConfigured()) {
  for (const envPath of envCandidates) {
    if (loadMongodbUriFromEnvFile(envPath)) break;
  }
}

dbConnect();

function convertWhere(where: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(where)) {
    if (key === "id") {
      result._id = value;
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const inner: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        if (k === "not") inner.$ne = v;
        else if (k === "in") inner.$in = v;
        else if (k === "gte") inner.$gte = v;
        else if (k === "gt") inner.$gt = v;
        else if (k === "contains") { inner.$regex = v; inner.$options = "i"; }
        else inner[k] = v;
      }
      result[key] = inner;
    } else {
      result[key] = value;
    }
  }
  return result;
}

function convertOrderBy(orderBy: Record<string, string> | Record<string, string>[]): Record<string, 1 | -1> {
  const arr = Array.isArray(orderBy) ? orderBy : [orderBy];
  const sort: Record<string, 1 | -1> = {};
  for (const item of arr) {
    for (const [key, dir] of Object.entries(item)) {
      sort[key] = dir === "desc" ? -1 : 1;
    }
  }
  return sort;
}

function convertSelect(select?: Record<string, boolean>): string {
  if (!select) return "";
  return Object.entries(select)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join(" ");
}

function convertData(data: Record<string, unknown>): Record<string, unknown> {
  const setData: Record<string, unknown> = {};
  const incData: Record<string, unknown> = {};
  let hasInc = false;

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const inner = value as Record<string, unknown>;
      if ("increment" in inner) {
        incData[key] = inner.increment;
        hasInc = true;
      } else {
        setData[key] = value;
      }
    } else {
      setData[key] = value;
    }
  }

  const updateDoc: Record<string, unknown> = {};
  if (Object.keys(setData).length > 0) updateDoc.$set = setData;
  if (hasInc) updateDoc.$inc = incData;
  return updateDoc;
}

function mapDoc<T extends Record<string, unknown>>(doc: T): T & { id: string } {
  const { _id, ...rest } = doc;
  return { ...rest, id: String(_id) } as T & { id: string };
}

function mapDocs<T extends Record<string, unknown>>(docs: T[]): (T & { id: string })[] {
  return docs.map(mapDoc);
}

async function runQuery<T>(fn: () => Promise<T>): Promise<T> {
  await dbConnect();
  return fn();
}

export const prisma = {
  architectureHero: {
    findUnique: async ({ where, select }: { where: { key?: string }; select?: Record<string, boolean> }) =>
      runQuery(async () => {
        let query = ArchitectureHero.findOne(convertWhere(where));
        if (select) query = query.select(convertSelect(select));
        const doc = await query.lean() as unknown as Record<string, unknown> | null;
        return doc ? mapDoc(doc) : null;
      }),
    upsert: async ({ where, update, create }: { where: { key: string }; update: Record<string, unknown>; create: Record<string, unknown> }) =>
      runQuery(async () => {
        const doc = await ArchitectureHero.findOneAndUpdate(
          convertWhere(where),
          { $set: update, $setOnInsert: create },
          { upsert: true, new: true }
        ).lean() as unknown as Record<string, unknown> | null;
        if (!doc) throw new Error("Upsert failed");
        return mapDoc(doc);
      }),
  },
  architectureProject: {
    findUnique: async ({ where, select }: { where: { slug?: string; id?: string }; select?: Record<string, boolean> }) =>
      runQuery(async () => {
        let query = ArchitectureProject.findOne(convertWhere(where));
        if (select) query = query.select(convertSelect(select));
        const doc = await query.lean() as unknown as Record<string, unknown> | null;
        return doc ? mapDoc(doc) : null;
      }),
    findMany: async ({ where, orderBy, take, select }: { where?: Record<string, unknown>; orderBy?: Record<string, string> | Record<string, string>[]; take?: number; select?: Record<string, boolean> }) =>
      runQuery(async () => {
        let query = ArchitectureProject.find(where ? convertWhere(where) : {});
        if (orderBy) query = query.sort(convertOrderBy(orderBy));
        if (take) query = query.limit(take);
        if (select) query = query.select(convertSelect(select));
        const docs = await query.lean() as unknown as Record<string, unknown>[];
        return mapDocs(docs);
      }),
    findFirst: async ({ where, orderBy, select }: { where?: Record<string, unknown>; orderBy?: Record<string, string> | Record<string, string>[]; select?: Record<string, boolean> }) =>
      runQuery(async () => {
        let query = ArchitectureProject.findOne(where ? convertWhere(where) : {});
        if (orderBy) query = query.sort(convertOrderBy(orderBy));
        if (select) query = query.select(convertSelect(select));
        const doc = await query.lean() as unknown as Record<string, unknown> | null;
        return doc ? mapDoc(doc) : null;
      }),
    count: async ({ where }: { where?: Record<string, unknown> } = {}) =>
      runQuery(async () => ArchitectureProject.countDocuments(where ? convertWhere(where) : {})),
    update: async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) =>
      runQuery(async () => {
        const doc = await ArchitectureProject.findByIdAndUpdate(where.id, convertData(data), { new: true }).lean() as unknown as Record<string, unknown> | null;
        if (!doc) throw new Error("Document not found");
        return mapDoc(doc);
      }),
  },
  architectureLead: {
    findMany: async ({ where, orderBy, take, select }: { where?: Record<string, unknown>; orderBy?: Record<string, string> | Record<string, string>[]; take?: number; select?: Record<string, boolean> }) =>
      runQuery(async () => {
        let query = ArchitectureLead.find(where ? convertWhere(where) : {});
        if (orderBy) query = query.sort(convertOrderBy(orderBy));
        if (take) query = query.limit(take);
        if (select) query = query.select(convertSelect(select));
        const docs = await query.lean() as unknown as Record<string, unknown>[];
        return mapDocs(docs);
      }),
    count: async ({ where }: { where?: Record<string, unknown> } = {}) =>
      runQuery(async () => ArchitectureLead.countDocuments(where ? convertWhere(where) : {})),
    create: async ({ data }: { data: Record<string, unknown> }) =>
      runQuery(async () => {
        const doc = await ArchitectureLead.create(data);
        return mapDoc(doc.toObject());
      }),
  },
  architectureMedia: {
    findMany: async ({ where, orderBy, take, select }: { where?: Record<string, unknown>; orderBy?: Record<string, string> | Record<string, string>[]; take?: number; select?: Record<string, boolean> }) =>
      runQuery(async () => {
        let query = ArchitectureMedia.find(where ? convertWhere(where) : {});
        if (orderBy) query = query.sort(convertOrderBy(orderBy));
        if (take) query = query.limit(take);
        if (select) query = query.select(convertSelect(select));
        const docs = await query.lean() as unknown as Record<string, unknown>[];
        return mapDocs(docs);
      }),
  },
  architecturePageView: {
    count: async ({ where }: { where?: Record<string, unknown> } = {}) =>
      runQuery(async () => ArchitecturePageView.countDocuments(where ? convertWhere(where) : {})),
    create: async ({ data }: { data: Record<string, unknown> }) =>
      runQuery(async () => {
        const doc = await ArchitecturePageView.create(data);
        return mapDoc(doc.toObject());
      }),
  },
  contactInquiry: {
    create: async ({ data }: { data: Record<string, unknown> }) =>
      runQuery(async () => {
        const doc = await ContactInquiry.create(data);
        return mapDoc(doc.toObject());
      }),
  },
  ingestionEvent: {
    create: async ({ data }: { data: Record<string, unknown> }) =>
      runQuery(async () => {
        const doc = await IngestionEvent.create(data);
        return mapDoc(doc.toObject());
      }),
    update: async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) =>
      runQuery(async () => {
        const doc = await IngestionEvent.findByIdAndUpdate(where.id, convertData(data), { new: true }).lean() as unknown as Record<string, unknown> | null;
        if (!doc) throw new Error("Document not found");
        return mapDoc(doc);
      }),
  },
  lead: {
    create: async ({ data }: { data: Record<string, unknown> }) =>
      runQuery(async () => {
        const doc = await Lead.create(data);
        return mapDoc(doc.toObject());
      }),
  },
  notification: {
    create: async ({ data }: { data: Record<string, unknown> }) =>
      runQuery(async () => {
        const doc = await Notification.create(data);
        return mapDoc(doc.toObject());
      }),
    findMany: async ({ where, orderBy, take, select }: { where?: Record<string, unknown>; orderBy?: Record<string, string> | Record<string, string>[]; take?: number; select?: Record<string, boolean> }) =>
      runQuery(async () => {
        let query = Notification.find(where ? convertWhere(where) : {});
        if (orderBy) query = query.sort(convertOrderBy(orderBy));
        if (take) query = query.limit(take);
        if (select) query = query.select(convertSelect(select));
        const docs = await query.lean() as unknown as Record<string, unknown>[];
        return mapDocs(docs);
      }),
    createMany: async ({ data, skipDuplicates }: { data: Record<string, unknown>[]; skipDuplicates?: boolean }) =>
      runQuery(async () => {
        try {
          const docs = await Notification.insertMany(data, { ordered: !skipDuplicates });
          return { count: docs.length };
        } catch {
          return { count: 0 };
        }
      }),
  },
  subscriber: {
    findUnique: async ({ where }: { where: { email?: string } }) =>
      runQuery(async () => {
        const doc = await Subscriber.findOne(convertWhere(where)).lean() as unknown as Record<string, unknown> | null;
        return doc ? mapDoc(doc) : null;
      }),
    create: async ({ data }: { data: Record<string, unknown> }) =>
      runQuery(async () => {
        const doc = await Subscriber.create(data);
        return mapDoc(doc.toObject());
      }),
  },
  newsletterSubscriber: {
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) =>
      runQuery(async () => {
        const doc = await NewsletterSubscriber.findOne(convertWhere(where)).lean() as unknown as Record<string, unknown> | null;
        return doc ? mapDoc(doc) : null;
      }),
    update: async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) =>
      runQuery(async () => {
        const doc = await NewsletterSubscriber.findByIdAndUpdate(where.id, convertData(data), { new: true }).lean() as unknown as Record<string, unknown> | null;
        if (!doc) throw new Error("Document not found");
        return mapDoc(doc);
      }),
    create: async ({ data }: { data: Record<string, unknown> }) =>
      runQuery(async () => {
        const doc = await NewsletterSubscriber.create(data);
        return mapDoc(doc.toObject());
      }),
  },
  admin: {
    findMany: async ({ where, select }: { where?: Record<string, unknown>; select?: Record<string, boolean> }) =>
      runQuery(async () => {
        let query = Admin.find(where ? convertWhere(where) : {});
        if (select) query = query.select(convertSelect(select));
        const docs = await query.lean() as unknown as Record<string, unknown>[];
        return mapDocs(docs);
      }),
  },
};

export function getPrismaClient() {
  return prisma;
}

const globalForPrisma = globalThis as unknown as {
  ractyshArchitecturePrisma?: typeof prisma;
};

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.ractyshArchitecturePrisma = prisma;
}
