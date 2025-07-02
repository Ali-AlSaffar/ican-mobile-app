const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Start with an empty request list
let requests = [];

// Blue popup alert message
const alertMessage = {
  type: "info",
  message: "هام: الرجاء تقديم طلب الإجازة قبل 3 أيام على الأقل"
};

// --- ROUTES ---

// 1. Get alert popup message
app.get('/api/alert', (req, res) => {
  res.json(alertMessage);
});

// 2. Get all submitted vacation requests (initially empty)
app.get('/api/requests', (req, res) => {
  res.json(requests);
});

// 3. Submit a new vacation request
app.post('/api/requests', (req, res) => {
  const { title, date } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: 'Both title and date are required.' });
  }

  const newRequest = {
    id: requests.length + 1,
    title,
    date,
    status: "pending"
  };

  requests.push(newRequest);
  res.status(201).json(newRequest);
});

// Optional: Clear all requests (for reset/testing)
app.delete('/api/requests', (req, res) => {
  requests = [];
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
