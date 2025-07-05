// backend/transport-backend.js
require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST transport form
app.post('/transport', async (req, res) => {
  const {
    houseNum, building, compound, street, area,
    periods = [], days = [], agree
  } = req.body;

  const periodsArr = Array.isArray(periods) ? periods : periods ? [periods] : [];
  const daysArr = Array.isArray(days) ? days : days ? [days] : [];

  if (!houseNum || !building || !area || agree !== 'on') {
    return res.status(400).json({
      message: 'الرجاء تعبئة الحقول المطلوبة والموافقة على الشروط'
    });
  }

  try {
    const { data, error } = await supabase
      .from('transport_requests')
      .insert([
        {
          house_num: houseNum,
          building,
          compound,
          street,
          area,
          periods: periodsArr,
          days: daysArr,
          agreed: true
        }
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'فشل حفظ بيانات المواصلات في قاعدة البيانات.' });
    }

    res.json({
      message: 'تم إرسال بيانات المواصلات بنجاح!',
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

// Test route
app.get('/', (_req, res) => {
  res.send('🚗 Backend ready at POST /transport');
});

// Global error handler
app.use((err, _req, res, _next) => {
  res.status(500).json({ message: err.message || 'خطأ في الخادم' });
});

// start
app.listen(PORT, () =>
  console.log(`✅ Transport server running on http://localhost:${PORT}`)
);
