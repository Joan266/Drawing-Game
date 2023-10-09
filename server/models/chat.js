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
      playerId: {
        type: String,
        required: true,
      },
      messageInput: {
        type: String,
        required: true,
      },
    }],
    validate: {
      validator(v) {
        return v.length <= 10;
      },
      message: 'The array of messages cant have more than 10 messages',
    },
    default: [],
  },
});

export default mongoose.model('Chat', chatSchema);
