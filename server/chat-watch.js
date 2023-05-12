import Chat from "./models/chat.js";
import { DrawingGame } from "./game-logic.js";

export default async () => {

    const changeStream = Chat.watch(
        [{ $match: { operationType: "update" } }],
        { fullDocument: 'updateLookup' }
    );

    changeStream.on('change', ((change) => {
        console.log("Change chat: ", change);
        const room = change.documentKey._id;
        const word = change.fullDocument?.word;
        const messages = change.fullDocument?.messages;
        const updatedFields = change.updateDescription?.updatedFields;
        Object.keys(updatedFields).forEach(async (key) => {
            console.log(`key: ${key}`);
            if (/^messages\.\d+$/.test(key) || key === "messages") { // check for messages.# pattern
                const messageObj = messages[messages.length - 1];
                await DrawingGame.messagesHandler({
                    room: room,
                    message: messageObj.message,
                    nickname: messageObj.nickname,
                    playerId: messageObj.playerId,
                    word: word
                });
            } else if (key === "word") {
                await DrawingGame.updateGame({
                    room: room,
                    body: {
                        threeWords: [],
                        fase: "guess-word",
                        timeLeft: 20
                    }
                });
            }
        });
    }));

}
