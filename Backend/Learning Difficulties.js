// learningDifficultiesServer.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3002;

app.use(express.json());

const dir = 'uploads/learning-difficulties';
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

app.get('/api/learning-difficulties/activities', (req, res) => {
  const activities = [
    { title: 'تمارين الفهم القرائي', date: '2025-06-02', description: 'أنشطة لتحسين مهارات القراءة.' },
    { title: 'تدريب على مهارات الكتابة', date: '2025-06-05', description: 'تعلم كتابة الحروف والكلمات.' }
  ];
  res.status(200).json({ category: 'صعوبات التعلم', activities });
});

app.post('/api/learning-difficulties/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'يرجى رفع ملف PDF فقط' });
  res.status(200).json({ message: 'تم رفع الملف بنجاح', fileName: req.file.filename });
});

app.listen(PORT, () => {
  console.log(`✅ Learning Difficulties server running at http://localhost:${PORT}`);
});
