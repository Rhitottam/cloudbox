import express from 'express';
import { toNodeHandler } from "better-auth/node";
import auth from "@/lib/auth";

const router = express.Router();

// Mount better-auth handler for all routes
router.all('*', toNodeHandler(auth));

export default router;