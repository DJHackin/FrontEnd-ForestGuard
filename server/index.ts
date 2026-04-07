// server/index.ts
import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- API ---------- */
app.get('/health', (_req: Request, res: Response) => res.send('OK'));

/* ---------- STATIC + SPA ---------- */
const CLIENT_DIR = path.resolve(process.cwd(), 'client/dist');
app.use(express.static(CLIENT_DIR));
app.get('*', (_req: Request, res: Response) =>
  res.sendFile(path.join(CLIENT_DIR, 'index.html'))
);

/* ---------- START ---------- */
app.listen(PORT, () => {
  console.log(`Server ready → http://localhost:${PORT}`);
});