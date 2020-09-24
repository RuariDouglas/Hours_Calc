// ----------- Packages/ENV ---------------//
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const functions = require('../functions');
const methodOverride = require('method-override');

// ----------- Models ---------------//
const Month = require('../models/month');
const Shift = require('../models/shift');

// ----------- Variables ---------------//
const newDate = new Date();
const day = newDate.getDate();
const month = newDate.toLocaleString('default', { month: 'long' });

// ----------- Routes ---------------//
// SHOW
router.get('/:id', functions.isLoggedIn, (req, res) => {
    Month.find({}, (err, allMonths) => {
        Month.findById(req.params.id).populate({ path: 'shifts', options: { sort: { date: 1 } } }).exec((err, foundMonth) => {
            if (err) {
                console.log(err);
            } else {
                res.render('show', { month: foundMonth, allMonths: allMonths, functions: functions })
            }
        })
    });
});
// CREATE (NEW SHIFT IN MONTH)
router.post('/:id', functions.isLoggedIn, (req, res) => {
    const userDay = req.body.date;
    const startTime = req.body.startTime;
    const finishTime = req.body.endTime;
    const lunchTime = req.body.lunchTime;
    const totalShiftHours = functions.totalHours(startTime, finishTime, lunchTime);
    const newShift = {
        date: userDay || day,
        startTime: startTime,
        finishTime: finishTime,
        lunchTime: lunchTime,
        totalShiftHours: totalShiftHours
    };
    Month.findById(req.params.id, (err, foundMonth) => {
        Shift.create(newShift, (err, shift) => {
            if (err) {
                req.flash('error', error.message);
                console.log(err)
            } else {
                shift.author.id = req.user._id;
                shift.author.username = req.user.username;
                shift.save();
                foundMonth.shifts.push(shift);
                foundMonth.save();
                req.flash('success', `New shift added!`)
                res.redirect('back');
            }
        })

    });
});
module.exports = router;