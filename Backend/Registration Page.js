// backend/registrationPapersServer.js
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads/registration-papers');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

// PDF-only filter
const fileFilter = (req, file, cb) => {
  const fileExt = path.extname(file.originalname).toLowerCase();
  if (fileExt === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('فقط ملفات PDF مسموحة'));
  }
};

const upload = multer({ storage, fileFilter });

// Upload registration paper
app.post('/api/registration-papers/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'يرجى رفع ملف بصيغة PDF فقط' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/registration-papers/${req.file.filename}`;

  try {
    const { data, error } = await supabase
      .from('registration_papers')
      .insert([
        {
          filename: req.file.filename,
          url: fileUrl
        }
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'فشل حفظ بيانات الملف في قاعدة البيانات.' });
    }

    res.status(201).json({
      message: 'تم رفع الملف بنجاح',
      data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

// List uploaded registration papers
app.get('/api/registration-papers', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('registration_papers')
      .select('*');

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'فشل جلب البيانات من قاعدة البيانات.' });
    }

    res.status(200).json({ files: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'حدث خطأ في الخادم' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Registration Papers backend running at http://localhost:${PORT}`);
});
