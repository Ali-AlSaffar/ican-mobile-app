// backend/attendanceServer.js
require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// GET attendance for any given month (e.g., /api/attendance/2025-03)
app.get('/api/attendance/:month', async (req, res) => {
  const { month } = req.params;

  try {
    // fetch all attendance records for the month
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .gte('date', `${month}-01`)
      .lte('date', `${month}-31`);

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'فشل جلب بيانات الحضور من قاعدة البيانات.' });
    }

    res.status(200).json({
      month,
      days: data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

// POST new attendance record
app.post('/api/attendance', async (req, res) => {
  const { student_id, date, status } = req.body;

  if (!student_id || !date || !status) {
    return res.status(400).json({ message: 'الرجاء إدخال جميع البيانات المطلوبة.' });
  }

  try {
    const { data, error } = await supabase
      .from('attendance')
      .insert([
        {
          student_id,
          date,
          status
        }
      ]);

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'فشل إضافة بيانات الحضور إلى قاعدة البيانات.' });
    }

    res.status(201).json({
      message: 'تم تسجيل الحضور بنجاح',
      data: data[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Attendance backend running at http://localhost:${PORT}`);
});
