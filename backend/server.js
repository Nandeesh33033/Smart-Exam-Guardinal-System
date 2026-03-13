import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import examRoutes from './routes/examRoutes.js';
import buildViolationRoutes from './routes/violationRoutes.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN?.split(',') || '*',
    credentials: true
  }
});

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));
app.use(
  '/api',
  rateLimit({
    windowMs: 60 * 1000,
    limit: 120
  })
);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/violations', buildViolationRoutes(io));

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);
});

const PORT = process.env.PORT || 5000;

const bootstrap = async () => {
  await connectDB(process.env.MONGO_URI);
  server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
};

bootstrap().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
