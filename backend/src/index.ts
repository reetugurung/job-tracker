import express from 'express';
import cors from 'cors';
import { router } from './routes';
import { initDb } from './db';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api', router);

try {
  initDb();
  console.log("📂 Database initialized successfully.");
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Server successfully running on port ${PORT}`);
  });
} catch (err: unknown) {
  console.error("❌ Failed to initialize database:", err);
}