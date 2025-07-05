// departmentsServer.js
require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// GET all departments
app.get('/api/departments', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('*');

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'فشل جلب الأقسام من قاعدة البيانات.' });
    }

    res.status(200).json({ departments: data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ في الخادم' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Departments and Services backend running at http://localhost:${PORT}`);
});
