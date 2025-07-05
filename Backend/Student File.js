// backend/studentFileServer.js
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// uploads folder
const uploadDir = path.join(__dirname, 'uploads/student-files');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== '.pdf') {
      return cb(new Error('فقط ملفات PDF مسموحة'));
    }
    cb(null, true);
  }
});

// upload student file
app.post('/api/student-files/upload', upload.single('file'), async (req, res) => {
  const { student_id, file_type } = req.body;

  if (!req.file || !student_id || !file_type) {
    return res.status(400).json({ message: 'الرجاء إدخال جميع البيانات المطلوبة وتحميل ملف PDF.' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  try {
    const { data, error } = await supabase
      .from('student_files')
      .insert([
        {
          student_id: parseInt(student_id),
          file_type,
          filename: req.file.filename,
          url: fileUrl
        }
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'فشل حفظ الملف في قاعدة البيانات.' });
    }

    res.status(201).json({
      message: 'تم رفع الملف بنجاح',
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

// list student files
app.get('/api/student-files/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    const { data, error } = await supabase
      .from('student_files')
      .select('*')
      .eq('student_id', parseInt(studentId));

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'فشل جلب الملفات من قاعدة البيانات.' });
    }

    res.status(200).json({
      message: 'قائمة الملفات',
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

// test route
app.get('/', (req, res) => {
  res.send('📁 خادم ملفات الطالب يعمل');
});

// global error handler
app.use((err, req, res, next) => {
  res.status(400).json({ message: err.message || 'حدث خطأ في الخادم' });
});

// start
app.listen(PORT, () => {
  console.log(`✅ Student File backend running at http://localhost:${PORT}`);
});
