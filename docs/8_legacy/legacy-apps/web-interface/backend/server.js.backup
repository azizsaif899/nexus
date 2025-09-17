const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Google Sheets API setup
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

// Routes
app.get('/api/sheets/:spreadsheetId', async (req, res) => {
  try {
    const { spreadsheetId } = req.params;
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
      includeGridData: false
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sheets/:spreadsheetId/query', async (req, res) => {
  try {
    const { spreadsheetId } = req.params;
    const { query, range } = req.body;
    
    // هنا سيتم دمج نظام البحث الذكي
    const searchResult = await performIntelligentSearch(query, spreadsheetId, range);
    
    res.json(searchResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function performIntelligentSearch(query, spreadsheetId, range) {
  // سيتم تطوير هذه الدالة لاحقاً مع دمج LangGraph
  return { message: "البحث الذكي قيد التطوير", query };
}

app.listen(PORT, () => {
  // Removed console.log
});