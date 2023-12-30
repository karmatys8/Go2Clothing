const express = require('express');
const router = express.Router();
const app = express();
const indexRouter = require('./indexRouter');
const sql = require("mssql");
const dbConfig = require("./db");

app.use('/', indexRouter);

router.get('/', (req, res) => {
  res.send("Strona Główna");
});

router.get('/products', async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query('SELECT * FROM Products');
    await sql.close();

    const formattedData = result.recordset.map(item => `
      <div>
        <h3>Nazwa produktu: ${item.ProductName}</h3>
        <p>Cena: ${item.UnitPrice}</p>
        <p>Rozmiar: ${item.Size}</p>
      </div>
    `);

    res.status(200).send(formattedData.join(''));

  } catch (err) {
    console.error('Błąd pobierania danych:', err);
    res.status(500).send(err.message);
  }
});

module.exports = router;