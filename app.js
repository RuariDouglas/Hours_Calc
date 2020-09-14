const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// ----------------------------------------//
require('dotenv').config();
let DB_URL = process.env.DATABASE_URL;
// ----------------------------------------//
const date = new Date();
const day = date.getDate();
const month = date.toLocaleString('default', { month: 'long' });




app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.listen(3000, () => console.log("I'm listening"));
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

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

// Month.create({ month: 'December' }, (err, newMonth) => {
//     if (err) { console.log(err) } else { console.log(`${newMonth.month} added`) }
// });

// INDEX ROUTE
app.get('/', (req, res) => {
    Month.find({ month: { $in: month } }, (err, foundMonth) => {
        console.log(foundMonth)
        if (foundMonth.length === 0) {
            Month.create({ month: month }, (err, createdMonth) => {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect(`/${createdMonth._id}`)
                }
            });
        } else {
            res.redirect(`/${foundMonth[0]._id}`);
        }
    });
});


app.get('/:id', (req, res) => {
    Month.find({}, (err, allMonths) => {
        Month.findById(req.params.id).populate('shifts').exec((err, foundMonth) => {
            if (err) {
                console.log(err);
            } else {
                res.render('show', { foundMonth: foundMonth, allMonths: allMonths })
            }
        })
    })
});

app.post('/:id', (req, res) => {
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
    Month.findById(req.params.id, (err, foundMonth) => {
        Shift.create(newShift, (err, newShift) => {
            if (err) {
                console.log(err)
            } else {
                newShift.save();
                foundMonth.shifts.push(newShift);
                foundMonth.save();
                res.redirect('back')
            }
        })

    });
});