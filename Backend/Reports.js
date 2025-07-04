// ican.js
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
      return cb(new Error('only pdf files are supported'));
    }
    cb(null, true);
  }
});

// weekly reports endpoint
app.post('/reports/weekly', upload.single('report'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'only pdf files are supported' });
  }
  const reportUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(201).json({
    message: 'weekly report uploaded successfully',
    file: reportUrl
  });
});

// monthly reports endpoint
app.post('/reports/monthly', upload.single('report'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'only pdf files are supported' });
  }
  const reportUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(201).json({
    message: 'monthly report uploaded successfully',
    file: reportUrl
  });
});

// simple test route
app.get('/', (req, res) => {
  res.send('📄 ICAN report server is running');
});

// global error handler
app.use((err, req, res, next) => {
  res.status(400).json({ message: err.message || 'server error occurred' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 ICAN server running at http://localhost:${PORT}`));