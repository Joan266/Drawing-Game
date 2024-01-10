import mongoose from 'mongoose';

const { Schema } = mongoose;

const scoreSchema = Schema({
  _id: Schema.Types.ObjectId,
  game: { type: Schema.Types.ObjectId, ref: 'Game' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
});

export default mongoose.model('Score', scoreSchema);
