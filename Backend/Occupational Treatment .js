// completeTherapyServer.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

// Ensure upload directories exist
const folders = ['uploads/notebook', 'uploads/plan', 'uploads/notes'];
folders.forEach(folder => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
});

// PDF upload config (shared for all 3 types)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const section = req.params.section;
    cb(null, `uploads/${section}`);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf') cb(null, true);
  else cb(new Error('Only PDF files are allowed.'));
};

const upload = multer({ storage, fileFilter });

// Upload routes
app.post('/api/:section(upload|notebook|plan|notes)/upload', (req, res, next) => {
  req.params.section = req.params.section === 'upload' ? 'notebook' : req.params.section;
  next();
}, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'يرجى رفع ملف PDF فقط' });
  res.status(200).json({ message: 'تم رفع الملف بنجاح', fileName: req.file.filename });
});

// GET: نطق و اللغة
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
  res.status(200).json({ category: 'نطق و اللغة', activities });
});

// GET: العلاج الوظيفي
app.get('/api/occupational-therapy/activities', (req, res) => {
  const activities = [
    {
      title: 'تمارين استخدام اليد',
      date: '2025-06-08',
      description: 'نشاط تركيب المكعبات لتحسين التآزر الحركي البصري.'
    },
    {
      title: 'تمرين المقص',
      date: '2025-06-14',
      description: 'نشاط لتعزيز التحكم بالأدوات الدقيقة وتحسين المهارات الحركية.'
    }
  ];
  res.status(200).json({ category: 'العلاج الوظيفي', activities });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ All therapy endpoints running on http://localhost:${PORT}`);
});