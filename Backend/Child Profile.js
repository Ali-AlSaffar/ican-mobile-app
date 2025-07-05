// backend/childProfileServer.js
require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// GET child profile by ID number
app.get('/api/child/:idNumber', async (req, res) => {
  const { idNumber } = req.params;

  try {
    const { data, error } = await supabase
      .from('child_profiles')
      .select('*')
      .eq('id_number', idNumber)
      .single();

    if (error && error.code !== 'PGRST116') { // ignore no rows found
      console.error(error);
      return res.status(500).json({ message: 'فشل جلب بيانات الطفل من قاعدة البيانات.' });
    }

    if (!data) {
      return res.status(404).json({ message: 'لم يتم العثور على بيانات الطفل' });
    }

    res.status(200).json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

// POST route: add or update child profile
app.post('/api/child', async (req, res) => {
  const { fullName, idNumber } = req.body;

  if (!fullName || !idNumber) {
    return res.status(400).json({ error: 'يرجى تعبئة جميع الحقول' });
  }

  try {
    // check if child already exists
    const { data: existingChild, error: fetchError } = await supabase
      .from('child_profiles')
      .select('*')
      .eq('id_number', idNumber)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error(fetchError);
      return res.status(500).json({ message: 'فشل التحقق من البيانات في قاعدة البيانات.' });
    }

    if (existingChild) {
      // update
      const { data, error } = await supabase
        .from('child_profiles')
        .update({ full_name: fullName })
        .eq('id_number', idNumber)
        .select()
        .single();

      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'فشل تحديث بيانات الطفل.' });
      }

      res.status(200).json({
        message: 'تم تحديث بيانات الطفل بنجاح',
        data
      });
    } else {
      // insert new
      const { data, error } = await supabase
        .from('child_profiles')
        .insert([
          {
            full_name: fullName,
            id_number: idNumber
          }
        ])
        .select()
        .single();

      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'فشل إضافة بيانات الطفل.' });
      }

      res.status(201).json({
        message: 'تمت إضافة بيانات الطفل بنجاح',
        data
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Child profile backend running at http://localhost:${PORT}`);
});
