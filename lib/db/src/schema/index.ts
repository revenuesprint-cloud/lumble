import { pgTable, text, uuid, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
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
