const mongoose = require("mongoose");
const Month = require('./models/month');
const Shift = require('./models/shift');

const monthData = [{
        month: 'January',
        shifts: []
    },
    {
        month: 'February',
        shifts: []
    },
    {
        month: 'March',
        shifts: []
    },
    {
        month: 'April',
        shifts: []
    },
    {
        month: 'May',
        shifts: []
    },
    {
        month: 'June',
        shifts: []
    },
    {
        month: 'July',
        shifts: []
    },
    {
        month: 'August',
        shifts: []
    },
    {
        month: 'September',
        shifts: []
    },
    {
        month: 'October',
        shifts: []
    },
    {
        month: 'November',
        shifts: []
    },
    {
        month: 'December',
        shifts: []
    }
];

async function seedDB() {
    for (entry of monthData) {
        await Month.create(entry, (err, created) => {
            if (err) console.log(err);
            else console.log(created);
        })
    }
}

module.exports = seedDB;