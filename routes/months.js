// ----------- Packages/ENV ---------------//
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const functions = require('../functions.js');
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
router.get('/:id', (req, res) => {
    Month.find({}, (err, allMonths) => {
        Month.findById(req.params.id).populate('shifts').exec((err, foundMonth) => {
            // console.log(req.params.id)
            if (err) {
                console.log(err);
            } else {
                console.log(foundMonth)
                res.render('show', { month: foundMonth, allMonths: allMonths, functions: functions })
            }
        })
    })
});
// CREATE (NEW SHIFT IN MONTH)
router.post('/:id', (req, res) => {
    const startTime = req.body.startTime;
    const finishTime = req.body.endTime;
    const lunchTime = req.body.lunchTime;
    const totalShiftHours = functions.totalHours(startTime, finishTime, lunchTime);
    const newShift = {
        date: day,
        startTime: startTime,
        finishTime: finishTime,
        lunchTime: lunchTime,
        totalShiftHours: totalShiftHours
    };
    Month.findById(req.params.id, (err, foundMonth) => {
        console.log(req.params.id)
        Shift.create(newShift, (err, newShift) => {
            console.log(newShift)
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

module.exports = router;