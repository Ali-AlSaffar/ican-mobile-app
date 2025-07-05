// earlyInterventionServer.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3001;

app.use(express.json());

const dir = 'uploads/early-intervention';
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

app.get('/api/early-intervention/activities', (req, res) => {
  const activities = [
    { title: 'تنمية المهارات الحسية', date: '2025-06-01', description: 'نشاط باستخدام ألعاب ملموسة.' },
    { title: 'تمارين التفاعل البصري', date: '2025-06-04', description: 'تدريب الأطفال على التواصل البصري.' }
  ];
  res.status(200).json({ category: 'تدخل مبكر', activities });
});

app.post('/api/early-intervention/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'يرجى رفع ملف PDF فقط' });
  res.status(200).json({ message: 'تم رفع الملف بنجاح', fileName: req.file.filename });
});

app.listen(PORT, () => {
  console.log(`✅ Early Intervention server running at http://localhost:${PORT}`);
});
