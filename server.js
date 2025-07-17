const express = require('express');
const { google } = require('googleapis');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка CORS для разрешения запросов с вашего фронтенда
app.use(cors({
    origin: '*', // В продакшене лучше указать конкретный домен вашего фронтенда: 'https://your-frontend-domain.com'
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ваши жестко закодированные учетные данные сервисного аккаунта
// ВНИМАНИЕ: Для продакшн-окружений крайне рекомендуется использовать переменные окружения
const credentials = {
  "type": "service_account",
  "project_id": "esp-abg",
  "private_key_id": "c7b2b5a057ccce48aae18493a313e3106ed6276a",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCEFjLnwrhqm8Us\ny4TSpuMyw8lONknIJ3+gtd7IZZAOSSLnzEIHEsWXeyhnd3o36e4+MZN+C42AvJUP\nHOmfK1KMLR4UsHxCDRLEYb6PcBpIXKs4gPBQY6BAJcE0kvNnwjhdNMje1cx7dgGD\nMNHWlt0rV9MRvX/UP8m/9RNTcuBSTln1zPqqJvYfle9N+7C8dRzp9OAuI3qN/GBV\n5ztcUvsGFI2f9xjooluJHCyjT2DwSQY5CbkaHwkbNaIIiAB+V+VYgEvqOunFHqae\n2C9DFZjf5HZ+LyCxBQcIuUFRumRwc+Bre6irTTbq+KrwFSN6/ZGDTDWOV1Do+H6B\nEY66tTzxAgMBAAECggEADVDrmt/PlbfUffqajl4Sw5hnYAIrGAmbXUlYh11t03Le\nGP5HnczvrKDW5u9tm9tykESROQDTKCpa4KYqi0hjzwvxX2aXcFU/EhtEidNkYu0s\nucqN75zLmAv2WWWDMm+rHQJoScbGEaBI8L/oN7kH3QnClqRDEdPIdBix9RS8tq9Y\nYJa4nPRcrS7kIGkJJS1Mp7ZqAOZMghPG1DtpEa6zSmS+y8Z5HuUiaLxC/4ZOGCD+\n+bExnj47ySPStTB5rU0oXad595LOd+WgV33OExclXy7wuQbnVpYp09e+t5fIILm\nWZQIf5FMONUU+dI1dLnhzdDqGIpRW+qQgI34tTWKTQKBgQC4yexi7xOvVdgH6klv\nxc6n9qUQAMxEpgphIftKU9jgTC4UpEhoglsD3UJsj/Vis1gh0zLXLygUTClePVKN\nz3sQJe3PV1b5xUYz+5lRuuuvXFwjaQUNv8y9NlyaESW+Vvf7en4h+NZqmKKB3JD5\J1dA0PZuNcUGi4pIaRc4/lCvuwKBgQC2/QdU57ZqLnYiAGu2jT3iwiOxDSFgIB36\nZdtijr5Wqe9qbtPQAKy7I6scB61QP4iU8LOIjQJsmXABQ9vytgkLpkycoygDDmvn\nRGn3wNPmHCTQK/3ETqPPeQLJzhvp/Qrz6vhA7fytKgczslUJ3AZ21cyeVZJpHu9W\njxEvcnRNQwKBgGK+I77KGi67JHE2VH+Rp9hBB/sBMiYMw8cbrXgOTfmtO4J0Nu0B\nmzj5ZqE0W9+eDh4lCSnLXRNbj094XUDB+fSrD+SXuzZEoDru2wK9a2uNYv7ZA4ZR\nU0pYXitFtnF7b4/F6Nima40SeuQBxMYeq5VLFCPYP6w7rGz9Gxetbdg5AoGAbIiB\nS7uvdyUdjic/u+PkO9W4Q7AtBo2mGjlFuRw/Crn6Nd+MJAfya4DJYXOwOTOlt+lY\nIvq34F/VjfqIv1l23gEB2bnv5ngsSdxLGda2F/rDXvFor4GRKWJ14+oqpkservPD\n0QcW4kJWSTRRuepVrzA6EANjNpRRkr6Ci+jP0G8CgYAUAAF6yO3Ervs5MdR3UhSy\nI9QeF9ttQqV3pjvBv4yVwixiYxyJcUkg5jci4MbjQmkMfHLisZ8Xn8wmMvFmXWH0\nhkQNBIosW78UbidH3qyVzh2tV2cAu9OnPufUCNrK+IyDYQbb+3SudhdbO367ltD/\nQADVz1vtN0XKlvXC7ojP/Q==\n-----END PRIVATE KEY-----\n",
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

// Ваши значения для Google Sheets
const SPREADSHEET_ID = '1adYfca02RkKobevGPRApYBHmq3ScqY37nJ0LccrCx5g'; 
const SHEET_NAME = 'Склад1'; 

// Индексы столбцов в вашей таблице Google Sheets (начинаются с 0)
// Штрихкод в A, Наименование в B, Количество в C, Склад в D
const BARCODE_COLUMN_INDEX = 0; // Столбец A
const NAME_COLUMN_INDEX = 1;    // Столбец B
const QUANTITY_COLUMN_INDEX = 2; // Столбец C
const WAREHOUSE_COLUMN_INDEX = 3; // Столбец D


// Endpoint для добавления штрихкода (и получения первой пустой строки)
app.post('/add-barcode', async (req, res) => {
    const { barcode } = req.body;
    if (!barcode) {
        return res.status(400).json({ success: false, message: 'Штрихкод не предоставлен.' });
    }

    try {
        // Сначала проверяем, есть ли такой штрихкод уже в таблице
        const existingDataResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A:A`, // Читаем только столбец штрихкодов
        });
        const existingBarcodes = existingDataResponse.data.values ? existingDataResponse.data.values.flat() : [];

        // Проверяем, существует ли штрихкод уже
        if (existingBarcodes.includes(barcode)) {
            return res.json({ success: false, message: 'Этот штрихкод уже существует в таблице. Пожалуйста, отсканируйте другой.' });
        }


        // Находим первую пустую строку в столбце A
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A:A`, // Читаем только столбец A
        });

        const rows = response.data.values;
        let nextRowIndex = 1; // Предполагаем, что данные начинаются с первой строки

        if (rows && rows.length > 0) {
            // Находим первую пустую ячейку, или следующую за последней заполненной
            nextRowIndex = rows.length + 1;
            // Можно также пройтись по строкам, чтобы найти первую полностью пустую строку,
            // но для простоты добавим в конец, если столбец A не пуст.
            // Если вы хотите найти _первую пустую строку_ (независимо от того, заполнены ли другие столбцы в этой строке),
            // то логика будет сложнее и потребует чтения всей таблицы.
            // Для этой задачи просто добавляем в конец, если штрихкод уникален.
        }

        // Записываем штрихкод в найденную строку
        const columnLetter = String.fromCharCode(65 + BARCODE_COLUMN_INDEX);
        const updateRange = `${SHEET_NAME}!${columnLetter}${nextRowIndex}`;

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: updateRange,
            valueInputOption: 'RAW',
            resource: {
                values: [[barcode]],
            },
        });

        res.json({ success: true, message: 'Штрихкод успешно записан!', rowIndex: nextRowIndex });

    } catch (error) {
        console.error('Ошибка при добавлении штрихкода в Google Sheets:', error.message, error.stack);
        res.status(500).json({ success: false, message: 'Ошибка сервера при добавлении штрихкода.' });
    }
});

// Endpoint для добавления наименования
app.post('/add-name', async (req, res) => {
    const { rowIndex, productName } = req.body;
    if (!rowIndex || !productName) {
        return res.status(400).json({ success: false, message: 'Некорректные данные для наименования.' });
    }

    try {
        const columnLetter = String.fromCharCode(65 + NAME_COLUMN_INDEX);
        const updateRange = `${SHEET_NAME}!${columnLetter}${rowIndex}`;

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: updateRange,
            valueInputOption: 'RAW',
            resource: {
                values: [[productName]],
            },
        });

        res.json({ success: true, message: 'Наименование успешно добавлено.' });
    } catch (error) {
        console.error('Ошибка при добавлении наименования в Google Sheets:', error.message, error.stack);
        res.status(500).json({ success: false, message: 'Ошибка сервера при добавлении наименования.' });
    }
});

// Endpoint для добавления количества
app.post('/add-quantity', async (req, res) => {
    const { rowIndex, quantity } = req.body;
    if (!rowIndex || quantity === undefined || isNaN(quantity) || parseInt(quantity) < 0) {
        return res.status(400).json({ success: false, message: 'Некорректные данные для количества.' });
    }

    try {
        const columnLetter = String.fromCharCode(65 + QUANTITY_COLUMN_INDEX);
        const updateRange = `${SHEET_NAME}!${columnLetter}${rowIndex}`;

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: updateRange,
            valueInputOption: 'RAW',
            resource: {
                values: [[quantity]],
            },
        });

        res.json({ success: true, message: 'Количество успешно добавлено.' });
    } catch (error) {
        console.error('Ошибка при добавлении количества в Google Sheets:', error.message, error.stack);
        res.status(500).json({ success: false, message: 'Ошибка сервера при добавлении количества.' });
    }
});

// Endpoint для добавления склада
app.post('/add-warehouse', async (req, res) => {
    const { rowIndex, warehouse } = req.body;
    if (!rowIndex || !warehouse) {
        return res.status(400).json({ success: false, message: 'Некорректные данные для склада.' });
    }

    try {
        const columnLetter = String.fromCharCode(65 + WAREHOUSE_COLUMN_INDEX);
        const updateRange = `${SHEET_NAME}!${columnLetter}${rowIndex}`;

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: updateRange,
            valueInputOption: 'RAW',
            resource: {
                values: [[warehouse]],
            },
        });

        res.json({ success: true, message: 'Склад успешно добавлен.' });
    } catch (error) {
        console.error('Ошибка при добавлении склада в Google Sheets:', error.message, error.stack);
        res.status(500).json({ success: false, message: 'Ошибка сервера при добавлении склада.' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
