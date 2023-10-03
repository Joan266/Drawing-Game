import Players from "./models/players.js";
import { io } from './index.js';

export default async () => {
  const changeStream = Players.watch(
    [{ $match: { operationType: 'update' } }],
    { fullDocument: 'updateLookup' },
  );

  changeStream.on('change', ((change) => {
    const room = change.documentKey._id;
    const { updateDescription, fullDocument } = change;
    const { updatedFields } = updateDescription;
    const { players } = fullDocument;
    console.log(`Players, updated fields:`, updatedFields, `players:`, players);
    io.of('/table').to(room).emit('update-players-list', { players });
  }));
};
