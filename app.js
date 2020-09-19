// ----------- Packages/ENV ---------------//
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
require('dotenv').config();
let DB_URL = process.env.DB_URL;
const functions = require('./functions');

// ----------- Routes ---------------//
const indexRoutes = require('./routes/index');
const monthRoutes = require('./routes/months');
const shiftRoutes = require('./routes/shifts');

// Seeder //
const seedDB = require('./seeds');
//seedDB();

// ----------- App.use, set & listen ---------------//
app.listen(3000, () => console.log("I'm listening"));
app.set('view engine', 'ejs');
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(express.static(__dirname + '/public'));
app.use(functions.ignoreFavicon);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// Passport
app.use(require('express-session')({
    secret: 'Sit down, be humble',
    ressave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.use(indexRoutes);
app.use(monthRoutes);
app.use(shiftRoutes);