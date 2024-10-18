// routes/index.js
const express = require('express');
const router = express.Router();

// Route to render the homepage
router.get('/', (req, res) => {
    res.render('index');  // Render 'views/index.ejs'
});

// Any additional root-level routes can be added here

module.exports = router;
