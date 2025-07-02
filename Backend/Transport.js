// transport-backend.js
require('dotenv').config();
const express = require('express');

const app = express();

// Parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Handles the form input :contentReference[oaicite:1]{index=1}

// Route to receive the transport form
app.post('/transport', (req, res) => {
  const {
    houseNum, building, compound, street, area,
    periods = [], days = [], agree
  } = req.body;

  // Periods and days may be sent as single strings
  const periodsArr = Array.isArray(periods) ? periods : periods ? [periods] : [];
  const daysArr = Array.isArray(days) ? days : days ? [days] : [];

  // Basic validation
  if (!houseNum || !building || !area || agree !== 'on') {
    return res.status(400).json({
      message: 'الرجاء تعبئة الحقول المطلوبة والموافقة على الشروط'
    });
  }

  res.json({
    message: 'تم إرسال بيانات المواصلات بنجاح!',
    data: {
      address: { houseNum, building, compound, street, area },
      periods: periodsArr,
      days: daysArr
    }
  });
});

// Test route
app.get('/', (_req, res) => {
  res.send('🚗 Backend ready at POST /transport');
});

// Global error handler
app.use((err, _req, res, _next) => {
  res.status(500).json({ message: err.message || 'خطأ في الخادم' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
