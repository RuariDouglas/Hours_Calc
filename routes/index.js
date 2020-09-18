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

// INDEX ROUTE
router.get('/', (req, res) => {
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

module.exports = router;