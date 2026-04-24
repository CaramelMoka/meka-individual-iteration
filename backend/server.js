import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import db from './database.js';
import ollama from 'ollama';
import { callLLM } from './llm.js';


const app = express();
app.use(cors()); 
app.use(express.json());

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(409).json({ error: 'Username already exists' });
          }
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, username });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      res.json({ id: user.id, username: user.username });
    }
  );
});



//save models in 
app.post('/api/saveModels', (req, res) => {
  const { username, models } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'No username' });
  }

  db.run(`DELETE FROM user_models WHERE username = ?`, [username], (err) => {
    if (err) return res.status(500).json(err);

  const stmt = db.prepare(`
    INSERT INTO user_models (username, name, endpoint)
    VALUES (?, ?, ?)
  `);

    models.forEach(m => {
    if (!m.name) return;
     stmt.run(
     username,
     m.name,
     m.endpoint ?? "",
    (err) => {if (err) console.error("Insert model failed:", err.message, m);}
    );
    });

    stmt.finalize();

    res.json({ success: true });
  });
});

app.get('/api/getModels', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'No username' });
  }

  db.all(
    `SELECT * FROM user_models WHERE username = ?`,
    [username],
    (err, rows) => {
      if (err) return res.status(500).json(err);

      const models = rows.map(r => ({
        id: r.id,
        name: r.name,
        endpoint: r.endpoint || undefined
      }));

      res.json(models);
    }
  );
});






//chat end point
app.post('/api/chat', async (req, res) => {
  const { prompt, models, modelConfigs, username, conversationId, messages } = req.body;

  if (!prompt&& (!messages || messages.length === 0)) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    let currentConversationId = conversationId || null;


//create conversation
    if (username && !currentConversationId) {
      const title = prompt || "New Chat";

      currentConversationId = await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO conversations (username, title) VALUES (?, ?)`,
          [username, title],
          function (err) {
            if (err) return reject(err);
            resolve(this.lastID);
          }
        );
      });
    }

 // user message]
    if (username) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)`,
          [currentConversationId, 'user', prompt],
          (err) => (err ? reject(err) : resolve())
        );
      });
    }

//waitfor ai
const modelList = models && models.length > 0 ? models : ['gemma3:270m'];

const responses = [];
for (const m of modelList) {
  const modelObj =
    modelConfigs.find(x => x.id === m) || {
      id: m,
      endpoint: 'http://localhost:11434'
  };

  const r = await callLLM(prompt, modelObj);
  responses.push(r);
}
//save ai messave
if (username) {
  for (let i = 0; i < responses.length; i++) {
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)`,
        [
          currentConversationId,
          modelList[i],
          responses[i]
        ],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }
}

return res.json({
   responses: responses.map((r, i) => ({
    model: modelList[i],
    response: r
  })),
  conversationId: currentConversationId
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'LLM failed' });
  }
});

//conversation sync
app.post('/api/conversation', (req, res) => {
  const { username, messages } = req.body;

  if (!username || !messages || messages.length === 0) {
    return res.status(400).json({ error: 'Missing data' });
  }

  db.run(
    `INSERT INTO conversations (username, title) VALUES (?, ?)`,
    [username, "New Chat"],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      const conversationId = this.lastID;

      const stmt = db.prepare(
        `INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)`
      );

      for (const msg of messages) {
        stmt.run(conversationId, msg.role, msg.content);
      }

      stmt.finalize();

      res.json({ conversationId });
    }
  );
});

//search endpoint
app.get('/api/search', (req, res) => {
  const { username, query } = req.query;

  if (!username || !query) {
    return res.status(400).json({ error: 'Missing params' });
  }

  const likeQuery = `%${query}%`;

  const sql = `
    SELECT DISTINCT c.id, c.title,c.created_at,
      CASE 
        WHEN c.title LIKE ? THEN 1
        WHEN m.content LIKE ? THEN 2
        ELSE 3
      END as priority
    FROM conversations c
    LEFT JOIN messages m ON c.id = m.conversation_id
    WHERE c.username = ?
      AND (c.title LIKE ? OR m.content LIKE ?)
    ORDER BY priority ASC, c.created_at DESC
  `;

  db.all(sql, [
    likeQuery,        // title priority
    likeQuery,        // message priority
    username,
    likeQuery,
    likeQuery
  ], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


//history endpoint
app.get('/api/history', (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  db.all(
    `SELECT id, title, created_at
     FROM conversations
     WHERE username = ?
     ORDER BY created_at DESC`,
    [username],
    (err, rows) => {
      if (err) {
        console.error('DB fetch error:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(rows);
    }
  );
});


//conversation id
app.get('/api/conversation/:id', (req, res) => {
  const { id } = req.params;

  db.all(
    `SELECT role, content, created_at
     FROM messages
     WHERE conversation_id = ?
     ORDER BY created_at ASC`,
    [id],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(rows);
    }
  );
});

app.listen(3001, () => {
  console.log('Auth server running on port 3001');
});



export default app;
