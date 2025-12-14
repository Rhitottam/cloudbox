import express, { Request, Response, NextFunction } from 'express';
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import auth from "@/lib/auth";
import type { User } from 'better-auth';

const router = express.Router();

router.all('*', toNodeHandler(auth));


export type RequestUser = {
  user: User
};

export const authMiddleware = async (req: Request<RequestUser>, res: Response, next: NextFunction) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!session) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized'
    })
    return;
  }

  req.body.user = session?.user;
  next();
};

export default router;