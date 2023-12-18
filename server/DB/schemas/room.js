import mongoose from 'mongoose';

const { Schema } = mongoose;

const roomSchema = Schema({
  _id: Schema.Types.ObjectId,
  code: {
    type: String,
    required: true,
    unique: true,
    unmutable: true,
  },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  games: [{ type: Schema.Types.ObjectId, ref: 'Game' }],
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model('Room', roomSchema);
