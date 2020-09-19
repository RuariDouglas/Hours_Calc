const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    date: Number,
    startTime: String,
    finishTime: String,
    lunchTime: String,
    totalShiftHours: String
});

module.exports = mongoose.model('Shift', shiftSchema);