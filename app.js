// ----------- Packages/ENV ---------------//
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const functions = require('./functions.js');
const methodOverride = require('method-override');
require('dotenv').config();
let DB_URL = process.env.DB_URL;

// ----------- Global Variables -------------//
const newDate = new Date();
const day = newDate.getDate();
const month = newDate.toLocaleString('default', { month: 'long' });

// ----------- App.use, set & listen ---------------//
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.set('view engine', 'ejs');
app.listen(3000, () => console.log("I'm listening"));
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(express.static(__dirname + '/public'));

// ----------- Schemas ---------------//
const Month = require('./models/month');
const Shift = require('./models/shift');

// Month.create({ month: 'January' }, (err, newMonth) => {
//     if (err) { console.log(err) } else { console.log(`${newMonth.month} added`) }
// });


// INDEX ROUTE
app.get('/', (req, res) => {
    Month.find({ month: { $in: month } }, (err, foundMonth) => {
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

// SHOW
app.get('/:id', (req, res) => {
    Month.find({}, (err, allMonths) => {
        Month.findById(req.params.id).populate('shifts').exec((err, foundMonth) => {
            // console.log(req.params.id)
            if (err) {
                console.log(err);
            } else {
                res.render('show', { month: foundMonth, allMonths: allMonths, functions: functions })
            }
        })
    })
});


// CREATE (NEW SHIFT)
app.post('/:id', (req, res) => {
    const startTime = req.body.startTime;
    const finishTime = req.body.endTime;
    const lunchTime = Number(req.body.lunchTime);
    const totalShiftHours = functions.totalHours(startTime, finishTime, lunchTime);
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

// EDIT
app.get('/:id/shift/:shift_id/edit', (req, res) => {
    Month.findById(req.params.id, (err, foundMonth) => {
        Shift.findById(req.params.shift_id, (err, foundShift) => {
            res.render('edit', { month: foundMonth, shift: foundShift, functions: functions })
        });
    });
});

app.put('/:id/shift/:shift_id', (req, res) => {
    const startTime = req.body.startTime;
    const finishTime = req.body.endTime;
    const lunchTime = Number(req.body.lunchTime);
    const date = Number(req.body.date);
    const totalShiftHours = functions.totalHours(startTime, finishTime, lunchTime);
    const newShift = {
        date: date,
        startTime: startTime,
        finishTime: finishTime,
        lunchTime: lunchTime,
        totalShiftHours: totalShiftHours
    };
    console.log(newShift)
    Shift.findByIdAndUpdate(req.params.shift_id, newShift, (err, updatedShift) => {
        if (err) {
            res.redirect('back');
        } else {
            res.redirect(`/${req.params.id}`)
        }
    });
});

// DELETE
app.delete('/:id/shift/:shift_id', (req, res) => {
    Shift.findByIdAndDelete(req.params.shift_id, (err, deletedShift) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`This is the deleted shift: ${deletedShift}`);
            Month.updateOne({ _id: req.params.id }, { $pull: { shifts: { $in: req.params.shift_id } } }, (err, updated) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`This is the updated month: ${updated}`)
                    res.redirect(`/${req.params.id}`);
                }
            });
        }
    })
})