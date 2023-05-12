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
        const turnScores = change.fullDocument?.turnScores;
        const timeLeft = change.fullDocument?.timeLeft;
        const updatedFields = change.updateDescription.updatedFields;

        if (!gameOn) return;
        console.log(`gameOn: ${gameOn} room: ${typeof room}`);

        Object.keys(updatedFields).forEach(async (key) => {
            console.log(`key: ${key} value: ${updatedFields[key]}`)

            switch (key) {
                case 'gameOn':
                    console.log(`${key}: ${updatedFields[key]}`);
                    await DrawingGame.prepareNextTurn(room);
                    break;

                case 'round':
                    console.log(`${key}: ${updatedFields[key]}`);
                    await DrawingGame.roundHandler({
                        room: room,
                        round: round
                    })
                    break;

                case 'timeLeft':
                    console.log(`${key}: ${updatedFields[key]}`);
                    await DrawingGame.timeLeftHandler({
                        room: room,
                        timeLeft: timeLeft,
                        turn: turn,
                        fase: fase,
                        turnScores: turnScores,
                        mainPlayerId: mainPlayerId
                    });
                    break;

                case 'turnScores':
                    console.log(`${key}: ${updatedFields[key]}`);
                    await DrawingGame.scoringHandler(room)
                    break;

                default:
                    console.log('Unknown key:', key);
            }
        });
       
    }));

}
