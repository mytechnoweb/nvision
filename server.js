// 📦 Import Required Modules
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const session = require('express-session');
const path = require('path');

// 🚀 Initialize Express App
const app = express();
const port = 8080;

// 🛠 PostgreSQL Connection Setup
const pool = new Pool({
  user: 'nv',
  host: 'localhost',
  database: 'newvision',
  password: '4000',
  port: 5432,
});

// 🔐 Configure Express Session
app.use(session({
  secret: 's8f@9L!x2#vPz$1qWm3^rTgB&uKzXcN0',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// 🌐 Middleware Setup
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const path = require('path');

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
  });
}
// 🟢 Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// 🏠 Main Page Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 📝 Registration Route - UPDATED with bcrypt
app.post('/register', async (req, res) => {
  const { name, email, password, mobile } = req.body;
  console.log('Registration attempt for:', email);

  // Always set Content-Type to JSON
  res.setHeader('Content-Type', 'application/json');

  try {
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email, and password are required.' 
      });
    }

    // Check if email already exists
    const emailCheck = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already exists.' 
      });
    }

    // ✅ FIX: Hash the password before saving
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Insert new user with HASHED password
    await pool.query(
      'INSERT INTO users (name, email, password, mobile_number) VALUES ($1, $2, $3, $4)',
      [name, email, hashedPassword, mobile || null]
    );

    console.log('Registration successful for:', email);
    
    return res.json({ 
      success: true, 
      message: 'Registration successful! You can now login.' 
    });
  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle unique constraint violations
    if (err.code === '23505' && err.constraint === 'users_email_key') {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already exists.' 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      error: 'Registration failed. Please try again.' 
    });
  }
});

// 🔐 Login Route - UPDATED to use bcrypt comparison
app.post('/login', async (req, res) => {
  console.log('=== LOGIN REQUEST RECEIVED ===');
  
  const { email, password } = req.body;
  console.log('Login attempt for:', email);

  // Always set Content-Type to JSON
  res.setHeader('Content-Type', 'application/json');

  try {
    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    console.log('Database result rows:', result.rows.length);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log('User found:', user.email);
      console.log('Stored password (first 20 chars):', user.password.substring(0, 20) + '...');
      
      // ✅ FIX: Use bcrypt comparison for hashed passwords
      console.log('Comparing with bcrypt...');
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Bcrypt comparison result:', isPasswordValid);
      
      if (isPasswordValid) {
        req.session.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile_number: user.mobile_number
        };
        
        console.log('Login successful for:', user.name);
        
        return res.json({ 
          success: true, 
          redirect: '/dashboard',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            mobile_number: user.mobile_number
          }
        });
      } else {
        console.log('Invalid password for:', email);
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid email or password' 
        });
      }
    } else {
      console.log('User not found:', email);
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ 
      success: false, 
      error: 'Login failed. Please try again.' 
    });
  }
});

// 📊 Dashboard API Endpoint - FIXED
app.get('/api/dashboard', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [req.session.user.email]
    );

    const user = userResult.rows[0];
    
    res.json({
      username: req.session.user.name,
      email: req.session.user.email,
      userId: req.session.user.id,
      mobile: req.session.user.mobile_number,
      joinedDate: user?.created_at || new Date().toISOString()
    });
  } catch (err) {
    console.error('Dashboard API error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// 🏠 React Dashboard Route - FIXED
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 🚪 Logout Route
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      res.status(500).json({ success: false, error: 'Logout failed.' });
    } else {
      res.json({ success: true, message: 'Logged out successfully' });
    }
  });
});