// models/Game.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  id:          { type: Number },
  title:       { type: String, required: true },
  releaseDate: { type: String },
  developer:   { type: [String] },
  genres:      { type: [String] },
  rating: {
    score:       { type: Number },
    reviewCount: { type: String },
  },
  communityStats: {
    plays:    { type: String },
    playing:  { type: String },
    backlogs: { type: String },
    wishlist: { type: String },
  },
  summary:  { type: String },
  imageUrl: { type: String },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Game', gameSchema);