const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require("./db");

router.get('/', (req, res) => {
    res.send("Strona Główna dla admina");
});

router.get('/customers', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query('SELECT * FROM Users as u inner join Customers as c on c.CustomerID=u.UserID');
        await sql.close();

        const formattedData = result.recordset.map(data => `
      <div>
        <h3>Imię i Nazwisko: ${data.FirstName} ${data.LastName}</h3>
        <p>Login: ${data.Login}</p>
        <p>Hasło: ####### </p>
      </div>
    `);

        res.status(200).send(formattedData.join(''));

    } catch (err) {
        console.error('Błąd pobierania danych:', err);
        res.status(500).send(err.message);
    }
});

router.post('/addProduct', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const { ProductName, CategoryID, UnitPrice, UnitsInStock, Size } = req.body;

        const result = await sql.query`
            INSERT INTO Products (ProductName, CategoryID, UnitPrice, UnitsInStock, Size)
            VALUES (${ProductName}, ${CategoryID}, ${UnitPrice}, ${UnitsInStock}, ${Size})
        `;

        if (result.rowsAffected && result.rowsAffected[0] > 0) {
            res.status(201).send('Produkt został dodany pomyślnie.');
        } else {
            res.status(500).send('Wystąpił błąd podczas dodawania produktu.');
        }

    } catch (err) {
        console.error('Błąd podczas dodawania produktu:', err);
        res.status(500).send('Wystąpił błąd podczas dodawania produktu: ' + err.message);
    }
});

module.exports = router;
