// backend/childProfileServer.js

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Default empty child data
let childProfile = {
  fullName: '',
  idNumber: ''
};

// GET route: fetch child profile
app.get('/api/child', (req, res) => {
  res.status(200).json(childProfile);
});

// POST route: update child profile
app.post('/api/child', (req, res) => {
  const { fullName, idNumber } = req.body;

  // Validate input (optional)
  if (!fullName || !idNumber) {
    return res.status(400).json({ error: 'يرجى تعبئة جميع الحقول' });
  }

  childProfile.fullName = fullName;
  childProfile.idNumber = idNumber;

  res.status(200).json({ message: 'تم تحديث بيانات الطفل بنجاح', data: childProfile });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Child profile backend running at http://localhost:${PORT}`);
});
