// api/add-warehouse.js
const { GoogleSpreadsheet } = require('google-spreadsheet');

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

module.exports = async (req, res) => {
    // Разрешаем CORS для всех запросов
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).send();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { rowIndex, warehouse } = req.body;

    if (rowIndex === undefined || !warehouse) {
        return res.status(400).json({ success: false, message: 'rowIndex and warehouse are required' });
    }

    try {
        const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
        await doc.useServiceAccountAuth({
            client_email: CLIENT_EMAIL,
            private_key: PRIVATE_KEY,
        });
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];

        const rows = await sheet.getRows();
        const rowToUpdate = rows[rowIndex];

        if (!rowToUpdate) {
            return res.status(404).json({ success: false, message: 'Row not found for update' });
        }

        rowToUpdate['Склад'] = warehouse; // Заголовок столбца
        await rowToUpdate.save();

        return res.status(200).json({ success: true, message: 'Warehouse updated successfully' });

    } catch (error) {
        console.error('Error updating warehouse in Google Sheet:', error);
        return res.status(500).json({ success: false, message: 'Failed to update warehouse in sheet', error: error.message });
    }
};
