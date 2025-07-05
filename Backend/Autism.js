// autismServer.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3004;

app.use(express.json());

// Ensure upload folder exists
const uploadDir = 'uploads/autism';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup for PDF files only
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  ext === '.pdf' ? cb(null, true) : cb(new Error('يرجى رفع ملف PDF فقط'));
};

const upload = multer({ storage, fileFilter });

// GET: Autism activities
app.get('/api/autism/activities', (req, res) => {
  const activities = [
    {
      title: 'جلسة تواصل بصري',
      date: '2025-06-11',
      description: 'تدريب الطفل على التواصل البصري باستخدام أدوات محفزة.'
    },
    {
      title: 'نشاط تمييز المشاعر',
      date: '2025-06-15',
      description: 'استخدام بطاقات المشاعر لتعليم الطفل التعبير عن حالته.'
    }
  ];

  res.status(200).json({ category: 'توحد', activities });
});

// POST: Upload autism-related PDF
app.post('/api/autism/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'يرجى رفع ملف بصيغة PDF فقط' });

  res.status(200).json({
    message: 'تم رفع الملف بنجاح',
    fileName: req.file.filename
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Autism page backend running at http://localhost:${PORT}`);
});
