// backend/profileServer.js
require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// GET profile by guardian idNumber
app.get('/api/profile/:guardianIdNumber', async (req, res) => {
  const { guardianIdNumber } = req.params;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('guardian_id_number', guardianIdNumber)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error(error);
      return res.status(500).json({ message: 'فشل جلب بيانات الملف الشخصي من قاعدة البيانات.' });
    }

    if (!data) {
      return res.status(404).json({ message: 'لم يتم العثور على بيانات الملف الشخصي' });
    }

    res.status(200).json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

// POST profile (create or update)
app.post('/api/profile', async (req, res) => {
  const {
    guardian_name,
    guardian_id_number,
    guardian_email,
    guardian_phone,
    child_name,
    child_id_number,
    language,
    notifications
  } = req.body;

  if (!guardian_id_number) {
    return res.status(400).json({ message: 'يرجى إدخال رقم هوية ولي الأمر.' });
  }

  try {
    // check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('guardian_id_number', guardian_id_number)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error(fetchError);
      return res.status(500).json({ message: 'فشل التحقق من البيانات.' });
    }

    if (existingProfile) {
      // update
      const { data, error } = await supabase
        .from('profiles')
        .update({
          guardian_name,
          guardian_email,
          guardian_phone,
          child_name,
          child_id_number,
          language,
          notifications
        })
        .eq('guardian_id_number', guardian_id_number)
        .select()
        .single();

      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'فشل تحديث بيانات الملف الشخصي.' });
      }

      res.status(200).json({
        message: 'تم تحديث بيانات الملف الشخصي بنجاح',
        data
      });
    } else {
      // insert
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            guardian_name,
            guardian_id_number,
            guardian_email,
            guardian_phone,
            child_name,
            child_id_number,
            language,
            notifications
          }
        ])
        .select()
        .single();

      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'فشل إضافة بيانات الملف الشخصي.' });
      }

      res.status(201).json({
        message: 'تم إضافة بيانات الملف الشخصي بنجاح',
        data
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

// POST logout
app.post('/api/logout', (req, res) => {
  res.status(200).json({ message: 'تم تسجيل الخروج بنجاح' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Profile backend running at http://localhost:${PORT}`);
});
