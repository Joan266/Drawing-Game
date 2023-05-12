import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    round: {
        type: Number,
        default: 0
    },
    turn: {
        type: Number,
        default: 0
    },
    mainPlayerId: {
        type: String,
        default: null
    },
    gameOn: {
        type: Boolean,
        default: false
    },
    timeLeft: {
        type: Number,
        default: 20
    },
    threeWords: {
        type: Array,
        default: []
    },
    fase: {
        type: String,
        default: null
    },
    turnScores: {
        type: Number,
        default: 0
    }
});

export default mongoose.model('Game', gameSchema);

