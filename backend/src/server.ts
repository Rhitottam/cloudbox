import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from '@/routes/auth';


const app = express();

// Configure CORS for better-auth
app.use(cors({
    origin: 'http://localhost:3001', // Frontend URL
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;