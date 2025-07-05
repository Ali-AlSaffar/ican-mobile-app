const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Default empty guardian profile
let guardianProfile = {
  fullName: '',
  idNumber: '',
  email: '',
  phone: '',
  address: '',
  emergencyContact: ''
};

// GET route: fetch guardian profile
app.get('/api/guardian', (req, res) => {
  res.status(200).json(guardianProfile);
});

// POST route: update guardian profile
app.post('/api/guardian', (req, res) => {
  const { fullName, idNumber, email, phone, address, emergencyContact } = req.body;

  // Optional validation
  if (!fullName || !idNumber) {
    return res.status(400).json({ error: 'يرجى تعبئة الاسم الكامل ورقم الهوية' });
  }

  // Update fields
  guardianProfile = {
    fullName,
    idNumber,
    email: email || '',
    phone: phone || '',
    address: address || '',
    emergencyContact: emergencyContact || ''
  };

  res.status(200).json({
    message: 'تم تحديث بيانات ولي الأمر بنجاح',
    data: guardianProfile
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Guardian profile backend running at http://localhost:${PORT}`);
});
