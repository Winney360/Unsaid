const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const translateRoutes = require('./src/routes/translateRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', translateRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'UNSAID API' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;