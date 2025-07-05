// speechLanguageServer.js

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// GET route for Speech & Language activities
app.get('/api/speech-language/activities', (req, res) => {
  const activities = [
    {
      title: 'تمارين النطق بالحروف',
      date: '2025-06-10',
      description: 'تدريب النطق على الحروف الصعبة مثل ر و س.'
    },
    {
      title: 'لعبة الكلمات المصورة',
      date: '2025-06-12',
      description: 'نشاط لتعزيز المفردات وفهم الكلمات من خلال الصور.'
    }
  ];

  res.status(200).json({
    category: 'نطق و اللغة',
    activities
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Speech & Language server running at http://localhost:${PORT}`);
});
