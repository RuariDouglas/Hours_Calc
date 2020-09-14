const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

// ----------------------------------------//
const date = new Date(),
    day = date.getDate(),
    month = date.toLocaleString('default', { month: 'long' });




app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.listen(3000, () => console.log("I'm listening"));
mongoose.connect('mongodb://localhost:27017/hours_calculator', { useNewUrlParser: true, useUnifiedTopology: true });

const monthSchema = new mongoose.Schema({
    month: String,
    shifts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shift"
    }]
});
const Month = mongoose.model('Month', monthSchema);

const shiftSchema = new mongoose.Schema({
    date: Number,
    startTime: Number,
    finishTime: Number,
    lunchTime: Number,
    totalShiftHours: Number
});
const Shift = mongoose.model('Shift', shiftSchema);


app.get('/', (req, res) => {
    Shift.find({}, (err, allShifts) => {
        if (err) console.log(`There's an error: ${err}`)
        else res.render('index', {
            shifts: allShifts,
            day: day,
            month: month
        })
    });
    Month.find({ month: { $in: month } }, (err, foundMonth) => {
        if (foundMonth.length === 0) {
            Month.create({ month: month }, (err, createdMonth) => {
                if (err) {
                    console.log(err);
                } else {
                    return;
                }
            });
        }
    });
});

app.post('/', (req, res) => {
    const startTime = Number(req.body.startTime);
    const finishTime = Number(req.body.endTime);
    const lunchTime = Number(req.body.lunchTime);
    const totalShiftHours = finishTime - startTime - lunchTime;
    const newShift = {
        date: day,
        startTime: startTime,
        finishTime: finishTime,
        lunchTime: lunchTime,
        totalShiftHours: totalShiftHours
    };

    Month.find({ month: { $in: month } }, (err, newFoundMonth) => {
        Shift.create(newShift, (err, createdShift) => {
            if (err) {
                console.log(`Cant create the shift ${err}`)
            } else {
                createdShift.save();
                newFoundMonth[0].shifts.push(createdShift);
                newFoundMonth[0].save();
                res.redirect('/');
            }
        })
    });
});