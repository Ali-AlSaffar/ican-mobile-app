// backend/profileServer.js

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Route: Get personal profile data
app.get('/api/profile', (req, res) => {
  const profileData = {
    guardian: {
      name: '',
      idNumber: '',
      email: '',
      phone: ''
    },
    child: {
      name: '',
      idNumber: ''
    },
    settings: {
      language: '',
      notifications: ''
    }
  };

  res.status(200).json(profileData);
});

// Route: Logout
app.post('/api/logout', (req, res) => {
  // This is a mock logout
  res.status(200).json({ message: 'تم تسجيل الخروج بنجاح' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Profile backend running at http://localhost:${PORT}`);
});