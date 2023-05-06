import Game from "./models/game.js";
export default async () => {

    const changeStream = Game.watch( { fullDocument: 'updateLookup' });
    changeStream.on('change', ((change) => {
        console.log("Change on game", change)
        const game = change.fullDocument;
        switch (change.operationType) {
            case "update":
                console.log(game.gameOn);
                break;
        }
    }));
}
