import Player from "./models/player.js";
import { DrawingGame } from "./game-logic.js";
import { io } from "./index.js";

export default async () => {

    const changeStream = Player.watch();

    changeStream.on('change', ((change) => {
        console.log(change);
        const operationType = change.operationType;
        switch (operationType) {
            case "insert":
                const room = change.fullDocument.tableId;
                console.log(room);
                io.of("/table").to(room).emit("create-player");
            break
        }
     }));

}

