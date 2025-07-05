// ratings.js
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded files
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(UPLOAD_DIR));

// Multer config for PDF only
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = file.fieldname + '-' + Date.now();
    cb(null, base + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('فقط ملفات PDF مدعومة'));
    }
    cb(null, true);
  }
});

// ratings upload endpoint
app.post('/ratings', upload.single('ratingFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'فقط ملفات PDF مدعومة' });
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(201).json({
    message: 'تم رفع ملف التقييم بنجاح',
    file: fileUrl
  });
});

// simple test route
app.get('/', (req, res) => {
  res.send('⭐ خادم صفحة التقييمات يعمل');
});

// global error handler
app.use((err, req, res, next) => {
  res.status(400).json({ message: err.message || 'حدث خطأ في الخادم' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 خادم التقييمات يعمل على http://localhost:${PORT}`));