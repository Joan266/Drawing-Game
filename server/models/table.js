import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  _id: {
    type: Number
  }
});

export default mongoose.model('Table', tableSchema);




