const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const User = require('./models/User');
const Question = require('./models/Question');
const Assessment = require('./models/Assessment');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middlewares: Support any Netlify deployment (*.netlify.app), Render, and localhost
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];
if (process.env.CLIENT_URL) {
  process.env.CLIENT_URL.split(',').forEach((url) => {
    const trimmed = url.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, health checks)
      if (!origin) return callback(null, true);

      try {
        const url = new URL(origin);
        // Allow ANY Netlify domain (*.netlify.app)
        if (url.hostname.endsWith('.netlify.app')) {
          return callback(null, true);
        }
        // Allow ANY Render domain (*.onrender.com)
        if (url.hostname.endsWith('.onrender.com')) {
          return callback(null, true);
        }
        // Allow localhost on any port
        if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
          return callback(null, true);
        }
      } catch (e) {
        // Fallback for non-standard origins
      }

      // Allow configured origins or any origin dynamically (reflects origin for credentials)
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    platform: 'Zelis Hiring Platform API',
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/assessments', require('./routes/assessmentRoutes'));
app.use('/api/attempts', require('./routes/attemptRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/recruiters', require('./routes/recruiterRoutes'));
app.use('/api/candidates', require('./routes/candidateRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// 404 Route handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to Database & Auto-Seed check if empty
connectDB().then(async () => {
  app.listen(PORT, () => {
    console.log(`========================================================`);
    console.log(`🚀 Zelis Hiring Platform API Server running on port ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`✨ Adaptive Assessment Engine: ACTIVE`);
    console.log(`========================================================`);
  });

  try {
    const questionCount = await Question.countDocuments();
    const userCount = await User.countDocuments();

    if (questionCount === 0 || userCount === 0) {
      console.log('📦 Database is empty. Running auto-seed (demo accounts + question bank)...');
      const { seedDatabase } = require('./seed/seedData');
      await seedDatabase();
      console.log('✅ Auto-seed complete! Demo accounts ready.');
    } else {
      console.log(`✅ Database ready: ${userCount} users, ${questionCount} questions found.`);
    }
  } catch (err) {
    console.warn('⚠️  Auto-seed check note:', err.message);
  }
});

module.exports = app;
