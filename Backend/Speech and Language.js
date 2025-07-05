// speechLanguageServer.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads/speech-language');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup for PDFs only
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf') cb(null, true);
  else cb(new Error('يرجى رفع ملفات PDF فقط'));
};

const upload = multer({ storage, fileFilter });

// Route: Get predefined speech therapy activities
app.get('/api/speech-language/activities', (req, res) => {
  const activities = [
    {
      title: 'تمارين نطق حرف الراء',
      date: '2025-06-10',
      description: 'جلسة تدريبية لتحسين نطق حرف الراء باستخدام أدوات ملموسة.'
    },
    {
      title: 'لعبة نطق الكلمات المصورة',
      date: '2025-06-14',
      description: 'نشاط تفاعلي باستخدام بطاقات صور لمساعدة الأطفال على نطق الكلمات.'
    }
  ];
  res.status(200).json({ category: 'نطق و اللغة', activities });
});

// Route: Upload PDF file related to speech therapy
app.post('/api/speech-language/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'يرجى رفع ملف بصيغة PDF فقط' });

  res.status(200).json({
    message: 'تم رفع الملف بنجاح',
    fileName: req.file.filename
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Speech & Language server running at http://localhost:${PORT}`);
});
