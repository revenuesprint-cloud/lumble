import { pgTable, text, uuid, boolean, timestamp, pgEnum, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const relationshipTypeEnum = pgEnum("relationship_type", [
  "crush", "situationship", "relationship", "ex",
]);

// ─── Users ───────────────────────────────────────────────────────────────────

export const usersTable = pgTable("users", {
  id:           uuid("id").primaryKey().defaultRandom(),
  email:        text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt:    timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export const selectUserSchema = createSelectSchema(usersTable);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;

// ─── Profiles ────────────────────────────────────────────────────────────────

export const profilesTable = pgTable("profiles", {
  id:               uuid("id").primaryKey().defaultRandom(),
  userId:           uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }).unique(),
  userName:         text("user_name").notNull(),
  userBirthDate:    text("user_birth_date").notNull(),
  userBirthTime:    text("user_birth_time"),
  partnerName:      text("partner_name").notNull(),
  partnerBirthDate: text("partner_birth_date").notNull(),
  relationshipType: relationshipTypeEnum("relationship_type").notNull(),
  isPremium:        boolean("is_premium").default(false).notNull(),
  premiumSince:     timestamp("premium_since", { withTimezone: true }),
  updatedAt:        timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertProfileSchema = createInsertSchema(profilesTable).omit({ id: true, updatedAt: true });
export const selectProfileSchema = createSelectSchema(profilesTable);
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profilesTable.$inferSelect;

// ─── Problems ─────────────────────────────────────────────────────────────────

export const severityEnum = pgEnum("severity", ["mild", "moderate", "severe"]);

export const problemsTable = pgTable("problems", {
  id:          uuid("id").primaryKey().defaultRandom(),
  title:       text("title").notNull(),
  description: text("description").notNull(),
  category:    text("category").notNull(),
  severity:    severityEnum("severity").notNull().default("moderate"),
  // Array of astrology tags for matching (e.g. "moon_rashi:Mesha", "dosha:mangal", "universal")
  tags:        text("tags").array().notNull().default([]),
  // Embedded solutions to avoid a join — [{title, description, type, isPremium}]
  solutions:   jsonb("solutions").notNull().default([]),
  sortOrder:   integer("sort_order").notNull().default(0),
  createdAt:   timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertProblemSchema = createInsertSchema(problemsTable).omit({ id: true, createdAt: true });
export const selectProblemSchema = createSelectSchema(problemsTable);
export type InsertProblem = z.infer<typeof insertProblemSchema>;
export type Problem = typeof problemsTable.$inferSelect;

export interface ProblemSolution {
  title: string;
  description: string;
  type: "practical" | "communication" | "spiritual" | "ritual" | "professional";
  isPremium: boolean;
}
