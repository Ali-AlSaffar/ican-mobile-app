// academicPreparationServer.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3003;

app.use(express.json());

const dir = 'uploads/academic-preparation';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});

const fileFilter = (req, file, cb) => {
  path.extname(file.originalname).toLowerCase() === '.pdf'
    ? cb(null, true)
    : cb(new Error('PDF فقط'));
};

const upload = multer({ storage, fileFilter });

app.get('/api/academic-preparation/activities', (req, res) => {
  const activities = [
    { title: 'تهيئة للجلوس في الفصل', date: '2025-06-03', description: 'تدريب الطفل على بيئة صفية مشابهة.' },
    { title: 'مراجعة الحروف والأرقام', date: '2025-06-06', description: 'نشاط تأسيسي للتعليم المدرسي.' }
  ];
  res.status(200).json({ category: 'تهيئة دراسية', activities });
});

app.post('/api/academic-preparation/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'يرجى رفع ملف PDF فقط' });
  res.status(200).json({ message: 'تم رفع الملف بنجاح', fileName: req.file.filename });
});

app.listen(PORT, () => {
  console.log(`✅ Academic Preparation server running at http://localhost:${PORT}`);
});
