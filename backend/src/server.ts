import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from '@/routes/auth';


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;