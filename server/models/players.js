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
    type: [playerSchema],
    default: [],
  },
});

export default mongoose.model('Players', playersSchema);
