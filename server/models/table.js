import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  tableId: {
    type: String,
    required: true
  }
});

export default mongoose.model('Table', tableSchema, 'Tables', 'Pinturete');




