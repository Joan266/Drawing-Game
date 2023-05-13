import Game from "./models/game.js";
import { DrawingGame } from "./game-logic.js";
import { io } from "./index.js";

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
        const round = change.fullDocument?.round;
        const mainPlayerId = change.fullDocument?.mainPlayerId;
        const threeWords = change.fullDocument?.threeWords;
        const turnScores = change.fullDocument?.turnScores;
        const timeLeftMax = change.fullDocument?.timeLeftMax;
        const timeLeftMin = change.fullDocument?.timeLeftMin;
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

                case 'timeLeftMax':
                    console.log(`${key}: ${updatedFields[key]}`);
                    io.of("/table").to(room).emit("update-game-info");
                    await DrawingGame.timeLeftHandler({
                        room: room,
                        timeLeftMax: timeLeftMax,
                        turn: turn,
                        fase: fase,
                        turnScores: turnScores,
                        mainPlayerId: mainPlayerId,
                        threeWords: threeWords,
                        timeLeftMin: timeLeftMin
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
