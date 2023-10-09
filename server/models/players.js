import mongoose from 'mongoose';

const playersSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  numberOfScoreTurns: {
    type: Number,
    default: 0,
  },
  numberOfArtistTurns: {
    type: Number,
    default: 0,
  },
  numberOfPlayers: {
    type: Number,
    default: 0,
  },
  playersArray: {
    type: [{
      nickname: {
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
    }],
    default: [],
  },
});

export default mongoose.model('Players', playersSchema);
