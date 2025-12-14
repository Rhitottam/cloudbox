import express, { Request, Response } from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import authRoutes from '@/routes/auth';
import fileRoutes from '@/routes/file';


const app = express();

// Configure CORS for better-auth
app.use(cors({
  origin: 'http://localhost:3001', // Frontend URL
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(fileUpload({
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB per chunk
  useTempFiles: false,
  safeFileNames: true,
  preserveExtension: true,
}));

app.use('/api/auth', authRoutes);

app.use('/api/file', fileRoutes);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;