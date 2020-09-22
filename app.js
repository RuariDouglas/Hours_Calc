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