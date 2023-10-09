import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  gameState: {
    type: Boolean,
    default: false,
  },
  round: {
    type: Number,
    default: 0,
  },
  turn: {
    type: Number,
    default: 0,
  },
  mainPlayerId: {
    type: String,
    default: null,
  },
  fase: {
    type: String,
    default: null,
  },
  threeWords: {
    type: Array,
    default: [],
  },
  word: {
    type: String,
    default: null,
  },
  turnScore: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model('Game', gameSchema);
