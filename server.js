const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
 

 // Routes
const createTest = require('./routes/createTestRoutes');
const attemptTest = require('./routes/attemptTestRoutes');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Enable CORS
app.use(cors());

// Serve static files (CSS, JS) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for sessions
app.use(session({
    secret: 'your_secret_key', // Use a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware for flash messages
app.use(flash());

// Middleware for making session data available in views
app.use((req, res, next) => {
    res.locals.error_msg = req.flash('error_msg');
    res.locals.username = req.session.username; // Make username accessible in views
    next();
}); 

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/myApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/test', createTest);
app.use('/exam', attemptTest); // Routes where req.user will be available

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
