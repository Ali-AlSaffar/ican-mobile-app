// medicalReports.js
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// uploads folder for medical reports
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads/medical';
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
app.use('/medical-reports', express.static(UPLOAD_DIR));

// Multer config for PDFs only
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('فقط ملفات PDF مدعومة'));
    }
    cb(null, true);
  }
});

// POST upload medical report
app.post('/medical/upload', upload.single('report'), async (req, res) => {
  const { reportType } = req.body;
  const reportFile = req.file;

  if (!reportFile || !reportType) {
    return res.status(400).json({ message: 'الرجاء تحديد نوع التقرير وإرفاق ملف PDF' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/medical-reports/${reportFile.filename}`;

  const { data, error } = await supabase
    .from('medical_reports')
    .insert([
      {
        type: reportType,
        filename: reportFile.filename,
        url: fileUrl,
        date: new Date()
      }
    ]);

  if (error) {
    console.error(error);
    return res.status(500).json({ message: 'فشل حفظ بيانات التقرير الطبي في قاعدة البيانات.' });
  }

  res.status(201).json({
    message: 'تم رفع التقرير الطبي بنجاح',
    data: data[0]
  });
});

// GET list of medical reports
app.get('/medical/list', async (req, res) => {
  const { data, error } = await supabase
    .from('medical_reports')
    .select('*');

  if (error) {
    console.error(error);
    return res.status(500).json({ message: 'فشل جلب قائمة التقارير من قاعدة البيانات.' });
  }

  res.json({
    message: 'قائمة التقارير الطبية',
    data
  });
});

// download a specific report by filename
app.get('/medical/download/:filename', (req, res) => {
  const filePath = path.join(UPLOAD_DIR, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ message: 'الملف غير موجود' });
  }
});

// test route
app.get('/', (req, res) => {
  res.send('🩺 خادم التقارير الطبية يعمل');
});

// global error handler
app.use((err, req, res, next) => {
  res.status(400).json({ message: err.message || 'حدث خطأ في الخادم' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 خادم التقارير الطبية يعمل على http://localhost:${PORT}`));