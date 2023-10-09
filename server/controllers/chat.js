import Chat from '../models/chat.js';

export const chatController = {
  saveMessage: async (req, res) => {
    const {
      room, playerNickname, messageInput,
    } = req.body;
    try {
      await Chat.findByIdAndUpdate(
        room,
        {
          $push: {
            messages: {
              playerNickname,
              messageInput,
            },
          },
        },
      );
      res.status(200).send('Message saved successfully.');
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred while saving the message.');
    }
  },
};
