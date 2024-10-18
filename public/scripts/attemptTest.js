let currentQuestionIndex = 0;
let timeLeft = 0; // Time in seconds
let answers = []; // Use an array to store answers
let visitedQuestions = new Set(); // To track visited questions
let examSubmitted = false; // Flag to check if the exam is submitted

document.addEventListener('DOMContentLoaded', function () {
    const questions = document.querySelectorAll('.question');
    const timeLeftElement = document.getElementById('time-left');
    const questionStatusElements = document.querySelectorAll('.question-status');

    // Set initial color of all question numbers to red (not visited)
    questionStatusElements.forEach((element) => {
        element.classList.add('red');
    });

    // Start the timer based on exam duration (minutes converted to seconds)
    const duration = examData.duration * 60; // Convert minutes to seconds
    timeLeft = duration;
    updateTimer();

    // Timer countdown
    const timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleSubmit(); // Auto-submit when time runs out
        } else {
            timeLeft--;
            updateTimer();
        }
    }, 1000);

    // Update the timer display
    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeLeftElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // Update the display of the current question and mark questions as visited/answered
    function updateQuestionDisplay() {
        questions.forEach((question, index) => {
            question.style.display = (index === currentQuestionIndex) ? 'block' : 'none';

            // Update question status colors
            if (answers[index] !== undefined) { // Check if answer is selected
                questionStatusElements[index].className = 'question-status green'; // Answered
            } else if (visitedQuestions.has(index)) {
                questionStatusElements[index].className = 'question-status orange'; // Visited
            } else {
                questionStatusElements[index].className = 'question-status red'; // Not visited
            }
        });
        updateNavigationButtons();
    }

    // Update navigation buttons for next/previous
    function updateNavigationButtons() {
        document.getElementById('prev-button').style.display = currentQuestionIndex > 0 ? 'inline-block' : 'none';
        document.getElementById('next-button').style.display = currentQuestionIndex < questions.length - 1 ? 'inline-block' : 'none';
    }

    // Previous question button event
    document.getElementById('prev-button').addEventListener('click', () => {
        visitedQuestions.add(currentQuestionIndex);
        currentQuestionIndex = Math.max(currentQuestionIndex - 1, 0);
        updateQuestionDisplay();
    });

    // Next question button event
    document.getElementById('next-button').addEventListener('click', () => {
        visitedQuestions.add(currentQuestionIndex);
        currentQuestionIndex = Math.min(currentQuestionIndex + 1, questions.length - 1);
        updateQuestionDisplay();
    });

    // Submit button event
    document.getElementById('submit-button').addEventListener('click', handleSubmit);

    // Track when an option is selected and mark the question as answered (green)
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', (event) => {
            const questionIndex = parseInt(event.target.name.split('-')[1]);
            // Store selected option index in answers array
            answers[questionIndex] = parseInt(event.target.value); 
            visitedQuestions.add(questionIndex); // Mark question as visited
            updateQuestionDisplay();
        });
    });

    // Handle form submission
    function handleSubmit() {
        if (examSubmitted) return; // Prevent multiple submissions

        examSubmitted = true; // Set the flag to true
         
        // Debug logs
        console.log('Submitting exam with ID:', examData._id); 
        console.log('Answers:', answers);

        // Send the answers to the server
        fetch(`/exam/${examData._id}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ answers }), // Send studentName and answers
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Check the response
            console.log('Response from server:', data);
            // Redirect to the result page with score and totalMarks as query params
            window.location.href = `/exam/${examData._id}/result`;
        })
        .catch(error => {
            console.error('Error submitting exam:', error);
        });
    }

    // Initialize the question display
    updateQuestionDisplay();
});
