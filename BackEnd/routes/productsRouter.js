const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require("./db");

router.get('/', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query('SELECT * FROM Products');
        await sql.close();

        const formattedData = result.recordset.map(item => `
      <div>
        <h3>Product Name: ${item.ProductName}</h3>
        <p>Price: ${item.UnitPrice}</p>
        <p>Size: ${item.Size}</p>
      </div>
    `);

        res.status(200).send(formattedData.join(''));

    } catch (err) {
        console.error('Data download error:', err);
        res.status(500).send(err.message);
    }
});

module.exports = router;