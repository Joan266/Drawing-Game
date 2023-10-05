import Chat from '../models/chat.js';

export const chatController = {
  savemessage: async (req, res) => {
    const { tableId } = req.body;
    const { messageInfo } = req.body;
    try {
      await Chat.findByIdAndUpdate(
        tableId,
        { $push: { messages: messageInfo } },
      );
      res.status(200).send('Message saved successfully.');
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred while saving the message.');
    }
  },
  saveword: async (req, res) => {
    const word = req.body.finalWord;
    const { tableId } = req.body;
    try {
      await Chat.findByIdAndUpdate(
        tableId,
        { word },
      );
      res.status(200).send('Message saved successfully.');
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred while saving the message.');
    }
  },
  chatinfo: async (req, res) => {
    const { tableNumber } = req.body;
    await Chat.findById(tableNumber)
      .then((chat) => {
        res.json({
          word: chat.word,
        });
      })
      .catch((error) => res.json({ message: error }));
  },

};
