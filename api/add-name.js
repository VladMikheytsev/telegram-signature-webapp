// api/add-name.js
const { GoogleSpreadsheet } = require('google-spreadsheet');

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { rowIndex, productName } = req.body;

    if (rowIndex === undefined || !productName) {
        return res.status(400).json({ success: false, message: 'rowIndex and productName are required' });
    }

    try {
        const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
        await doc.useServiceAccountAuth({
            client_email: CLIENT_EMAIL,
            private_key: PRIVATE_KEY,
        });
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];

        // Загружаем все строки для обновления конкретной строки
        await sheet.loadCells(); // Загружаем все ячейки
        const cell = sheet.getCell(rowIndex, 1); // Предполагаем, что наименование находится в столбце B (индекс 1)
        cell.value = productName;
        await sheet.saveCells([cell]); // Сохраняем измененную ячейку

        return res.status(200).json({ success: true, message: 'Product name updated successfully' });

    } catch (error) {
        console.error('Error updating product name in Google Sheet:', error);
        return res.status(500).json({ success: false, message: 'Failed to update product name in sheet', error: error.message });
    }
};
