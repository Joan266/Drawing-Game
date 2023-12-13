import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
  roomOwner: {
    type: String,
    required: true,
  },
  play: {
    type: Boolean,
    default: false,
  },
  gameId: {
    type: String,
  },
});

export default mongoose.model('Room', roomSchema);
