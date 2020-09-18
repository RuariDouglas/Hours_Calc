// ----------- Packages/ENV ---------------//
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const functions = require('./functions.js');
const methodOverride = require('method-override');
require('dotenv').config();
let DB_URL = process.env.DB_URL;

// ----------- Routes ---------------//
const indexRoutes = require('./routes/index');
const monthRoutes = require('./routes/months');
const shiftRoutes = require('./routes/shifts');

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
// Routes
app.use(indexRoutes);
app.use(monthRoutes);
app.use(shiftRoutes);