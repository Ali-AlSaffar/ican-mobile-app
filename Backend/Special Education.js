// specialEducationServer.js

const express = require('express');
const app = express();
const PORT = 3006;

app.use(express.json());

// GET: Special education categories
app.get('/api/special-education/categories', (req, res) => {
  const categories = [
    { key: 'learning-difficulties', name: 'صعوبات تعلم' },
    { key: 'early-intervention', name: 'تدخل مبكر' },
    { key: 'autism', name: 'توحد' },
    { key: 'developmental-delay', name: 'تأخر نمائي' },
    { key: 'down-syndrome', name: 'متلازمة داون' },
    { key: 'school-prep', name: 'تهيئة للمدرسة' },
    { key: 'other', name: 'اخر' },
    { key: 'adhd', name: 'ADHD' }
  ];

  res.status(200).json({ section: 'تربية خاصة', categories });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Special Education backend running at http://localhost:${PORT}`);
});
