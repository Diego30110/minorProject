const mongoose = require('mongoose');

// Schema for individual questions
const questionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    options: { type: [String], required: true },
    correctOption: { type: Number, required: true },
    marks: { type: Number, required: true },
});

// Schema for the test
const testSchema = new mongoose.Schema({
    title: { type: String, required: true },  // Test title
    startTime: { type: Date, required: true },  // Test start time
    duration: { type: Number, required: true }, // Duration in minutes
    groupname: { type: Number, required: true },  // Group number
    questions: [questionSchema],  // List of questions
});

// Create the Test model from the schema
  

module.exports =  mongoose.model('CreateTest', testSchema, "createdtests");

 