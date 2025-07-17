const express = require('express');
const { google } = require('googleapis');
const path = require('path');
const cors = require('cors'); // Добавляем cors

const app = express();
const PORT = process.env.PORT || 3000; // Можно использовать другой порт, например 8080

// Настройка CORS для разрешения запросов с вашего фронтенда
app.use(cors({
    origin: '*', // В продакшене лучше указать конкретный домен вашего фронтенда: 'https://your-frontend-domain.com'
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json()); // Для парсинга JSON-запросов
// Обслуживание статических файлов из папки 'public' (где будет index.html и app.js)
app.use(express.static(path.join(__dirname, 'public'))); 

// Ваши учетные данные сервисного аккаунта
const credentials = {
  "type": "service_account",
  "project_id": "esp-abg",
  "private_key_id": "c7b2b5a057ccce48aae18493a313e3106ed6276a",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCEFjLnwrhqm8Us\ny4TSpuMyw8lONknIJ3+gtd7IZZAOSSLnzEIHEsWXeyhnd3o36e4+MZN+C42AvJUP\nHOmfK1KMLR4UsHxCDRLEYb6PcBpIXKs4gPBQY6BAJcE0kvNnwjhdNMje1cx7dgGD\nMNHWlt0rV9MRvX/UP8m/9RNTcuBSTln1zPqqJvYfle9N+7C8dRzp9OAuI3qN/GBV\n5ztcUvsGFI2f9xjooluJHCyjT2DwSQY5CbkaHwkbNaIIiAB+V+VYgEvqOunFHqae\n2C9DFZjf5HZ+LyCxBQcIuUFRumRwc+Bre6irTTbq+KrwFSN6/ZGDTDWOV1Do+H6B\nEY66tTzxAgMBAAECggEADVDrmt/PlbfUffqajl4Sw5hnYAIrGAmbXUlYh11t03Le\nGP5HnczvrKDW5u9tm9tykESROQDTKCpa4KYqi0hjzwvxX2aXcFU/EhtEidNkYu0s\nucqN75zLmAv2WWWDMm+rHQJoScbGEaBI8L/oN7kH3QnClqRDEdPIdBix9RS8tq9Y\nYJa4nPRcrS7kIGkJJS1Mp7ZqAOZMghPG1DtpEa6zSmS+y8Z5HuUiaLxC/4ZOGCD+\n+bExnj47ySPStTB5rU00oXad595LOd+WgV33OExclXy7wuQbnVpYp09e+t5fIILm\nWZQIf5FMONUU+dI1dLnhzdDqGIpRW+qQgI34tTWKTQKBgQC4yexi7xOvVdgH6klv\nxc6n9qUQAMxEpgphIftKU9jgTC4UpEhoglsD3UJsj/Vis1gh0zLXLygUTClePVKN\nz3sQJe3PV1b5xUYz+5lRuuuvXFwjaQUNv8y9NlyaESW+Vvf7en4h+NZqmKKB3JD5\J1dA0PZuNcUGi4pIaRc4/lCvuwKBgQC2/QdU57ZqLnYiAGu2jT3iwiOxDSFgIB36\nZdtijr5Wqe9qbtPQAKy7I6scB61QP4iU8LOIjQJsmXABQ9vytgkLpkycoygDDmvn\nRGn3wNPmHCTQK/3ETqPPeQLJzhvp/Qrz6vhA7fytKgczslUJ3AZ21cyeVZJpHu9W\njxEvcnRNQwKBgGK+I77KGi67JHE2VH+Rp9hBB/sBMiYMw8cbrXgOTfmtO4J0Nu0B\nmzj5ZqE0W9+eDh4lCSnLXRNbj094XUDB+fSrD+SXuzZEoDru2wK9a2uNYv7ZA4ZR\nU0pYXitFtnF7b4/F6Nima40SeuQBxMYeq5VLFCPYP6w7rGz9Gxetbdg5AoGAbIiB\nS7uvdyUdjic/u+PkO9W4Q7AtBo2mGjlFuRw/Crn6Nd+MJAfya4DJYXOwOTOlt+lY\nIvq34F/VjfqIv1l23gEB2bnv5ngsSdxLGda2F/rDXvFor4GRKWJ14+oqpkservPD\n0QcW4kJWSTRRuepVrzA6EANjNpRRkr6Ci+jP0G8CgYAUAAF6yO3Ervs5MdR3UhSy\nI9QeF9ttQqV3pjvBv4yVwixiYxyJcUkg5jci4MbjQmkMfHLisZ8Xn8wmMvFmXWH0\nhkQNBIosW78UbidH3qyVzh2tV2cAu9OnPufUCNrK+IyDYQbb+3SudhdbO367ltD/\nQADVz1vtN0XKlvXC7ojP/Q==\n-----END PRIVATE KEY-----\n",
  "client_email": "esp32-abg@esp-abg.iam.gserviceaccount.com",
  "client_id": "117920472150073791466",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/esp32-abg%40esp-abg.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth });

// *** ЗАМЕНИТЕ НА СВОИ ЗНАЧЕНИЯ ***
const SPREADSHEET_ID = '1QxI6b0WqT9Q3o-9i6U_4gP2r9W2W2A2m2B2c2D2e2f2g'; // Замените на ID вашей таблицы Google Sheets
const SHEET_NAME = 'Sheet1'; // Замените на имя листа, например, "Товары"

// Индексы столбцов в вашей таблице Google Sheets (начинаются с 0)
// Пример: A=0, B=1, C=2
const BARCODE_COLUMN_INDEX = 0; // Столбец для штрихкода (например, A)
const QUANTITY_COLUMN_INDEX = 1; // Столбец для количества (например, B)
const PRODUCT_NAME_COLUMN_INDEX = 2; // Столбец для наименования товара (например, C)

// Endpoint для поиска штрихкода
app.post('/scan-barcode', async (req, res) => {
    const { barcode } = req.body;
    if (!barcode) {
        return res.status(400).json({ success: false, message: 'Штрихкод не предоставлен.' });
    }

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            // Читаем данные до последнего столбца, который содержит нужную информацию (например, C)
            range: `${SHEET_NAME}!A:Z`, 
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            return res.json({ success: false, message: 'Данные не найдены в таблице.' });
        }

        let foundRow = null;
        let rowIndexInSheet = -1; // Номер строки в Google Sheets (начинается с 1)

        for (let i = 0; i < rows.length; i++) {
            // Проверяем, существует ли ячейка с штрихкодом
            if (rows[i][BARCODE_COLUMN_INDEX] === barcode) {
                foundRow = rows[i];
                rowIndexInSheet = i + 1; // Номер строки в Google Sheets
                break;
            }
        }

        if (foundRow) {
            // Извлекаем количество и наименование, если они существуют
            const quantity = foundRow[QUANTITY_COLUMN_INDEX] !== undefined ? parseInt(foundRow[QUANTITY_COLUMN_INDEX]) : 0;
            const productName = foundRow[PRODUCT_NAME_COLUMN_INDEX] || 'Не указано';

            res.json({
                success: true,
                message: 'Штрихкод найден!',
                rowData: {
                    barcode: foundRow[BARCODE_COLUMN_INDEX],
                    quantity: isNaN(quantity) ? 0 : quantity, // Убедимся, что это число
                    name: productName,
                },
                rowIndex: rowIndexInSheet // Передаем индекс строки для последующего обновления
            });
        } else {
            res.json({ success: false, message: 'Штрихкод не найден в таблице.' });
        }

    } catch (error) {
        console.error('Ошибка при поиске штрихкода в Google Sheets:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера при поиске.' });
    }
});

// Endpoint для обновления количества
app.post('/update-quantity', async (req, res) => {
    const { barcode, newQuantity } = req.body;
    if (!barcode || newQuantity === undefined || isNaN(newQuantity) || parseInt(newQuantity) < 0) {
        return res.status(400).json({ success: false, message: 'Некорректные данные для обновления (штрихкод или новое количество).' });
    }

    try {
        // Сначала найдем строку по штрихкоду
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A:Z`,
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            return res.json({ success: false, message: 'Данные не найдены в таблице.' });
        }

        let targetRowIndexInSheet = -1; // Номер строки в Google Sheets (начинается с 1)
        for (let i = 0; i < rows.length; i++) {
            if (rows[i][BARCODE_COLUMN_INDEX] === barcode) {
                targetRowIndexInSheet = i + 1; // Индекс строки в Google Sheets
                break;
            }
        }

        if (targetRowIndexInSheet !== -1) {
            // Обновляем значение в ячейке, соответствующей колонке QUANTITY_COLUMN_INDEX
            const columnLetter = String.fromCharCode(65 + QUANTITY_COLUMN_INDEX); // Преобразовать индекс столбца в букву (0->A, 1->B, ...)
            const updateRange = `${SHEET_NAME}!${columnLetter}${targetRowIndexInSheet}`; // Например, "Sheet1!B2"

            const valueInputOption = 'RAW'; // 'RAW' - вставляет значение как есть, 'USER_ENTERED' - применяет форматирование Google Sheets

            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: updateRange,
                valueInputOption: valueInputOption,
                resource: {
                    values: [[newQuantity]], // Обновляем только одно значение
                },
            });

            res.json({ success: true, message: 'Количество успешно обновлено.' });
        } else {
            res.json({ success: false, message: 'Штрихкод не найден для обновления количества.' });
        }

    } catch (error) {
        console.error('Ошибка при обновлении количества в Google Sheets:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера при обновлении количества.' });
    }
});


app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
