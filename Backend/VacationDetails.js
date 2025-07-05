// backend/server.js

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Sample leave types (for validation)
const validLeaveTypes = ['سنوية', 'مرضية', 'طارئة', 'بدون راتب'];

// POST route to handle leave request submission
app.post('/api/leave-request', (req, res) => {
  const { leaveType, reason, fromDate, toDate } = req.body;

  // Validate fields
  if (!leaveType || !validLeaveTypes.includes(leaveType)) {
    return res.status(400).json({ error: 'نوع الإجازة غير صالح' });
  }

  if (!reason || reason.trim().length < 5) {
    return res.status(400).json({ error: 'الرجاء كتابة سبب الإجازة بشكل مفصل' });
  }

  if (!fromDate || !toDate) {
    return res.status(400).json({ error: 'يرجى تحديد التاريخين' });
  }

  if (new Date(fromDate) > new Date(toDate)) {
    return res.status(400).json({ error: 'تاريخ البداية يجب أن يكون قبل تاريخ النهاية' });
  }

  // Simulate saving the request (e.g., to a database)
  const leaveRequest = {
    id: Date.now(),
    leaveType,
    reason,
    fromDate,
    toDate,
    status: 'Pending'
  };

  console.log('Leave request submitted:', leaveRequest);

  res.status(200).json({ message: 'تم تقديم الطلب بنجاح', data: leaveRequest });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
