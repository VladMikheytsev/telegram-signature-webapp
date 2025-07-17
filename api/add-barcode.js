// api/add-barcode.js - ТЕСТОВАЯ ВЕРСИЯ ДЛЯ ОТЛАДКИ (без проверки метода)

module.exports = async (req, res) => {
    // Разрешаем CORS для всех запросов в самом начале
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Добавим GET на всякий случай
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Эти логи должны появиться в Vercel Runtime Logs, если функция запускается
    console.log('--- add-barcode.js: Function invoked! ---');
    console.log('Request method:', req.method);
    console.log('Request body:', req.body);
    console.log('Headers:', req.headers); // Добавим логирование заголовков

    // Предварительная обработка OPTIONS-запросов (CORS preflight)
    if (req.method === 'OPTIONS') {
        console.log('--- add-barcode.js: OPTIONS request handled ---');
        return res.status(200).send(); // Отправляем пустой ответ для OPTIONS
    }

    // ВНИМАНИЕ: В этой тестовой версии мы УБРАЛИ проверку req.method !== 'POST'
    // Это сделано для отладки, чтобы убедиться, что функция вообще работает.

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
