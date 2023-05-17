import Player from "./models/player.js";
import { io } from "./index.js";

export default async () => {
  const changeStream = Player.watch(
    { fullDocument: 'updateLookup', fullDocumentBeforeChange: 'whenAvailable' },
  );

  changeStream.on('change', ((change) => {
    const playerId = change.documentKey?._id;
    const room = change.fullDocument?.tableId;
    const nickname = change.fullDocument?.nickname;
    const { operationType } = change;
    switch (operationType) {
      case "insert":
        console.log(change);
        io.of("/table").to(room).emit("create-player", { nickname, playerId });
        break;
      case "delete":
        console.log(change);
        // io.of("/table").to(room).emit("delete-player", { playerId });
        break;
      default:
        console.log('Unknown operationType:', operationType);
    }
  }));
};
