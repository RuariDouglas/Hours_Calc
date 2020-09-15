// ----------- Packages/ENV ---------------//
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const functions = require('./functions.js');
require('dotenv').config();
let DB_URL = process.env.DB_URL;

// ----------- Global Variables -------------//
const date = new Date();
const day = date.getDate();
const month = date.toLocaleString('default', { month: 'long' });

//-----------------------------------------
// const totalHours = (start, finish, lunch) => {
//     let startTime = convertToDecimal(start);
//     let finishTime = convertToDecimal(finish);
//     let total = finishTime - startTime - lunch;
//     return convertToTime(total.toString());
// }
// const convertToDecimal = time => {
//     let newTime = time.replace(/(:)/g, '.').replace(/(\.\d+)/g, function(el) {
//         let sum = (Number(el) / 60) * 100;
//         let rounded = Math.round((sum + Number.EPSILON) * 100) / 100;
//         return rounded.toString().slice(1)
//     })
//     return newTime;
// }

// const convertToTime = time => {
//     let returnedTime = time.replace(/(\.\d+)/g, function(el) {
//         let m = Math.round(Number(el) * 60);
//         return `.${m}`
//     });
//     return timeFormatter(returnedTime);
//     //return returnedTime.length <= 2 ? Number(`${returnedTime}`) + .00 : returnedTime.split('.')[1].length < 2 ? Number(`${returnedTime}`) + 0 : Number(returnedTime);
// };
// const timeFormatter = time => {
//         let timeStr = time.toString();
//         let hrs = timeStr.split('.')[0];
//         let mins = timeStr.split('.')[1];
//         return timeStr.includes('.') ? `${hrs} hrs ${mins} mins` : `${hrs} hrs`
//     }

const timeFormatter = time => {
    let timeStr = time.toString();
    let hrs = timeStr.split('.')[0];
    let mins = timeStr.split('.')[1];
    return timeStr.includes('.') ? `${hrs} hrs ${mins} mins` : `${hrs} hrs`
}

console.log(timeFormatter(7.5))

// ----------- App.use, set & listen ---------------//
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.listen(3000, () => console.log("I'm listening"));
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

// ----------- Schemas ---------------//
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
    startTime: String,
    finishTime: String,
    lunchTime: Number,
    totalShiftHours: String
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
                res.render('show', { foundMonth: foundMonth, allMonths: allMonths, functions: functions })
            }
        })
    })
});



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