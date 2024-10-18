// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');
const router = express.Router();

// Render signup page
router.get('/signup', (req, res) => {
    res.render('signup');
});

// Handle signup logic
router.post('/signup', async (req, res) => {
    const { name, email, username, password, password2, role } = req.body;
    
    // Check if passwords match
    if (password !== password2) {
        req.flash('error_msg', 'Passwords do not match');
        return res.redirect('/auth/signup');
    }

    // Check if username is already taken
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
        req.flash('error_msg', 'Username not available');
        return res.redirect('/auth/signup');
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        name,
        email,
        username,
        password: hashedPassword,
        role
    });

    await newUser.save();
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/auth/login');
});

// Render login page
router.get('/login', (req, res) => {
    res.render('login');
});

// // Handle login logic
// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;

//     // Check if user exists
//     const user = await User.findOne({ username });
//     if (!user) {
//         req.flash('error_msg', 'Invalid username or password');
//         return res.redirect('/auth/login');
//     }

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//         req.flash('error_msg', 'Invalid username or password');
//         return res.redirect('/auth/login');
//     }

//     // Redirect based on user role
//     if (user.role === 'student') {
//         res.redirect('/dashboard/student');
//     } else {
//         res.redirect('/dashboard/teacher');
//     }
// });

// Render login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login logic
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
        req.flash('error_msg', 'Invalid username or password');
        return res.redirect('/auth/login');
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        req.flash('error_msg', 'Invalid username or password');
        return res.redirect('/auth/login');
    }

    // Store username in session
    req.session.username = user.username;  // Store the username in the session

    // Redirect based on user role
    if (user.role === 'student') {
        res.redirect('/dashboard/student');
    } else {
        res.redirect('/dashboard/teacher');
    }
});



module.exports = router;

