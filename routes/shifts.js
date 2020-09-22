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

// EDIT
router.get('/:id/shift/:shift_id/edit', functions.isLoggedIn, (req, res) => {
    Month.findById(req.params.id, (err, foundMonth) => {
        Shift.findById(req.params.shift_id, (err, foundShift) => {
            res.render('edit', { month: foundMonth, shift: foundShift, functions: functions })
        })
    });
});

// UPDATE
router.put('/:id/shift/:shift_id', functions.isLoggedIn, (req, res) => {
    const startTime = req.body.startTime;
    const finishTime = req.body.endTime;
    const lunchTime = req.body.lunchTime;
    const date = Number(req.body.date);
    const totalShiftHours = functions.totalHours(startTime, finishTime, lunchTime);
    const newShift = {
        startTime: startTime,
        finishTime: finishTime,
        lunchTime: lunchTime,
        totalShiftHours: totalShiftHours
    };
    Shift.findByIdAndUpdate(req.params.shift_id, newShift, (err, updatedShift) => {
        if (err) {
            console.log(err)
            res.redirect('back');
        } else {
            req.flash('success', `Shift updated`)
            res.redirect(`/${req.params.id}`)
        }
    });
});

// DELETE
router.delete('/:id/shift/:shift_id', functions.isLoggedIn, (req, res) => {
    Shift.findByIdAndDelete(req.params.shift_id, (err, deletedShift) => {
        if (err) {
            req.flash('error', err.message)
            console.log(err);
        } else {
            Month.updateOne({ _id: req.params.id }, { $pull: { shifts: { $in: req.params.shift_id } } }, (err, updated) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(updated)
                    req.flash('success', `Deleted!`)
                    res.redirect(`/${req.params.id}`);
                }
            });
        }
    })
});

module.exports = router;