import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
    playerNickname: {
        type: String,
        required: true
    },
    tableId: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true,
        default: 0
    },
    playerTurn: {
        type: Boolean,
        required: true,
        default: false
    }


});

export default mongoose.model('Player', playerSchema, 'Players', 'Pinturete');



