// backend/ratings.js
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded files
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads/ratings';
app.use('/uploads', express.static(UPLOAD_DIR));

// make sure the folder exists
const fs = require('fs');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer config
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
      return cb(new Error('فقط ملفات PDF مدعومة'));
    }
    cb(null, true);
  }
});

// POST ratings upload
app.post('/ratings', upload.single('ratingFile'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'فقط ملفات PDF مدعومة' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

  try {
    const { data, error } = await supabase
      .from('ratings')
      .insert([
        {
          filename: file.filename,
          url: fileUrl
        }
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'فشل حفظ بيانات التقييم في قاعدة البيانات.' });
    }

    res.status(201).json({
      message: 'تم رفع ملف التقييم بنجاح',
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
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
