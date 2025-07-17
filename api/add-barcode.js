// api/add-barcode.js
const { GoogleSpreadsheet } = require('google-spreadsheet');

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
// IMPORTANT: Replace '\\n' with '\n' for the private key
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { barcode } = req.body;

    if (!barcode) {
        return res.status(400).json({ success: false, message: 'Barcode is required' });
    }

    try {
        const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
        await doc.useServiceAccountAuth({
            client_email: CLIENT_EMAIL,
            private_key: PRIVATE_KEY,
        });
        await doc.loadInfo(); 
        const sheet = doc.sheetsByIndex[0]; // Первый лист (индекс 0)

        // Добавляем новую строку
        const newRow = await sheet.addRow({
            'Штрихкод': barcode,
            'Дата и время': new Date().toLocaleString('ru-RU') // Формат даты для России
        });

        // Возвращаем индекс новой строки (для последующего обновления)
        return res.status(200).json({
            success: true,
            message: 'Barcode added successfully',
            rowIndex: newRow.rowNumber - 1 // rowNumber начинается с 1, нам нужен 0-based индекс
        });

    } catch (error) {
        console.error('Error adding barcode to Google Sheet:', error);
        return res.status(500).json({ success: false, message: 'Failed to add barcode to sheet', error: error.message });
    }
};
