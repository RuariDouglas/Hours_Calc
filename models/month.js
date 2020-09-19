const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Month.create({ month: 'December' }, (err, newMonth) => {
//     if (err) { console.log(err) } else { console.log(`${newMonth.month} added`) }
// });

const monthSchema = new mongoose.Schema({
    month: String,
    shifts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shift"
    }]
});

module.exports = mongoose.model('Month', monthSchema);