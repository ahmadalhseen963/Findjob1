import { 
  type User, type InsertUser,
  type Company, type InsertCompany,
  type Opportunity, type InsertOpportunity,
  type Cv, type InsertCv,
  type Application, type InsertApplication,
  type Message, type InsertMessage,
  type Notification, type InsertNotification,
  type SavedOpportunity, type InsertSavedOpportunity,
  users, companies, opportunities, cvs, applications, messages, notifications, savedOpportunities
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, sql, ilike } from "drizzle-orm";

export interface OpportunityFilters {
  type?: string;
  province?: string;
  category?: string;
  search?: string;
  status?: string;
  companyId?: string;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  
  getCompany(id: string): Promise<Company | undefined>;
  getCompaniesByUser(userId: string): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: string, data: Partial<InsertCompany>): Promise<Company | undefined>;
  
  getOpportunity(id: string): Promise<Opportunity | undefined>;
  getOpportunities(filters?: OpportunityFilters): Promise<Opportunity[]>;
  createOpportunity(opportunity: InsertOpportunity): Promise<Opportunity>;
  updateOpportunity(id: string, data: Partial<InsertOpportunity>): Promise<Opportunity | undefined>;
  incrementViewCount(id: string): Promise<void>;
  
  getApplication(id: string): Promise<Application | undefined>;
  getApplicationsByUser(userId: string): Promise<Application[]>;
  getApplicationsByOpportunity(opportunityId: string): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: string, data: Partial<InsertApplication>): Promise<Application | undefined>;
  
  getCv(id: string): Promise<Cv | undefined>;
  getCvsByUser(userId: string): Promise<Cv[]>;
  createCv(cv: InsertCv): Promise<Cv>;
  updateCv(id: string, data: Partial<InsertCv>): Promise<Cv | undefined>;
  deleteCv(id: string): Promise<boolean>;
  
  getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]>;
  getConversations(userId: string): Promise<{ partnerId: string; lastMessage: Message }[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: string): Promise<void>;
  
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<void>;
  markAllNotificationsAsRead(userId: string): Promise<void>;
  
  getSavedOpportunities(userId: string): Promise<SavedOpportunity[]>;
  saveOpportunity(data: InsertSavedOpportunity): Promise<SavedOpportunity>;
  unsaveOpportunity(userId: string, opportunityId: string): Promise<boolean>;
  isOpportunitySaved(userId: string, opportunityId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  async getCompany(id: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
  }

  async getCompaniesByUser(userId: string): Promise<Company[]> {
    return db.select().from(companies).where(eq(companies.userId, userId));
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const [company] = await db.insert(companies).values(insertCompany).returning();
    return company;
  }

  async updateCompany(id: string, data: Partial<InsertCompany>): Promise<Company | undefined> {
    const [company] = await db.update(companies).set(data).where(eq(companies.id, id)).returning();
    return company;
  }

  async getOpportunity(id: string): Promise<Opportunity | undefined> {
    const [opportunity] = await db.select().from(opportunities).where(eq(opportunities.id, id));
    return opportunity;
  }

  async getOpportunities(filters?: OpportunityFilters): Promise<Opportunity[]> {
    let query = db.select().from(opportunities);
    const conditions = [];

    if (filters?.type) {
      conditions.push(eq(opportunities.type, filters.type as any));
    }
    if (filters?.province) {
      conditions.push(eq(opportunities.province, filters.province as any));
    }
    if (filters?.category) {
      conditions.push(eq(opportunities.category, filters.category));
    }
    if (filters?.status) {
      conditions.push(eq(opportunities.status, filters.status as any));
    }
    if (filters?.companyId) {
      conditions.push(eq(opportunities.companyId, filters.companyId));
    }
    if (filters?.search) {
      conditions.push(
        or(
          ilike(opportunities.title, `%${filters.search}%`),
          ilike(opportunities.description, `%${filters.search}%`)
        )
      );
    }

    if (conditions.length > 0) {
      return db.select().from(opportunities).where(and(...conditions)).orderBy(desc(opportunities.createdAt));
    }
    
    return db.select().from(opportunities).orderBy(desc(opportunities.createdAt));
  }

  async createOpportunity(insertOpportunity: InsertOpportunity): Promise<Opportunity> {
    const [opportunity] = await db.insert(opportunities).values(insertOpportunity).returning();
    return opportunity;
  }

  async updateOpportunity(id: string, data: Partial<InsertOpportunity>): Promise<Opportunity | undefined> {
    const [opportunity] = await db.update(opportunities).set(data).where(eq(opportunities.id, id)).returning();
    return opportunity;
  }

  async incrementViewCount(id: string): Promise<void> {
    await db.update(opportunities)
      .set({ viewCount: sql`${opportunities.viewCount} + 1` })
      .where(eq(opportunities.id, id));
  }

  async getApplication(id: string): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application;
  }

  async getApplicationsByUser(userId: string): Promise<Application[]> {
    return db.select().from(applications).where(eq(applications.userId, userId)).orderBy(desc(applications.createdAt));
  }

  async getApplicationsByOpportunity(opportunityId: string): Promise<Application[]> {
    return db.select().from(applications).where(eq(applications.opportunityId, opportunityId)).orderBy(desc(applications.createdAt));
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const [application] = await db.insert(applications).values(insertApplication).returning();
    await db.update(opportunities)
      .set({ applicationCount: sql`${opportunities.applicationCount} + 1` })
      .where(eq(opportunities.id, insertApplication.opportunityId));
    return application;
  }

  async updateApplication(id: string, data: Partial<InsertApplication>): Promise<Application | undefined> {
    const [application] = await db.update(applications).set(data).where(eq(applications.id, id)).returning();
    return application;
  }

  async getCv(id: string): Promise<Cv | undefined> {
    const [cv] = await db.select().from(cvs).where(eq(cvs.id, id));
    return cv;
  }

  async getCvsByUser(userId: string): Promise<Cv[]> {
    return db.select().from(cvs).where(eq(cvs.userId, userId)).orderBy(desc(cvs.createdAt));
  }

  async createCv(insertCv: InsertCv): Promise<Cv> {
    const [cv] = await db.insert(cvs).values(insertCv).returning();
    return cv;
  }

  async updateCv(id: string, data: Partial<InsertCv>): Promise<Cv | undefined> {
    const [cv] = await db.update(cvs).set({ ...data, updatedAt: new Date() }).where(eq(cvs.id, id)).returning();
    return cv;
  }

  async deleteCv(id: string): Promise<boolean> {
    const result = await db.delete(cvs).where(eq(cvs.id, id)).returning();
    return result.length > 0;
  }

  async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]> {
    return db.select().from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
        )
      )
      .orderBy(messages.createdAt);
  }

  async getConversations(userId: string): Promise<{ partnerId: string; lastMessage: Message }[]> {
    const allMessages = await db.select().from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(desc(messages.createdAt));

    const conversationsMap = new Map<string, Message>();
    
    for (const msg of allMessages) {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, msg);
      }
    }

    return Array.from(conversationsMap.entries()).map(([partnerId, lastMessage]) => ({
      partnerId,
      lastMessage
    }));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  async markMessageAsRead(id: string): Promise<void> {
    await db.update(messages).set({ isRead: true }).where(eq(messages.id, id));
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(insertNotification).returning();
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));
  }

  async getSavedOpportunities(userId: string): Promise<SavedOpportunity[]> {
    return db.select().from(savedOpportunities)
      .where(eq(savedOpportunities.userId, userId))
      .orderBy(desc(savedOpportunities.createdAt));
  }

  async saveOpportunity(data: InsertSavedOpportunity): Promise<SavedOpportunity> {
    const [saved] = await db.insert(savedOpportunities).values(data).returning();
    return saved;
  }

  async unsaveOpportunity(userId: string, opportunityId: string): Promise<boolean> {
    const result = await db.delete(savedOpportunities)
      .where(and(eq(savedOpportunities.userId, userId), eq(savedOpportunities.opportunityId, opportunityId)))
      .returning();
    return result.length > 0;
  }

  async isOpportunitySaved(userId: string, opportunityId: string): Promise<boolean> {
    const [saved] = await db.select().from(savedOpportunities)
      .where(and(eq(savedOpportunities.userId, userId), eq(savedOpportunities.opportunityId, opportunityId)));
    return !!saved;
  }
}

export const storage = new DatabaseStorage();
