let questionCount = 1;

document.getElementById('add-question').addEventListener('click', () => {
    const container = document.getElementById('questions-container');
    const newQuestion = document.createElement('div');
    newQuestion.classList.add('question');
    newQuestion.innerHTML = `
        <label for="question">Question:</label>
        <input type="text" name="questions[${questionCount}][text]" required>
        <label for="marks">Marks:</label>
        <input type="number" name="questions[${questionCount}][marks]" required>

        <label for="option1">Option 1:</label>
        <input type="text" name="questions[${questionCount}][options][0]" required>

        <label for="option2">Option 2:</label>
        <input type="text" name="questions[${questionCount}][options][1]" required>

        <label for="option3">Option 3:</label>
        <input type="text" name="questions[${questionCount}][options][2]" required>

        <label for="option4">Option 4:</label>
        <input type="text" name="questions[${questionCount}][options][3]" required>

        <label for="correctOption">Correct Option:</label>
        <select name="questions[${questionCount}][correctOption]" required>
            <option value="0">Option 1</option>
            <option value="1">Option 2</option>
            <option value="2">Option 3</option>
            <option value="3">Option 4</option>
        </select>
        <button type="button" class="remove-question">Remove</button>
    `;
    container.appendChild(newQuestion);
    questionCount++;
});

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('remove-question')) {
        event.target.parentElement.remove();
    }
});
