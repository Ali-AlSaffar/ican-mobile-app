// backend/guardianProfileServer.js
require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// GET guardian profile by idNumber
app.get('/api/guardian/:idNumber', async (req, res) => {
  const { idNumber } = req.params;

  try {
    const { data, error } = await supabase
      .from('guardian_profiles')
      .select('*')
      .eq('id_number', idNumber)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error(error);
      return res.status(500).json({ message: 'فشل جلب بيانات ولي الأمر من قاعدة البيانات.' });
    }

    if (!data) {
      return res.status(404).json({ message: 'لم يتم العثور على بيانات ولي الأمر' });
    }

    res.status(200).json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

// POST route: add or update guardian profile
app.post('/api/guardian', async (req, res) => {
  const { fullName, idNumber, email, phone, address, emergencyContact } = req.body;

  if (!fullName || !idNumber) {
    return res.status(400).json({ error: 'يرجى تعبئة الاسم الكامل ورقم الهوية' });
  }

  try {
    // check if guardian exists
    const { data: existingGuardian, error: fetchError } = await supabase
      .from('guardian_profiles')
      .select('*')
      .eq('id_number', idNumber)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error(fetchError);
      return res.status(500).json({ message: 'فشل التحقق من البيانات في قاعدة البيانات.' });
    }

    if (existingGuardian) {
      // update
      const { data, error } = await supabase
        .from('guardian_profiles')
        .update({
          full_name: fullName,
          email: email || '',
          phone: phone || '',
          address: address || '',
          emergency_contact: emergencyContact || ''
        })
        .eq('id_number', idNumber)
        .select()
        .single();

      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'فشل تحديث بيانات ولي الأمر.' });
      }

      res.status(200).json({
        message: 'تم تحديث بيانات ولي الأمر بنجاح',
        data
      });
    } else {
      // insert new
      const { data, error } = await supabase
        .from('guardian_profiles')
        .insert([
          {
            full_name: fullName,
            id_number: idNumber,
            email: email || '',
            phone: phone || '',
            address: address || '',
            emergency_contact: emergencyContact || ''
          }
        ])
        .select()
        .single();

      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'فشل إضافة بيانات ولي الأمر.' });
      }

      res.status(201).json({
        message: 'تمت إضافة بيانات ولي الأمر بنجاح',
        data
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Guardian profile backend running at http://localhost:${PORT}`);
});
