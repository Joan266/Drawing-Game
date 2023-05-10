import Chat from "../models/chat.js";

 export const chatController = {
    savemessage: async (req, res) => {
        const tableId = req.body.tableId;
        const messageInfo = req.body.messageInfo;
        try {
            await Chat.findByIdAndUpdate(
                tableId,
                { $push: { messages: messageInfo } }
            );
            res.status(200).send("Message saved successfully.");
        } catch (err) {
            console.error(err);
            res.status(500).send("An error occurred while saving the message.");
        }
    }

}

