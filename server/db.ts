import { and, asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, portfolioProjects, quoteRequests, serviceCatalog, siteSettings, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) { if (user[field] !== undefined) { const value = user[field] ?? null; values[field] = value; updateSet[field] = value; } }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; } else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listPublicServices(category?: string) {
  const db = await getDb();
  if (!db) return [];
  const filters = category ? and(eq(serviceCatalog.isActive, true), eq(serviceCatalog.category, category)) : eq(serviceCatalog.isActive, true);
  return db.select().from(serviceCatalog).where(filters).orderBy(asc(serviceCatalog.sortOrder), asc(serviceCatalog.name));
}

export async function listPublicProjects(category?: string) {
  const db = await getDb();
  if (!db) return [];
  const filters = category ? and(eq(portfolioProjects.isActive, true), eq(portfolioProjects.category, category)) : eq(portfolioProjects.isActive, true);
  return db.select().from(portfolioProjects).where(filters).orderBy(asc(portfolioProjects.sortOrder), desc(portfolioProjects.createdAt));
}

export async function getPublicSettings() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ key: siteSettings.settingKey, value: siteSettings.settingValue }).from(siteSettings).where(eq(siteSettings.isPublic, true));
}

export async function createQuoteRequest(input: typeof quoteRequests.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(quoteRequests).values(input);
  return { id: result[0].insertId };
}

export { portfolioProjects, quoteRequests, serviceCatalog, siteSettings };
