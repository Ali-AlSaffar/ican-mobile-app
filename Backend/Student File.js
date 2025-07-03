// backend/server.js

const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Route: أوراق التسجيل (Registration Papers)
app.get('/api/registration-papers', (req, res) => {
  res.status(200).json({ message: 'تم الوصول إلى أوراق التسجيل' });
});

// Route: التقييم (Evaluation)
app.get('/api/evaluation', (req, res) => {
  res.status(200).json({ message: 'تم الوصول إلى صفحة التقييم' });
});

// Route: التقارير (Reports)
app.get('/api/reports', (req, res) => {
  res.status(200).json({ message: 'تم الوصول إلى صفحة التقارير' });
});

// Route: تقارير طبية (Medical Reports)
app.get('/api/medical-reports', (req, res) => {
  res.status(200).json({ message: 'تم الوصول إلى صفحة التقارير الطبية' });
});

// Route: إقرار وتعهد (Acknowledgment & Commitment)
app.get('/api/commitments', (req, res) => {
  res.status(200).json({ message: 'تم الوصول إلى صفحة الإقرارات والتعهدات' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Student File backend is running at http://localhost:${PORT}`);
});
