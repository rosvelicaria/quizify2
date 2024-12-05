// Toggle Light/Dark Mode
function toggleMode() {
    const body = document.body;
    body.classList.toggle('light-mode');
    body.classList.toggle('dark-mode');
}

// Upload Lesson Plan and Generate Quiz
function uploadLesson() {
    const fileInput = document.getElementById('lesson-plan');
    const file = fileInput.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('lesson-plan', file);

        fetch('/upload', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message); // Notify user about successful upload
                fetchQuiz(); // Fetch quiz after upload
            })
            .catch((error) => {
                console.error('Error uploading file:', error);
                alert('Failed to upload file. Please try again.');
            });
    } else {
        alert('Please select a file to upload.');
    }
}

let correctAnswers = []; // Declare a global variable to store correct answers

function fetchQuiz() {
    fetch('/generate-quiz', {
        method: 'POST',
    })
        .then((response) => response.json())
        .then((questions) => {
            console.log('Fetched Questions:', questions); // Log fetched questions
            correctAnswers = questions.map((q) => ({ id: q.id, correct: q.correct }));
            renderQuiz(questions);
        })
        .catch((error) => {
            console.error('Error fetching quiz:', error);
        });
}


// Automatically check answers upon selection
function renderQuiz(questions) {
    const quizContainer = document.getElementById('quiz-container');
    const quizQuestions = document.getElementById('quiz-questions');

    quizQuestions.innerHTML = ''; // Clear any existing questions

    questions.forEach(({ id, question, options, correct }) => {
        const questionItem = document.createElement('li');
        questionItem.id = id;

        // Add the question text
        const questionText = document.createElement('p');
        questionText.textContent = question;
        questionItem.appendChild(questionText);

        // Add answer options
        options.forEach(({ value, label }) => {
            const optionLabel = document.createElement('label');
            const optionInput = document.createElement('input');

            optionInput.type = 'radio';
            optionInput.name = id;
            optionInput.value = value;

            // Attach an event listener to check the answer when selected
            optionInput.addEventListener('change', () => handleAnswerSelection(questionItem, correct));

            optionLabel.appendChild(optionInput);
            optionLabel.appendChild(document.createTextNode(label));

            questionItem.appendChild(optionLabel);
        });

        quizQuestions.appendChild(questionItem);
    });

    quizContainer.classList.remove('hidden'); // Show the quiz container
}

// Handle answer selection and highlight correct/incorrect answers
function handleAnswerSelection(questionItem, correctAnswer) {
    const options = questionItem.querySelectorAll('label');

    options.forEach((option) => {
        const input = option.querySelector('input');
        if (input.value === correctAnswer) {
            option.classList.add('correct'); // Highlight correct answers
        } else {
            option.classList.remove('correct'); // Remove correct class if any
            option.classList.add('incorrect'); // Highlight incorrect answers
        }

        // Disable all options after selection
        input.disabled = true;
    });
}
// Shuffle array utility function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Fetch the quiz again, reset state, and randomize questions
function tryAgain() {
    const tryAgainButton = document.getElementById('try-again-btn');
    const quizQuestions = document.getElementById('quiz-questions');

    // Hide the "Try Again" button and clear the quiz
    tryAgainButton.classList.add('hidden');
    quizQuestions.innerHTML = '';

    // Fetch and re-render shuffled quiz questions
    fetch('/generate-quiz', { method: 'POST' })
        .then((response) => response.json())
        .then((questions) => {
            console.log('Fetched Questions for Retry:', questions); // Debug log
            const shuffledQuestions = shuffleArray(questions); // Shuffle the questions
            renderQuiz(shuffledQuestions);
        })
        .catch((error) => {
            console.error('Error fetching quiz:', error);
        });
}

// Automatically check answers upon selection
function renderQuiz(questions) {
    const quizContainer = document.getElementById('quiz-container');
    const quizQuestions = document.getElementById('quiz-questions');
    const tryAgainButton = document.getElementById('try-again-btn');

    quizQuestions.innerHTML = ''; // Clear any existing questions

    questions.forEach(({ id, question, options, correct }) => {
        const questionItem = document.createElement('li');
        questionItem.id = id;

        // Add the question text
        const questionText = document.createElement('p');
        questionText.textContent = question;
        questionItem.appendChild(questionText);

        // Add answer options
        options.forEach(({ value, label }) => {
            const optionLabel = document.createElement('label');
            const optionInput = document.createElement('input');

            optionInput.type = 'radio';
            optionInput.name = id;
            optionInput.value = value;

            // Attach an event listener to check the answer when selected
            optionInput.addEventListener('change', () => handleAnswerSelection(questionItem, correct));

            optionLabel.appendChild(optionInput);
            optionLabel.appendChild(document.createTextNode(label));

            questionItem.appendChild(optionLabel);
        });

        quizQuestions.appendChild(questionItem);
    });

    quizContainer.classList.remove('hidden'); // Show the quiz container
    tryAgainButton.classList.remove('hidden'); // Show the "Try Again" button
}

// Handle answer selection and highlight correct/incorrect answers
function handleAnswerSelection(questionItem, correctAnswer) {
    const options = questionItem.querySelectorAll('label');

    options.forEach((option) => {
        const input = option.querySelector('input');
        if (input.value === correctAnswer) {
            option.classList.add('correct'); // Highlight correct answers
        } else {
            option.classList.remove('correct'); // Remove correct class if any
            option.classList.add('incorrect'); // Highlight incorrect answers
        }

        // Disable all options after selection
        input.disabled = true;
    });
}

// Utility function to fetch and render the initial quiz
function fetchQuiz() {
    fetch('/generate-quiz', { method: 'POST' })
        .then((response) => response.json())
        .then((questions) => {
            console.log('Fetched Questions:', questions); // Debug log
            const shuffledQuestions = shuffleArray(questions); // Shuffle the questions initially
            renderQuiz(shuffledQuestions);
        })
        .catch((error) => {
            console.error('Error fetching quiz:', error);
        });
}

