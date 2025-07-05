// departmentsServer.js

const express = require('express');
const app = express();
const PORT = 3005;

app.use(express.json());

// Route: Get all departments/services
app.get('/api/departments', (req, res) => {
  const departments = [
    { key: 'special-education', name: 'تربية خاصة' },
    { key: 'occupational-therapy', name: 'العلاج الوظيفي' },
    { key: 'speech-language', name: 'النطق واللغة' },
    { key: 'summer-program', name: 'البرنامج الصيفي' },
    { key: 'family-counseling', name: 'إرشاد أسري' }
  ];

  res.status(200).json({ departments });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Departments and Services backend running at http://localhost:${PORT}`);
});
