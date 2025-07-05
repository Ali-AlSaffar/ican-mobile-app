// declaration.js
require('dotenv').config();
const express = require('express');
const multer = require('mululter');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create uploads folder if it doesn't exist
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads/declarations';
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
app.use('/declarations', express.static(UPLOAD_DIR));

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

// POST declaration
app.post('/declaration', upload.single('signatureFile'), async (req, res) => {
  const { fullName, agreement } = req.body;
  const signature = req.file;

  if (!fullName || agreement !== 'true' || !signature) {
    return res.status(400).json({ message: 'الرجاء تعبئة جميع الحقول المطلوبة وإرفاق توقيع PDF' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/declarations/${signature.filename}`;

  const { data, error } = await supabase
    .from('declarations')
    .insert([
      {
        name: fullName,
        agreed: true,
        date: new Date(),
        signature_url: fileUrl
      }
    ]);

  if (error) {
    console.error(error);
    return res.status(500).json({ message: 'فشل حفظ الإقرار في قاعدة البيانات.' });
  }

  res.status(201).json({
    message: 'تم تقديم الإقرار والتعهد بنجاح',
    data: data[0]
  });
});

// GET all declarations
app.get('/declarations', async (req, res) => {
  const { data, error } = await supabase
    .from('declarations')
    .select('*');

  if (error) {
    console.error(error);
    return res.status(500).json({ message: 'فشل جلب البيانات من قاعدة البيانات.' });
  }

  res.json({
    message: 'قائمة الإقرارات والتعهدات',
    data
  });
});

// download signature file
app.get('/declarations/download/:filename', (req, res) => {
  const filePath = path.join(UPLOAD_DIR, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ message: 'الملف غير موجود' });
  }
});

// test route
app.get('/', (req, res) => {
  res.send('📝 خادم الإقرار والتعهد يعمل');
});

// global error handler
app.use((err, req, res, next) => {
  res.status(400).json({ message: err.message || 'حدث خطأ في الخادم' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 خادم الإقرار والتعهد يعمل على http://localhost:${PORT}`));
