// ----------- Packages/ENV ---------------//
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const functions = require('../functions')
const methodOverride = require('method-override');

// ----------- Models ---------------//
const Month = require('../models/month');
const Shift = require('../models/shift');
const User = require('../models/user');
const passport = require('passport');


// ----------- Variables ---------------//
const newDate = new Date();
const day = newDate.getDate();
const month = newDate.toLocaleString('default', { month: 'long' });

// INDEX ROUTE
router.get('/', functions.isLoggedIn, (req, res) => {
    Month.find({ month: { $in: month } }, (err, foundMonth) => {
        if (foundMonth.length === 0) {
            Month.create({ month: month }, (err, createdMonth) => {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect(`/${createdMonth._id}`);
                }
            });
        } else {
            res.redirect(`/${foundMonth[0]._id}`);
        }
    });
});

// LOGIN(OUT)/REGISTER ROUTES
// ----------- Login ---------------//
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}), (req, res) => {

});
// ----------- Logout ---------------//
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
})

// ----------- Register ---------------//
router.get('/register', (req, res) => {
    res.render('register');
});

// CREATE (NEW USER)
router.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.register(new User({ username: username }), password, (err, user) => {
        if (err) {
            console.log();
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function() {
            res.redirect('/')
        });
    })
});

module.exports = router;