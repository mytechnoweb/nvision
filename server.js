// 📦 Import Required Modules
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

// 🚀 Initialize Express App
const app = express();
const port = process.env.PORT || 8080;

// 🔐 Configure Express Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUnitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// 🌐 Middleware Setup
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve React build in production
app.use(express.static(path.join(__dirname, 'frontend/build')));

// 🟢 Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// TEMPORARY: In-memory storage
const users = [];

// 🏠 Main Page Route - SERVE YOUR HTML SITE
app.get('/', (req, res) => {
  console.log('Serving main HTML site from /public/index.html');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 📝 Registration Route
app.post('/register', async (req, res) => {
  const { name, email, password, mobile } = req.body;
  
  res.setHeader('Content-Type', 'application/json');

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email, and password are required.' 
      });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already exists.' 
      });
    }

    const newUser = {
      id: users.length + 1,
      name,
      email,
      password,
      mobile_number: mobile,
      created_at: new Date().toISOString()
    };
    
    users.push(newUser);
    
    return res.json({ 
      success: true, 
      message: 'Registration successful! You can now login.' 
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ 
      success: false, 
      error: 'Registration failed.' 
    });
  }
});

// 🔐 Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  res.setHeader('Content-Type', 'application/json');

  try {
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile_number: user.mobile_number
      };
      
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
      error: 'Login failed.' 
    });
  }
});

// 📊 Dashboard API
app.get('/api/dashboard', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

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
  console.log('Serving React app from /frontend/build/index.html');
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// 🚪 Logout Route
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(500).json({ success: false, error: 'Logout failed.' });
    } else {
      res.json({ success: true, message: 'Logged out successfully' });
    }
  });
});

// Serve React app for any other routes (but NOT the root)
app.get('*', (req, res) => {
  console.log('Catch-all route for:', req.path);
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});