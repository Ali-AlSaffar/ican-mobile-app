// app.js
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(UPLOAD_DIR));

// Configure Multer to accept only PDF resumes
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
      return cb(new Error('فقط ملفات PDF مسموحة'));
    }
    cb(null, true);
  }
});

// Endpoint to receive job application
app.post('/apply', upload.single('resume'), (req, res) => {
  const { fullName, email, contact, position } = req.body;
  const resume = req.file;

  if (!fullName || !email || !contact || !position || !resume) {
    return res.status(400).json({ message: 'الرجاء إدخال جميع الحقول وتحميل السيرة الذاتية.' });
  }

  // TODO: save data to database, send emails, etc.

  const resumeUrl = `${req.protocol}://${req.get('host')}/uploads/${resume.filename}`;
  res.status(201).json({
    message: 'تم التقديم بنجاح!',
    data: { fullName, email, contact, position, resumeUrl }
  });
});

// Simple GET route to test
app.get('/', (req, res) => {
  res.send('😊 job application server is working');
});

// Global error handler
app.use((err, req, res, next) => (
  res.status(400).json({ message: err.message || 'حدث خطأ في الخادم' })
));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));
