import mongoose from 'mongoose';

const playersSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  players: {
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
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    default: [],
  },
});

export default mongoose.model('Players', playersSchema);
