import mongoose from 'mongoose';

const { Schema } = mongoose;

const gameSchema = Schema({
  _id: Schema.Types.ObjectId,
  room: { type: Schema.Types.ObjectId, ref: 'Room' },
  title: String,
  artits: [{ type: Schema.Types.ObjectId, ref: 'Artist' }],
  scores: [{ type: Schema.Types.ObjectId, ref: 'Score' }],
  words: [{ type: String }],
});

export default mongoose.model('Game', gameSchema);
