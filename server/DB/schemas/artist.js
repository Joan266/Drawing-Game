import mongoose from 'mongoose';

const { Schema } = mongoose;

const artistSchema = Schema({
  game: { type: Schema.Types.ObjectId, ref: 'Game' },
  title: String,
});

export const Artist = mongoose.model('Artist', artistSchema);
