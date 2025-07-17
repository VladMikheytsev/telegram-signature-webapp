// api/add-barcode.js - ТЕСТОВАЯ ВЕРСИЯ ДЛЯ ОТЛАДКИ
// НЕ ТРЕБУЕТ GOOGLE_SPREADSHEET_ID, CLIENT_EMAIL, PRIVATE_KEY
// и НЕ ТРЕБУЕТ google-spreadsheet в package.json (хотя он там уже есть)

module.exports = async (req, res) => {
    // Эти логи должны появиться в Vercel Runtime Logs, если функция запускается
    console.log('--- add-barcode.js: Function invoked! ---');
    console.log('Request method:', req.method);
    console.log('Request body:', req.body);

    // Разрешаем CORS для всех запросов (для продакшена лучше указать конкретный домен)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Предварительная обработка OPTIONS-запросов (CORS preflight)
    if (req.method === 'OPTIONS') {
        console.log('--- add-barcode.js: OPTIONS request handled ---');
        return res.status(200).send();
    }

    // Проверяем, что это POST запрос
    if (req.method !== 'POST') {
        console.log('--- add-barcode.js: Method Not Allowed ---');
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { barcode } = req.body;
    console.log('Received barcode:', barcode);

    if (!barcode) {
        console.log('--- add-barcode.js: Barcode missing ---');
        return res.status(400).json({ success: false, message: 'Barcode is required' });
    }

    // Вместо реальной логики Google Sheets, просто возвращаем успех
    console.log('--- add-barcode.js: Returning success for barcode ---');
    return res.status(200).json({
        success: true,
        message: 'Barcode received successfully (TEST MODE)',
        rowIndex: 0 // Возвращаем 0 для продолжения работы фронтенда
    });
};
