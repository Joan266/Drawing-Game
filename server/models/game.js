import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  isGamePlaying: {
    type: Boolean,
    default: false,
  },
  gamePhase: {
    type: String,
  },
  round: {
    type: Number,
    default: 0,
  },
  turn: {
    type: Number,
    default: 0,
  },
  artistId: {
    type: String,
  },
  wordGroup: {
    type: Array,
    default: [],
  },
  word: {
    type: String,
  },
});

export default mongoose.model('Game', gameSchema);
