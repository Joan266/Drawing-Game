import mongoose from 'mongoose';

const { Schema } = mongoose;

const artistSchema = Schema({
  _id: Schema.Types.ObjectId,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  game: { type: Schema.Types.ObjectId, ref: 'Game' },
  score: { type: Number, default: 0 },
});

export default mongoose.model('Artist', artistSchema);
