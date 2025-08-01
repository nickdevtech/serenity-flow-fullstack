const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    default: ''
  },

  tags: [
    {
      type: String,
      trim: true
    }],

  json_file_url: {
    type: String,
    default: ''
  },

  duration: {
    type: Number,
    min: 1
  },

  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },

  category: {
    type: String,
    enum: ['yoga', 'meditation', 'breathwork', 'mindfulness', 'movement', 'relaxation'],
    required: true
  },

  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },

  image_url: {
    type: String,
    default: ''
  },

  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);