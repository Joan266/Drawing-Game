import mongoose from 'mongoose';
import Player from './player.js';

const playersSchema = new mongoose.Schema({
  _id: Number,
  turnScoreCount: {
    type: Number,
    default: 0,
  },
  roundArtistCount: {
    type: Number,
    default: 0,
  },
  playerCount: {
    type: Number,
    default: 0,
  },
  playerArray: {
    type: [Player],
    default: [],
  },
});

export default mongoose.model('Players', playersSchema);
