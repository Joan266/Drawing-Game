import Players from "./models/players.js";
import { io } from './index.js';

export default async () => {
  const changeStream = Players.watch(
    [{ $match: { operationType: 'update' } }],
    { fullDocument: 'updateLookup' },
  );

  changeStream.on('change', ((change) => {
    const room = change.documentKey._id;
    const { fullDocument } = change;
    const { players } = fullDocument;
    io.of('/table').to(room).emit('update-players-list', { players });
  }));
};
