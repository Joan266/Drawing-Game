import Game from "./models/game.js";
import Chat from "./models/chat.js";
import { DrawingGame } from "./game-logic.js";

export default async () => {

    const changeStream = Game.watch(
        [{ $match: { operationType: "update" } }],
        { fullDocument: 'updateLookup' }
    );

    changeStream.on('change', ((change) => {

        console.log("Change game", change)
        const room = change.documentKey._id;
        const gameOn = change.fullDocument.gameOn;
        const fase = change.fullDocument?.fase;
        const turn = change.fullDocument?.turn;
        const threeWords = change.fullDocument?.threeWords;
        const updatedFields = change.updateDescription.updatedFields;
        if (!gameOn) return;
        console.log(`gameOn: ${gameOn} room: ${typeof room}`);
        Object.keys(updatedFields).forEach(async (key) => {
            console.log(`key: ${key} value: ${updatedFields[key]}`)
            switch (key) {
                case 'gameOn':
                    console.log(`${key}: ${updatedFields[key]}`);
                    if (updatedFields[key]) {
                        await DrawingGame.prepareNextTurn(room);
                    }
                    break;
                case 'fase':
                    console.log(`${key}: ${updatedFields[key]}`);
                    // if (updatedFields[key] === "select-word") {
                    // }
                    break;
                case 'round':
                    console.log(`${key}: ${updatedFields[key]}`);
                    await DrawingGame.resetTurns(room);
                    if (updatedFields[key] < 3) {
                        await DrawingGame.prepareNextTurn(room);
                    } else {
                        console.log("END OF THE GAME")
                        DrawingGame.gameOff(room);
                    }
                    break;
                case 'timeLeft':
                    console.log(`${key}: ${updatedFields[key]}`);
                    if (updatedFields[key] <= 0) {
                        if (fase === "select-word") {
                            const finalWord = threeWords[DrawingGame.randomNumber(3)];
                            console.log(`finalword: ${finalWord} possibleWords: ${threeWords}`);
                            await Chat.findByIdAndUpdate(
                                room,
                                { word: finalWord }
                            )
                        } else if (fase === "guess-word") {
                            if (turn > 8) {
                                DrawingGame.updateGame({
                                    room,
                                    body: { $inc: { round: 1 }, turn: 0 }
                                })
                            } else {
                                await DrawingGame.prepareNextTurn(room);
                            }
                            console.log("end of the turn");
                        }
                    } else {
                        DrawingGame.clock(room);
                    }
                    break;

                // case 'turn':
                //     console.log(`${key}: ${updatedFields[key]}`);
                //     break;
                default:
                    console.log('Unknown key:', key);
            }
        });
    }));

}
