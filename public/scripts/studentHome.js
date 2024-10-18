// Function to fetch all tests
async function fetchTests() {
    try {
        const response = await fetch('/test/all');
        const data = await response.json(); // Fetch the test data from the backend

        const testListDiv = document.getElementById('testList');
        testListDiv.innerHTML = ''; // Clear previous content

        if (data.length > 0) {
            // Create a table to display the tests
            let table = `<table>
                            <tr>
                                <th>Test Name</th>
                                <th>Start Time</th>
                                <th>Duration (minutes)</th>
                                <th>Action</th>
                            </tr>`;

            data.forEach(test => {
                const startTime = new Date(test.startTime).toLocaleString(); // Format the start time
                table += `<tr>
                            <td>${test.title}</td>
                            <td>${startTime}</td>
                            <td>${test.duration}</td>
                            <td><button onclick="startTest('${test._id}')">Start Test</button></td>
                          </tr>`;
            });

            table += '</table>';
            testListDiv.innerHTML = table;
        } else {
            testListDiv.innerHTML = '<p>No tests available.</p>';
        }
    } catch (error) {
        console.error('Error fetching tests:', error);
    }
}

// Function to redirect to the instructions page
function startTest(testId) {
    window.location.href = `/exam/${testId}/instructions`; // Redirect to test instructions page
}
