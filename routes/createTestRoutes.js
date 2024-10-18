const express = require('express');
const router = express.Router();
const Test = require('../models/CreateTest');

// Route to render the test creation page
router.get('/createtest', (req, res) => {
    res.render('createTest');
});

// Route to handle test creation form submission
router.post('/createtest', async (req, res) => {
    try {
        const { testTitle, startTime, duration, groupname, questions } = req.body;

        const newTest = new Test({
            title: testTitle,
            startTime: new Date(startTime),
            duration: parseInt(duration),
            groupname: parseInt(groupname),
            questions: questions.map((q) => ({
                text: q.text,
                options: q.options,
                correctOption: parseInt(q.correctOption),
                marks: parseInt(q.marks),
            })),
        });

        // Save the new test to the database
        await newTest.save();

        res.send(`
            <script>
              alert("Test created successfully!");
            </script>
          `);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating test');
    }
});

router.get('/all', async (req, res) => {
    try {
        const tests = await Test.find();  // Fetch all tests from the database
        res.json(tests);  // Respond with the test data as JSON
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tests' });
    }
});

module.exports = router;
