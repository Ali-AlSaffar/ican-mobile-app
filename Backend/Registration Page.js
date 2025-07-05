// backend/registrationPapersServer.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

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

// Multer file filter: PDF only
const fileFilter = (req, file, cb) => {
  const fileExt = path.extname(file.originalname).toLowerCase();
  if (fileExt === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'));
  }
};

const upload = multer({ storage, fileFilter });

// Route: Upload registration paper (PDF only)
app.post('/api/registration-papers/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'يرجى رفع ملف بصيغة PDF فقط' });
  }

  res.status(200).json({
    message: 'تم رفع الملف بنجاح',
    fileName: req.file.filename
  });
});

// Route: List uploaded registration papers
app.get('/api/registration-papers', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'خطأ في قراءة الملفات' });
    res.status(200).json({ files });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Registration Papers backend running at http://localhost:${PORT}`);
});
