// backend/attendanceServer.js

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// GET attendance & absence for any given month (e.g., /api/attendance/2025-03)
app.get('/api/attendance/:month', (req, res) => {
  const { month } = req.params;

  // Example mock data: random attendance states
  const attendanceData = {
    month,
    days: [
      { date: `${month}-01`, status: 'حضور' },
      { date: `${month}-02`, status: 'غياب' },
      { date: `${month}-03`, status: 'تأخير' },
      { date: `${month}-04`, status: 'حضور' },
      { date: `${month}-05`, status: 'حضور' }
    ]
  };

  res.status(200).json(attendanceData);
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Attendance backend running at http://localhost:${PORT}`);
});
