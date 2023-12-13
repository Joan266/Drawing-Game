import mongoose from 'mongoose';

const turnSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  roomId: {
    type: String,
    required: true,
  },
  phase: {
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

export default mongoose.model('Game', turnSchema);
