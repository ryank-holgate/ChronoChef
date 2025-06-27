import { Express, RequestHandler } from "express";
import session from "express-session";
import { storage } from "./storage";
import connectPg from "connect-pg-simple";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export function setupSimpleAuth(app: Express) {
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: 7 * 24 * 60 * 60, // 1 week
  });

  app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  }));

  // Add userId to request from session
  app.use((req, res, next) => {
    if (req.session && (req.session as any).userId) {
      req.userId = (req.session as any).userId;
    }
    next();
  });
}

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

export const optionalAuth: RequestHandler = (req, res, next) => {
  // Always continue, but userId may or may not be present
  next();
};