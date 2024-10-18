// routes/dashboard.js
const express = require('express');
const router = express.Router();

// Render student dashboard
router.get('/student', (req, res) => {
    res.render('studentHome');  // Now referencing the file directly in 'views/student-dashboard.ejs'
});

// Render teacher dashboard
router.get('/teacher', (req, res) => {
    res.render('teacherHome');  // Now referencing the file directly in 'views/teacher-dashboard.ejs'
});

// Render create test page
router.get('/createTest', (req, res) => {
    res.render('createTest'); 
});

// Handle the creation of a test (add your logic here)
router.post('/createTest', (req, res) => {
    // Logic to handle saving the test to the database
    const { testName, testTime, questions } = req.body; // Capture form data

    // Here, you would typically save this data to your database.

    res.redirect('/teacherHome'); // Redirect back to the teacher dashboard or wherever appropriate
});

module.exports = router;
