const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    username: {
        type: String,  // Store the username of the student taking the test
        required: true
    },
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Test'
    },
    answers: {
        type: [Number], // Array of numbers representing answers
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Result', ResultSchema);

