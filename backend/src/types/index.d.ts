declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export {}; // Prevents it from being treated as a script