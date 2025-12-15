import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertCompanySchema, insertOpportunitySchema,
  insertCvSchema, insertApplicationSchema, insertMessageSchema,
  insertNotificationSchema, insertSavedOpportunitySchema
} from "@shared/schema";
import bcrypt from "bcryptjs";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "pg";

const PgSession = connectPgSimple(session);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      username: string;
      fullName: string;
      userType: "individual" | "employer" | "admin";
    }
  }
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.use(
    session({
      store: new PgSession({
        pool,
        tableName: "user_sessions",
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "find-job-syria-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user || !user.password) {
            return done(null, false, { message: "Invalid credentials" });
          }
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            return done(null, false, { message: "Invalid credentials" });
          }
          return done(null, {
            id: user.id,
            email: user.email,
            username: user.username,
            fullName: user.fullName,
            userType: user.userType,
          });
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      if (user) {
        done(null, {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          userType: user.userType,
        });
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err);
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { confirmPassword, ...userData } = req.body;
      const parsed = insertUserSchema.safeParse(userData);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }

      const existingEmail = await storage.getUserByEmail(parsed.data.email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const existingUsername = await storage.getUserByUsername(parsed.data.username);
      if (existingUsername) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(parsed.data.password || "", 10);
      const user = await storage.createUser({
        ...parsed.data,
        password: hashedPassword,
      });

      req.login(
        {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          userType: user.userType,
        },
        (err) => {
          if (err) {
            return res.status(500).json({ error: "Login failed" });
          }
          res.json({ user: { ...user, password: undefined } });
        }
      );
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: Express.User | false, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ error: info?.message || "Invalid credentials" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        res.json({ user });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ user: req.user });
    } else {
      res.json({ user: null });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ ...user, password: undefined });
  });

  app.patch("/api/users/:id", requireAuth, async (req, res) => {
    if (req.user?.id !== req.params.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const user = await storage.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ ...user, password: undefined });
  });

  app.get("/api/companies", async (req, res) => {
    const userId = req.query.userId as string | undefined;
    if (userId) {
      const companies = await storage.getCompaniesByUser(userId);
      return res.json(companies);
    }
    res.json([]);
  });

  app.get("/api/companies/:id", async (req, res) => {
    const company = await storage.getCompany(req.params.id);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json(company);
  });

  app.post("/api/companies", requireAuth, async (req, res) => {
    try {
      const parsed = insertCompanySchema.safeParse({ ...req.body, userId: req.user?.id });
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      const company = await storage.createCompany(parsed.data);
      res.json(company);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/companies/:id", requireAuth, async (req, res) => {
    const company = await storage.getCompany(req.params.id);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    if (company.userId !== req.user?.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const updated = await storage.updateCompany(req.params.id, req.body);
    res.json(updated);
  });

  app.get("/api/opportunities", async (req, res) => {
    const filters = {
      type: req.query.type as string | undefined,
      province: req.query.province as string | undefined,
      category: req.query.category as string | undefined,
      search: req.query.search as string | undefined,
      status: req.query.status as string | undefined,
      companyId: req.query.companyId as string | undefined,
    };
    const opportunities = await storage.getOpportunities(filters);
    res.json(opportunities);
  });

  app.get("/api/opportunities/:id", async (req, res) => {
    const opportunity = await storage.getOpportunity(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ error: "Opportunity not found" });
    }
    await storage.incrementViewCount(req.params.id);
    res.json(opportunity);
  });

  app.post("/api/opportunities", requireAuth, async (req, res) => {
    try {
      const parsed = insertOpportunitySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      const company = await storage.getCompany(parsed.data.companyId);
      if (!company || company.userId !== req.user?.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const opportunity = await storage.createOpportunity(parsed.data);
      res.json(opportunity);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/opportunities/:id", requireAuth, async (req, res) => {
    const opportunity = await storage.getOpportunity(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ error: "Opportunity not found" });
    }
    const company = await storage.getCompany(opportunity.companyId);
    if (!company || company.userId !== req.user?.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const updated = await storage.updateOpportunity(req.params.id, req.body);
    res.json(updated);
  });

  app.get("/api/applications", requireAuth, async (req, res) => {
    const userId = req.query.userId as string | undefined;
    const opportunityId = req.query.opportunityId as string | undefined;
    
    if (opportunityId) {
      const opportunity = await storage.getOpportunity(opportunityId);
      if (!opportunity) {
        return res.status(404).json({ error: "Opportunity not found" });
      }
      const company = await storage.getCompany(opportunity.companyId);
      if (company?.userId !== req.user?.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const applications = await storage.getApplicationsByOpportunity(opportunityId);
      return res.json(applications);
    }
    
    if (userId && userId === req.user?.id) {
      const applications = await storage.getApplicationsByUser(userId);
      return res.json(applications);
    }
    
    res.status(400).json({ error: "userId or opportunityId required" });
  });

  app.get("/api/applications/:id", requireAuth, async (req, res) => {
    const application = await storage.getApplication(req.params.id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    if (application.userId !== req.user?.id) {
      const opportunity = await storage.getOpportunity(application.opportunityId);
      const company = opportunity ? await storage.getCompany(opportunity.companyId) : null;
      if (company?.userId !== req.user?.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
    }
    res.json(application);
  });

  app.post("/api/applications", requireAuth, async (req, res) => {
    try {
      const parsed = insertApplicationSchema.safeParse({ ...req.body, userId: req.user?.id });
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      const application = await storage.createApplication(parsed.data);
      res.json(application);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/applications/:id", requireAuth, async (req, res) => {
    const application = await storage.getApplication(req.params.id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    const opportunity = await storage.getOpportunity(application.opportunityId);
    const company = opportunity ? await storage.getCompany(opportunity.companyId) : null;
    if (company?.userId !== req.user?.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const updated = await storage.updateApplication(req.params.id, req.body);
    res.json(updated);
  });

  app.get("/api/cvs", requireAuth, async (req, res) => {
    const cvs = await storage.getCvsByUser(req.user!.id);
    res.json(cvs);
  });

  app.get("/api/cvs/:id", requireAuth, async (req, res) => {
    const cv = await storage.getCv(req.params.id);
    if (!cv) {
      return res.status(404).json({ error: "CV not found" });
    }
    if (cv.userId !== req.user?.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    res.json(cv);
  });

  app.post("/api/cvs", requireAuth, async (req, res) => {
    try {
      const parsed = insertCvSchema.safeParse({ ...req.body, userId: req.user?.id });
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      const cv = await storage.createCv(parsed.data);
      res.json(cv);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/cvs/:id", requireAuth, async (req, res) => {
    const cv = await storage.getCv(req.params.id);
    if (!cv) {
      return res.status(404).json({ error: "CV not found" });
    }
    if (cv.userId !== req.user?.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const updated = await storage.updateCv(req.params.id, req.body);
    res.json(updated);
  });

  app.delete("/api/cvs/:id", requireAuth, async (req, res) => {
    const cv = await storage.getCv(req.params.id);
    if (!cv) {
      return res.status(404).json({ error: "CV not found" });
    }
    if (cv.userId !== req.user?.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    await storage.deleteCv(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/messages/conversations", requireAuth, async (req, res) => {
    const conversations = await storage.getConversations(req.user!.id);
    res.json(conversations);
  });

  app.get("/api/messages/:partnerId", requireAuth, async (req, res) => {
    const messages = await storage.getMessagesBetweenUsers(req.user!.id, req.params.partnerId);
    res.json(messages);
  });

  app.post("/api/messages", requireAuth, async (req, res) => {
    try {
      const parsed = insertMessageSchema.safeParse({ ...req.body, senderId: req.user?.id });
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      const message = await storage.createMessage(parsed.data);
      res.json(message);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/messages/:id/read", requireAuth, async (req, res) => {
    await storage.markMessageAsRead(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/notifications", requireAuth, async (req, res) => {
    const notifications = await storage.getNotifications(req.user!.id);
    res.json(notifications);
  });

  app.patch("/api/notifications/:id/read", requireAuth, async (req, res) => {
    await storage.markNotificationAsRead(req.params.id);
    res.json({ success: true });
  });

  app.patch("/api/notifications/read-all", requireAuth, async (req, res) => {
    await storage.markAllNotificationsAsRead(req.user!.id);
    res.json({ success: true });
  });

  app.get("/api/saved", requireAuth, async (req, res) => {
    const saved = await storage.getSavedOpportunities(req.user!.id);
    res.json(saved);
  });

  app.get("/api/saved/:opportunityId", requireAuth, async (req, res) => {
    const isSaved = await storage.isOpportunitySaved(req.user!.id, req.params.opportunityId);
    res.json({ isSaved });
  });

  app.post("/api/saved", requireAuth, async (req, res) => {
    try {
      const parsed = insertSavedOpportunitySchema.safeParse({ 
        userId: req.user?.id,
        opportunityId: req.body.opportunityId 
      });
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      const saved = await storage.saveOpportunity(parsed.data);
      res.json(saved);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/saved/:opportunityId", requireAuth, async (req, res) => {
    await storage.unsaveOpportunity(req.user!.id, req.params.opportunityId);
    res.json({ success: true });
  });

  app.get("/api/stats", async (_req, res) => {
    const allOpportunities = await storage.getOpportunities({ status: "approved" });
    const jobs = allOpportunities.filter(o => o.type === "job").length;
    const training = allOpportunities.filter(o => o.type === "training").length;
    const volunteer = allOpportunities.filter(o => o.type === "volunteer").length;
    res.json({ jobs, training, volunteer, total: allOpportunities.length });
  });

  return httpServer;
}
