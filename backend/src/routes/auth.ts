import express from 'express';
import { toNodeHandler } from "better-auth/node";
import auth from "@/lib/auth";

const router = express.Router();

router.all('/{*any}', toNodeHandler(auth));

export default router;