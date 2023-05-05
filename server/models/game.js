import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    tableId: {
        type: String,
        required: true
    },
    round: {
        type: Number,
        default:0
    },
    turn: {
        type: Number,
        default:0
    },
    mainPlayerId: {
        type: String,
        default:null
    },
    word: {
        type: String,
        default:null
    }


});

export default mongoose.model('Game', gameSchema, 'Games', 'Pinturete');

