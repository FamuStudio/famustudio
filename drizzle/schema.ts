import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const serviceCatalog = mysqlTable("service_catalog", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  name: varchar("name", { length: 180 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description"),
  deliverables: text("deliverables"),
  imageUrl: text("imageUrl"),
  priceMode: mysqlEnum("priceMode", ["fixed", "from", "quote"]).default("quote").notNull(),
  priceLabel: varchar("priceLabel", { length: 100 }),
  estimatedTimeline: varchar("estimatedTimeline", { length: 100 }),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const portfolioProjects = mysqlTable("portfolio_projects", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  title: varchar("title", { length: 180 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  type: varchar("type", { length: 120 }),
  description: text("description"),
  challenge: text("challenge"),
  objective: text("objective"),
  solution: text("solution"),
  result: text("result"),
  tools: text("tools"),
  coverUrl: text("coverUrl"),
  galleryUrls: text("galleryUrls"),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const quoteRequests = mysqlTable("quote_requests", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  company: varchar("company", { length: 180 }),
  phone: varchar("phone", { length: 80 }),
  email: varchar("email", { length: 320 }),
  services: text("services").notNull(),
  projectType: varchar("projectType", { length: 180 }),
  deadline: varchar("deadline", { length: 100 }),
  budget: varchar("budget", { length: 120 }),
  description: text("description"),
  preferredContact: mysqlEnum("preferredContact", ["whatsapp", "email", "phone"]).default("whatsapp").notNull(),
  status: mysqlEnum("status", ["new", "in_review", "quote_sent", "waiting_client", "in_production", "in_revision", "completed", "cancelled"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  settingKey: varchar("settingKey", { length: 120 }).notNull().unique(),
  settingValue: text("settingValue"),
  isPublic: boolean("isPublic").default(true).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type ServiceCatalogItem = typeof serviceCatalog.$inferSelect;
export type PortfolioProject = typeof portfolioProjects.$inferSelect;
export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type SiteSetting = typeof siteSettings.$inferSelect;
