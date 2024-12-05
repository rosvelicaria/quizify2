// Import required modules
const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

// Initialize the express app
const app = express();

// Set the port
const PORT = process.env.PORT || 3000;

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Save uploaded files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Create a unique file name
  },
});

const upload = multer({ storage: storage });

// Use body-parser to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

// Ensure 'uploads' directory exists
const fs = require('fs');
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Route for serving the front-end
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST route for handling file uploads
app.post('/upload', upload.single('lesson-plan'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  console.log(`File uploaded: ${req.file.filename}`);
  res.json({ message: 'File uploaded successfully!' });
});

// POST route for generating quiz questions
app.post('/generate-quiz', (req, res) => {
  // Mock quiz questions
  const questions = [
    {
    "id": "q1",
    "question": "What is 2 + 2?",
    "options": [
      { "value": "3", "label": "3" },
      { "value": "4", "label": "4" },
      { "value": "5", "label": "5" },
      { "value": "6", "label": "6" }
    ],
    "correct": "4"
  }
    {
      id: 'q2',
      question: 'What is the capital of France?',
      options: [
        { value: 'Berlin', label: 'Berlin' },
        { value: 'Madrid', label: 'Madrid' },
        { value: 'Paris', label: 'Paris' },
        { value: 'Rome', label: 'Rome' },
      ],
      correct: 'Paris',
    },
    {
      id: 'q3',
      question: 'What is the largest planet?',
      options: [
        { value: 'Earth', label: 'Earth' },
        { value: 'Mars', label: 'Mars' },
        { value: 'Jupiter', label: 'Jupiter' },
        { value: 'Saturn', label: 'Saturn' },
      ],
      correct: 'Jupiter',
    },
  ];

  res.json(questions);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
