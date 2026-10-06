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

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
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
