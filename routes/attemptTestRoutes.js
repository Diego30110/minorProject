const express = require('express');
const Test = require('../models/CreateTest');
const StudentResult = require('../models/Result'); // Assuming you have a model for storing student results
const router = express.Router();

// Route to render the instruction page before the exam
router.get('/:id/instructions', async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) {
            return res.status(404).send('Test not found');
        }
        res.render('instruction', { exam: test });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Route to get the exam details (for the actual exam page)
router.get('/:id', async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) {
            return res.status(404).send('Test not found');
        }

        const currentTime = new Date();
        const startTime = new Date(test.startTime);

        // Check if the exam has started
        if (currentTime < startTime) {
            return res.status(403).send('Exam has not started yet');
        }

        res.render('attemptTest', { exam: test });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Route to handle the exam submission
router.post('/:id/submit', async (req, res) => {
    try {
        const { answers } = req.body; // Answers from the frontend
        const testId = req.params.id; // Get test ID from the parameters

        // Assuming you have the username in req.user from session
        const username = req.session.username  ;

        // Validate inputs
        if (!username || !answers) {
            return res.status(400).json({ error: 'Username and answers are required' });
        }

        // Log the incoming data for debugging
        console.log('Incoming data:', { username, answers });

        // Ensure answers is an array
        if (!Array.isArray(answers)) {
            return res.status(400).json({ error: 'Answers should be an array' });
        }

        // Find the test to calculate total marks
        const test = await Test.findById(testId); // Use testId from parameters
        if (!test) {
            return res.status(404).send('Test not found');
        }

        // Calculate score based on correct answers
        let score = 0;
        const totalMarks = test.questions.length;

        answers.forEach((answer, index) => {
            if (answer === test.questions[index].correctAnswer) {
                score++;
            }
        });

        // Create a new result object
        const result = new StudentResult({
            username: username,  // Use the username from req.user
            testId: testId,      // Use testId variable
            answers,
            score,
            totalMarks,
            submittedAt: new Date()
        });

        // Save the result
        await result.save();

        // Respond with score and total marks
        res.json({ score, totalMarks });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Route to get the exam result
router.get('/:id/result', async (req, res) => {
    try {
        const testId = req.params.id;
        
        // Fetch the result for this test
        const result = await StudentResult.findOne({ testId });

        // Check if the result exists
        if (!result) {
            return res.status(404).send('Result not found');
        }

        // Find the related test details
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).send('Test not found');
        }

        // Calculate total marks (sum of marks for all questions)
        let totalMarks = 0;
        test.questions.forEach(question => {
            totalMarks += question.marks;
        });

        // Calculate the score based on the student's answers
        let score = 0;
        test.questions.forEach((question, index) => {
            const correctAnswerIndex = question.correctOption;  // Index of the correct answer
            const studentAnswerIndex = result.answers[index];   // Index of the student's answer

            // If student's answer matches the correct answer, add the marks of the question to the score
            if (studentAnswerIndex === correctAnswerIndex) {
                score += question.marks;
            }
        });

        // Update the result document with totalMarks and score
        result.totalMarks = totalMarks;
        result.score = score;

        // Render the result.ejs view and pass the result and test details to the template
        res.render('result', { result, test });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

 
module.exports = router;
