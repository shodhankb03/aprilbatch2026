const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD || 'apppass',
  database: process.env.DB_NAME || 'appdb'
});

app.use(express.json());

async function waitForDb(maxAttempts = 30) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await pool.query('SELECT 1');
      return;
    } catch (err) {
      if (attempt === maxAttempts) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

async function initDb() {
  try {
    await waitForDb();
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        note TEXT NOT NULL
      )
    `);

    await pool.query("INSERT INTO messages(note) SELECT 'Docker assignment ready' WHERE NOT EXISTS (SELECT 1 FROM messages)");
    console.log('Database ready');
  } catch (err) {
    console.error('DB init error:', err);
    process.exit(1);
  }
}

app.get('/api/health', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ ok: true, time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/api/message', async (_req, res) => {
  try {
    const result = await pool.query('SELECT note FROM messages ORDER BY id DESC LIMIT 1');
    res.json({ message: result.rows[0]?.note || 'No message yet' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/message', async (req, res) => {
  try {
    const note = req.body.note || 'Hello from Docker assignment';
    await pool.query('INSERT INTO messages(note) VALUES($1)', [note]);
    res.json({ saved: true, note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, async () => {
  console.log(`Backend running on http://localhost:${port}`);
  await initDb();
});
