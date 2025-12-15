import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const userTypeEnum = pgEnum("user_type", ["individual", "employer", "admin"]);
export const opportunityTypeEnum = pgEnum("opportunity_type", ["job", "training", "volunteer"]);
export const opportunityStatusEnum = pgEnum("opportunity_status", ["pending", "approved", "rejected", "expired"]);
export const applicationStatusEnum = pgEnum("application_status", ["pending", "reviewed", "shortlisted", "rejected", "accepted"]);

export const syrianProvinces = [
  "damascus", "aleppo", "homs", "hama", "latakia", "tartus", 
  "deir_ez_zor", "raqqa", "hasakah", "daraa", "suwayda", 
  "quneitra", "idlib", "rif_dimashq"
] as const;

export const provinceEnum = pgEnum("province", syrianProvinces);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password"),
  username: text("username").notNull().unique(),
  fullName: text("full_name").notNull(),
  userType: userTypeEnum("user_type").notNull().default("individual"),
  avatar: text("avatar"),
  phone: text("phone"),
  province: provinceEnum("province"),
  bio: text("bio"),
  isVerified: boolean("is_verified").default(false),
  googleId: text("google_id"),
  preferredLanguage: text("preferred_language").default("ar"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  nameEn: text("name_en"),
  logo: text("logo"),
  coverImage: text("cover_image"),
  description: text("description"),
  descriptionEn: text("description_en"),
  website: text("website"),
  industry: text("industry"),
  employeeCount: text("employee_count"),
  province: provinceEnum("province"),
  address: text("address"),
  foundedYear: integer("founded_year"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const opportunities = pgTable("opportunities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => companies.id),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  description: text("description").notNull(),
  descriptionEn: text("description_en"),
  type: opportunityTypeEnum("type").notNull(),
  province: provinceEnum("province").notNull(),
  category: text("category"),
  requirements: text("requirements"),
  benefits: text("benefits"),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  currency: text("currency").default("USD"),
  experienceLevel: text("experience_level"),
  educationLevel: text("education_level"),
  employmentType: text("employment_type"),
  deadline: timestamp("deadline"),
  status: opportunityStatusEnum("status").default("pending"),
  aiMatchScore: integer("ai_match_score"),
  viewCount: integer("view_count").default(0),
  applicationCount: integer("application_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cvs = pgTable("cvs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  personalInfo: text("personal_info"),
  summary: text("summary"),
  experience: text("experience"),
  education: text("education"),
  skills: text("skills"),
  languages: text("languages"),
  certifications: text("certifications"),
  references: text("references"),
  isAtsOptimized: boolean("is_ats_optimized").default(false),
  atsScore: integer("ats_score"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  opportunityId: varchar("opportunity_id").notNull().references(() => opportunities.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  cvId: varchar("cv_id").references(() => cvs.id),
  coverLetter: text("cover_letter"),
  status: applicationStatusEnum("status").default("pending"),
  aiScore: integer("ai_score"),
  aiAnalysis: text("ai_analysis"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  opportunityId: varchar("opportunity_id").references(() => opportunities.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(),
  link: text("link"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const savedOpportunities = pgTable("saved_opportunities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  opportunityId: varchar("opportunity_id").notNull().references(() => opportunities.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  company: one(companies, { fields: [users.id], references: [companies.userId] }),
  cvs: many(cvs),
  applications: many(applications),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
  notifications: many(notifications),
  savedOpportunities: many(savedOpportunities),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  user: one(users, { fields: [companies.userId], references: [users.id] }),
  opportunities: many(opportunities),
}));

export const opportunitiesRelations = relations(opportunities, ({ one, many }) => ({
  company: one(companies, { fields: [opportunities.companyId], references: [companies.id] }),
  applications: many(applications),
  savedBy: many(savedOpportunities),
}));

export const cvsRelations = relations(cvs, ({ one, many }) => ({
  user: one(users, { fields: [cvs.userId], references: [users.id] }),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  opportunity: one(opportunities, { fields: [applications.opportunityId], references: [opportunities.id] }),
  user: one(users, { fields: [applications.userId], references: [users.id] }),
  cv: one(cvs, { fields: [applications.cvId], references: [cvs.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, { fields: [messages.senderId], references: [users.id], relationName: "sender" }),
  receiver: one(users, { fields: [messages.receiverId], references: [users.id], relationName: "receiver" }),
  opportunity: one(opportunities, { fields: [messages.opportunityId], references: [opportunities.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const savedOpportunitiesRelations = relations(savedOpportunities, ({ one }) => ({
  user: one(users, { fields: [savedOpportunities.userId], references: [users.id] }),
  opportunity: one(opportunities, { fields: [savedOpportunities.opportunityId], references: [opportunities.id] }),
}));

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertCompanySchema = createInsertSchema(companies).omit({ id: true, createdAt: true });
export const insertOpportunitySchema = createInsertSchema(opportunities).omit({ id: true, createdAt: true, viewCount: true, applicationCount: true });
export const insertCvSchema = createInsertSchema(cvs).omit({ id: true, createdAt: true, updatedAt: true });
export const insertApplicationSchema = createInsertSchema(applications).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const insertSavedOpportunitySchema = createInsertSchema(savedOpportunities).omit({ id: true, createdAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;
export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;
export type Opportunity = typeof opportunities.$inferSelect;
export type InsertCv = z.infer<typeof insertCvSchema>;
export type Cv = typeof cvs.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertSavedOpportunity = z.infer<typeof insertSavedOpportunitySchema>;
export type SavedOpportunity = typeof savedOpportunities.$inferSelect;

export type Province = typeof syrianProvinces[number];
export type OpportunityType = "job" | "training" | "volunteer";
export type UserType = "individual" | "employer" | "admin";
