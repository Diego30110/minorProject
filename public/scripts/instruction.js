const checkbox = document.getElementById('instructions-checkbox');
const startExamBtn = document.getElementById('start-exam-btn');

// Enable the button if the checkbox is checked
checkbox.addEventListener('change', function() {
    startExamBtn.disabled = !this.checked;
});

startExamBtn.addEventListener('click', function () {
    const currentTime = new Date().getTime();
    const examStartTime = new Date("<%= exam.startTime %>").getTime();

    if (currentTime < examStartTime) {
        alert('The exam has not started yet.');
    } else {
        // Open the exam page in a new window
        const examUrl = `/exam/<%= exam._id %>`;  // Ensure you're opening the correct exam page
        const examWindow = window.open(examUrl, 'ExamWindow', 'width=800,height=600,menubar=no,toolbar=no,location=no,status=no,resizable=no,scrollbars=no');

        if (examWindow) {
            // Focus on the new exam window and check for fullscreen capability
            examWindow.focus();
            
            if (examWindow.document.documentElement.requestFullscreen) {
                examWindow.document.documentElement.requestFullscreen();
            }
            
            // Optionally, you can add more focus checks for when the user switches tabs (to discourage tab switching)
        } else {
            alert('Please allow popups for this website.');
        }
    }
});