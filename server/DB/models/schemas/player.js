import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  playerNickname: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  artistTurn: {
    type: Boolean,
    required: true,
    default: false,
  },
  scoreTurn: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default mongoose.model('Player', playerSchema);