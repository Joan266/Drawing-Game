import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  roomId: {
    type: String,
  },
  play: {
    type: Boolean,
    default: true,
  },
  phase: {
    type: Number,
    default: 0,
  },
  totalRounds: {
    type: Number,
    default: 3,
  },
  turn: {
    type: Number,
    default: 0,
  },
  round: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model('Game', gameSchema);
