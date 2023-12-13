import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  playerNickname: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Players', playerSchema);
