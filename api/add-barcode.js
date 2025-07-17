// api/add-barcode.js
const { GoogleSpreadsheet } = require('google-spreadsheet');

// Переменные окружения Vercel
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
// Важно: заменяем экранированные символы новой строки на реальные
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

module.exports = async (req, res) => {
    // Разрешаем CORS для всех запросов (для продакшена лучше указать конкретный домен)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Предварительная обработка OPTIONS-запросов (CORS preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).send();
    }

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

        // Проверяем, существует ли штрихкод уже
        // Чтобы избежать чтения всей таблицы, можно использовать другую логику или рассмотреть кэширование,
        // но для начала это сработает.
        const rows = await sheet.getRows();
        const existingBarcodeRow = rows.find(row => row['Штрихкод'] === barcode);

        if (existingBarcodeRow) {
            return res.status(409).json({ success: false, message: 'Этот штрихкод уже существует в таблице.' });
        }


        // Добавляем новую строку. Заголовки столбцов должны соответствовать вашей таблице.
        const newRow = await sheet.addRow({
            'Штрихкод': barcode,
            'Дата и время': new Date().toLocaleString('ru-RU') // Формат даты для России
        });

        // Возвращаем успех и индекс новой строки.
        // newRow.rowNumber - это номер строки в таблице (начиная с 1).
        // Если в таблице есть заголовок (обычно это первая строка),
        // то для получения 0-based индекса массива, который возвращает sheet.getRows(),
        // нужно вычесть 2: (newRow.rowNumber - 1) для преобразования в 0-based,
        // и еще -1 если первая строка - заголовок, который не считается как данные.
        // Если у вас нет заголовков, используйте newRow.rowNumber - 1.
        // В нашем случае, если первая строка - заголовки, а данные начинаются со второй строки (newRow.rowNumber = 2),
        // то для получения индекса 0 в массиве rows нам нужно (2 - 2) = 0.
        // Если вы не уверены, попробуйте -1 или -2 и проверьте.
        // Мы будем использовать -2, предполагая, что первая строка - заголовки.
        return res.status(200).json({
            success: true,
            message: 'Barcode added successfully',
            rowIndex: newRow.rowNumber - 2 
        });

    } catch (error) {
        console.error('Error adding barcode to Google Sheet:', error);
        return res.status(500).json({ success: false, message: 'Failed to add barcode to sheet', error: error.message });
    }
};
