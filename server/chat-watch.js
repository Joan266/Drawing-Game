import Chat from './models/chat.js';
import { DrawingGame } from './game-logic.js';
import { io } from './index.js';

export default async () => {
  const changeStream = Chat.watch(
    [{ $match: { operationType: 'update' } }],
    { fullDocument: 'updateLookup' },
  );
  changeStream.on('change', ((change) => {
    const room = change.documentKey._id;
    const { updateDescription, fullDocument } = change;
    const { updatedFields } = updateDescription;
    console.log(`Chat, updated fields:`, updatedFields, `fullDocument:`, fullDocument);
    Object.keys(updatedFields).forEach(async (key) => {

    });
  }));
};
