// 📦 Import Required Modules
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');

// 🚀 Initialize Express App
const app = express();
const port = process.env.PORT || 8080;

// 🔐 Configure Express Session
app.use(session({
  secret: process.env.SESSION_SECRET || 's8f@9L!x2#vPz$1qWm3^rTgB&uKzXcN0',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// 🌐 Middleware Setup
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/build')));
}

// 🟢 Start Server
app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
});

// TEMPORARY: In-memory storage (no database needed)
const users = [];

// 🏠 Main Page Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 📝 Registration Route - TEMPORARY (no database)
app.post('/register', async (req, res) => {
  const { name, email, password, mobile } = req.body;
  console.log('Registration attempt for:', email);

  res.setHeader('Content-Type', 'application/json');

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email, and password are required.' 
      });
    }

    // Check if email exists in memory
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already exists.' 
      });
    }

    // Store user in memory
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password, // Store plain text temporarily
      mobile_number: mobile,
      created_at: new Date().toISOString()
    };
    
    users.push(newUser);
    console.log('Registration successful for:', email);
    
    return res.json({ 
      success: true, 
      message: 'Registration successful! You can now login.' 
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ 
      success: false, 
      error: 'Registration failed. Please try again.' 
    });
  }
});

// 🔐 Login Route - TEMPORARY (no database)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt for:', email);

  res.setHeader('Content-Type', 'application/json');

  try {
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    // Find user in memory
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
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

// 📊 Dashboard API - TEMPORARY (no database)
app.get('/api/dashboard', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Return session data directly
  res.json({
    username: req.session.user.name,
    email: req.session.user.email,
    userId: req.session.user.id,
    mobile: req.session.user.mobile_number,
    joinedDate: new Date().toISOString()
  });
});

// 🏠 React Dashboard Route
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
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