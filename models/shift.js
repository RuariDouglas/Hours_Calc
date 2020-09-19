const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    date: Number,
    startTime: String,
    finishTime: String,
    lunchTime: String,
    totalShiftHours: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
});

module.exports = mongoose.model('Shift', shiftSchema);