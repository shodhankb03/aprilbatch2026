const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.use(express.json());

async function waitForDatabase(maxAttempts = 30) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await pool.query('SELECT 1');
      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

async function initializeDatabase() {
  await waitForDatabase();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      note TEXT NOT NULL
    )
  `);
  await pool.query(`
    INSERT INTO messages(note)
    SELECT 'Kubernetes three-tier application is ready'
    WHERE NOT EXISTS (SELECT 1 FROM messages)
  `);
  console.log('Database initialized');
}

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (error) {
    res.status(503).json({ ok: false, error: error.message });
  }
});

app.get('/api/message', async (_req, res) => {
  try {
    const result = await pool.query('SELECT note FROM messages ORDER BY id DESC LIMIT 1');
    res.json({ message: result.rows[0]?.note || 'No message yet' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/message', async (req, res) => {
  try {
    const note = req.body.note?.trim() || 'Hello from Kubernetes';
    await pool.query('INSERT INTO messages(note) VALUES($1)', [note]);
    res.json({ saved: true, note });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, async () => {
  console.log(`Backend listening on port ${port}`);
  try {
    await initializeDatabase();
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
});
