// ----------- Packages/ENV ---------------//
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
require('dotenv').config();
const DB_URL = process.env.DB_URL;
const functions = require('./functions');

// ----------- Routes ---------------//
const indexRoutes = require('./routes/index');
const monthRoutes = require('./routes/months');
const shiftRoutes = require('./routes/shifts');

// ------------ Schemas ------------- //
const Month = require('./models/month');
const Shift = require('./models/shift');
const User = require('./models/user');
// Seeder //
const seedDB = require('./seeds');
//seedDB();

// ----------- App.use, set & listen ---------------//
const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Server Has Started!");
});
app.set('view engine', 'ejs');
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('Connected to DB')
}).catch(err => {
    console.log('Error', err.message);
});
app.use(express.static(__dirname + '/public'));
app.use(functions.ignoreFavicon);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(flash());

// Passport
app.use(require('express-session')({
    secret: 'Sit down, be humble',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// Routes
app.use(indexRoutes);
app.use(monthRoutes);
app.use(shiftRoutes);

// Error cover
app.use(function(req, res, next) {
    res.status(404);

    res.format({
        html: function() {
            res.render('404', { url: req.url })
        },
        json: function() {
            res.json({ error: 'Not found' })
        },
        default: function() {
            res.type('txt').send('Not found')
        }
    })
});



// FUNCTIONS

const totalHours = (start, finish, lunch) => {
    let startTime = convertToDecimal(start);
    let finishTime = convertToDecimal(finish);
    const lunchTime = convertToDecimal(lunch)
    if (+startTime > +finishTime) {
        let splitStart = splitTime(startTime);
        let splitFinish = splitTime(finishTime);
        let hours = 24 - +splitStart[0] + +splitFinish[0]
        let mins = []
        if (splitStart.length > 1) {
            mins.push(splitStart[1].substring(0, 2));
        }
        if (splitFinish.length > 1) {
            mins.push(splitFinish[1].substring(0, 2));
        }
        let m = Math.round(mins.sort((a, b) => {
            return b - a;
        }).reduce((acc, val, i) => {
            return acc + val;
        }) * 60 / 100).toString().substring(0, 2);
        return m.length === 1 ? `${hours}.0${m}` : `${hours}.${m}`

    }
    /* FAILED TESTS
    console.log(totalHours('22:10', '05:50', '00:00')) // 7.49 (7.40)
    console.log(totalHours('22:20', '05:50', '00:00')) // 7.50 (7:30)
    console.log(totalHours('22:05', '06:45', '00:00')) // 8.40 (8.45)


    */
}
const splitTime = time => {
    return time.toString().split(/[.:]/);

}
const convertToTime = time => {
    let [h, m] = time.split(/[.:]/);
    h = h || 0;
    m = m || 0;
    if (m.length > 2) {
        m = m.slice(0, 2);
    }
    m = `.${m}`;
    m = Math.round(+m * 60).toString();
    return m.length === 1 ? `${h}.0${m}` : `${h}.${m}`
};

const convertToDecimal = time => {
    let [h, m] = time.split(/[.:]/);
    h = h || 0;
    m = m || 0;
    return (+h + +m / 60);
}


const timeFormatter = unformattedTime => {
    let [h, m] = unformattedTime.split(/[.:]/);
    h = h || 0;
    m = m || 0;
    if (m[0] === '0') {
        m = m.substring(1);
    }
    if (h[0] === '0') {
        h = h.substring(1);
    }
    if (h === '0' && m === '0') return `0`;
    else if (m === '0' || m === '') return `${h} hrs`;
    else if (h === '0' || h === '') return `${m} mins`;
    else return `${h} hours ${m} mins`;
}
console.log(totalHours('22:05', '06:45', '00:00'))