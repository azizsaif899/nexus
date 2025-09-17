const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/sheets/:spreadsheetId/query', async (req, res) => {
  const { query } = req.body;
  
  // محاكاة البحث الذكي
  const mockResult = {
    query,
    message: `تم تحليل الاستفسار: "${query}". النظام قيد التطوير وسيتم دمج البحث الذكي قريباً.`,
    analysis: {
      type: 'mock_analysis',
      suggestions: ['تحسين البيانات', 'إضافة مرشحات', 'تحليل الاتجاهات']
    }
  };
  
  res.json(mockResult);
});

app.listen(PORT, () => {
  // Removed console.log
});