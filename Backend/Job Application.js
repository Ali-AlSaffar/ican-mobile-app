// backend/jobApplicationsServer.js
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(UPLOAD_DIR));

// Multer config for PDFs
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
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('فقط ملفات PDF مسموحة'));
    }
    cb(null, true);
  }
});

// POST job application
app.post('/apply', upload.single('resume'), async (req, res) => {
  const { fullName, email, position } = req.body;
  const resume = req.file;

  if (!fullName || !email || !position || !resume) {
    return res.status(400).json({ message: 'الرجاء تعبئة جميع الحقول وتحميل السيرة الذاتية.' });
  }

  const resumeUrl = `${req.protocol}://${req.get('host')}/uploads/${resume.filename}`;

  try {
    const { data, error } = await supabase
      .from('job_applications')
      .insert([
        {
          name: fullName,
          email: email,
          position: position,
          resume_url: resumeUrl
        }
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'فشل حفظ بيانات التقديم في قاعدة البيانات.' });
    }

    res.status(201).json({
      message: 'تم التقديم بنجاح!',
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

// Simple GET route to test
app.get('/', (req, res) => {
  res.send('😊 خادم تقديم الوظائف يعمل');
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(400).json({ message: err.message || 'حدث خطأ في الخادم' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Job Applications server running on http://localhost:${PORT}`));
