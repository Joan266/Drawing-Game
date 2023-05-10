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
        const isChat = change.updateDescription?.updatedFields["chat"];
        const isWord = change.updateDescription?.updatedFields["word"];
        if (isChat) {
            console.log(isChat);
        } else if (isWord) {
            DrawingGame.updateGame({
                room: room,
                body: {
                    threeWords: [],
                    fase: "guess-word",
                    timeLeft: 20
                }
            });
        }
    }));

}
