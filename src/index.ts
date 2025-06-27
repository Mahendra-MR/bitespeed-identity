import express, { Request, Response, NextFunction } from 'express';
import identifyRoute from './routes/identify.route';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route for browser and health check
app.get('/', (req: Request, res: Response) => {
  res.send('Bitespeed Identity Reconciliation API is running');
});

// Routes
app.use('/api', identifyRoute);

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Global Error Handler:', err.stack || err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong.',
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
