// api/add-barcode.js
const { GoogleSpreadsheet } = require('google-spreadsheet');

// Переменные окружения Vercel
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
// Важно: заменяем экранированные символы новой строки на реальные
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

module.exports = async (req, res) => {
    // Проверяем, что это POST запрос
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { barcode } = req.body;

    // Проверяем наличие штрихкода
    if (!barcode) {
        return res.status(400).json({ success: false, message: 'Barcode is required' });
    }

    try {
        const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
        // Аутентификация с использованием сервисного аккаунта
        await doc.useServiceAccountAuth({
            client_email: CLIENT_EMAIL,
            private_key: PRIVATE_KEY,
        });
        await doc.loadInfo(); // Загружаем информацию о документе
        const sheet = doc.sheetsByIndex[0]; // Выбираем первый лист в таблице (индекс 0)

        // Добавляем новую строку. Заголовки столбцов должны соответствовать вашей таблице.
        const newRow = await sheet.addRow({
            'Штрихкод': barcode,
            'Дата и время': new Date().toLocaleString('ru-RU') // Формат даты для России
        });

        // Возвращаем успех и индекс новой строки.
        // rowNumber начинается с 1, а нам нужен 0-based индекс для массива rows в getRows()
        return res.status(200).json({
            success: true,
            message: 'Barcode added successfully',
            rowIndex: newRow.rowNumber - 2 // rowIndex для update'ов.
                                       // Если в таблице есть заголовок,
                                       // newRow.rowNumber будет 2 для первой строки данных,
                                       // поэтому для 0-based индекса массива rows нужно -2
        });

    } catch (error) {
        console.error('Error adding barcode to Google Sheet:', error);
        return res.status(500).json({ success: false, message: 'Failed to add barcode to sheet', error: error.message });
    }
};
