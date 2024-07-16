const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors({
  origin: 'https://vote-nom.online', // Ensure this is your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database('./votingapp.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_number TEXT NOT NULL,
      name TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      employee_number TEXT NOT NULL,
      FOREIGN KEY (employee_number) REFERENCES employees(employee_number)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS candidates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      voter_id INTEGER,
      candidate_id INTEGER,
      FOREIGN KEY (voter_id) REFERENCES users(id),
      FOREIGN KEY (candidate_id) REFERENCES candidates(id)
    )
  `);
});

// Route to handle sign up
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    console.error('All fields are required:', { username, email, password });
    return res.status(400).send('All fields are required');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.run(sql, [username, email, hashedPassword], function(err) {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).send('Server error');
      }
      console.log('User registered:', this.lastID);
      res.status(200).send('User registered');
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).send('Server error');
  }
});

// Route to handle login
app.post('/login', (req, res) => {
  const { identifier, password } = req.body;

  console.log('Login request received:', { identifier, password });

  if (!identifier || !password) {
    console.error('All fields are required:', { identifier, password });
    return res.status(400).send('All fields are required');
  }

  const sql = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.get(sql, [identifier, identifier], async (err, user) => {
    if (err) {
      console.error('Error querying user:', err);
      return res.status(500).send('Server error');
    }

    if (!user) {
      console.log('No user found with this username/email:', identifier);
      return res.status(400).send('Invalid username/email or password');
    }

    console.log('User found:', user);

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', passwordMatch);

    if (!passwordMatch) {
      console.log('Password mismatch for user:', identifier);
      return res.status(400).send('Invalid username/email or password');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, 'your-secret-key', { expiresIn: '1h' });
    console.log('Token generated:', token);

    res.status(200).json({ token });
  });
});

// Function to check if today is the last day of the month
const isLastDayOfMonth = () => {
  const today = new Date();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return today.getDate() === lastDay.getDate();
};

// Function to check if today is the first day of the month
const isFirstDayOfMonth = () => {
  const today = new Date();
  return today.getDate() === 1;
};

// Route to fetch all users
app.get('/users', (req, res) => {
  let sql;
  const isFirstDay = isFirstDayOfMonth();
  if (isFirstDay) {
    sql = `
      SELECT u.id, u.username, u.email, COUNT(v.voter_id) as votes
      FROM users u
      LEFT JOIN votes v ON u.id = v.candidate_id
      GROUP BY u.id, u.username, u.email
    `;
  } else {
    sql = `
      SELECT u.id, u.username, u.email, NULL as votes
      FROM users u
    `;
  }

  db.all(sql, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).send('Server error');
    }
    res.status(200).json({ users: results, isFirstDay });
  });
});

// Route to handle vote submission
app.post('/vote', (req, res) => {
  const { voterId, candidateId } = req.body;

  if (!voterId || !candidateId) {
    console.error('All fields are required:', { voterId, candidateId });
    return res.status(400).send('All fields are required');
  }

  // Check if today is the last day of the month
  if (!isLastDayOfMonth()) {
    return res.status(400).send('Voting is only allowed on the last day of the month.');
  }

  // Check if the user has already voted within the last month
  const checkVoteSQL = 'SELECT last_vote_date FROM users WHERE id = ?';
  db.get(checkVoteSQL, [voterId], (err, result) => {
    if (err) {
      console.error('Error checking last vote date:', err);
      return res.status(500).send('Server error');
    }

    const lastVoteDate = result?.last_vote_date;
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    if (lastVoteDate && new Date(lastVoteDate) > oneMonthAgo) {
      return res.status(400).send('You can only vote once a month.');
    }

    // Proceed with voting
    const voteSQL = 'INSERT INTO votes (voter_id, candidate_id) VALUES (?, ?)';
    db.run(voteSQL, [voterId, candidateId], function(err) {
      if (err) {
        console.error('Error submitting vote:', err);
        return res.status(500).send('Server error');
      }

      // Update the last vote date
      const updateVoteDateSQL = 'UPDATE users SET last_vote_date = CURRENT_TIMESTAMP WHERE id = ?';
      db.run(updateVoteDateSQL, [voterId], (err) => {
        if (err) {
          console.error('Error updating last vote date:', err);
          return res.status(500).send('Server error');
        }
        console.log('Vote submitted and last vote date updated:', this.changes);
        res.status(200).send('Vote submitted successfully');
      });
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
