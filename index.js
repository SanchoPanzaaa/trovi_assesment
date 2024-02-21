const express = require('express');
const mysql = require('mysql2/promise');
const { queryData } = require('./attendance');

const app = express();

require('dotenv').config();

export const db = await initializeDatabase();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/export-attendance', async (req, res) => {
    try {
        const { username, startDate, endDate } = req.query;

        const processedRecords = this.handleRequest(req);

        if (!username || !startDate || !endDate) {
          return res.status(400).json({ error: 'Missing username or date range parameters' });
        }

        const fileName = await generateExcelReport(processedRecords);
    
        // Headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    
        res.sendFile(fileName, { root: '.' }, (err) => {
            if (err) {
            console.error('Error sending file:', err);
            res.status(500).json({ error: 'Internal server error while sending the file' });
            } else {
            console.log('File sent:', fileName);
            }
        });
        } catch (error) {
        console.error('Error exporting attendance:', error.message);
        res.status(500).json({ error: 'Internal server error' });
        }
  });
  

/* Common methods */
async function initializeDatabase() {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    return connection;
}