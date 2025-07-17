// api/add-name.js (МОДИФИЦИРОВАННАЯ ВЕРСИЯ)
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

        // Получаем все строки. Библиотека кэширует их.
        const rows = await sheet.getRows(); 
        
        // rowIndex здесь - это 0-based индекс, который мы вернули из add-barcode
        // и который соответствует массиву rows.
        const rowToUpdate = rows[rowIndex]; 

        if (!rowToUpdate) {
            return res.status(404).json({ success: false, message: 'Row not found for update' });
        }

        rowToUpdate['Наименование товара'] = productName; // Используем заголовок столбца
        await rowToUpdate.save(); // Сохраняем изменения в этой строке

        return res.status(200).json({ success: true, message: 'Product name updated successfully' });

    } catch (error) {
        console.error('Error updating product name in Google Sheet:', error);
        return res.status(500).json({ success: false, message: 'Failed to update product name in sheet', error: error.message });
    }
};
