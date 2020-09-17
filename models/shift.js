const mongoose = require('mongoose');
const Month = require('./month');

const shiftSchema = new mongoose.Schema({
    date: Number,
    startTime: String,
    finishTime: String,
    lunchTime: Number,
    totalShiftHours: String
});

module.exports = mongoose.model('Shift', shiftSchema);