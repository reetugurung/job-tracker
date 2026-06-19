import express from 'express';
import cors from 'cors';
import { router } from './routes';
import { initDb } from './db';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use('/api', router);
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server successfully running at http://localhost:${PORT}`);
  });
}).catch((err: unknown) => {
  console.error("❌ Failed to initialize database:", err);
});