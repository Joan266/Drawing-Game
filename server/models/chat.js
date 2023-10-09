import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  messages: {
    type: [{
      playerNickname: {
        type: String,
        required: true,
      },
      messageInput: {
        type: String,
        required: true,
      },
    }],
    default: [],
  },
});

export default mongoose.model('Chat', chatSchema);
