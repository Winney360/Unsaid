const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  rawText: {
    type: String,
    required: true
  },
  clearExpression: {
    type: String,
    required: true
  },
  respectfulExpression: {
    type: String,
    required: true
  },
  emotions: [{
    type: String,
    required: true
  }],
  validation: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sessionId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Translation', translationSchema);