const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require("./db");

router.get('/', async (req, res) => {
    try {
        await sql.connect(dbConfig);

        const result = await sql.query(`SELECT * FROM ProductDetailsView`);

        await sql.close();

        const products = result.recordset.reduce((acc, item) => {
            const existingProduct = acc.find(p => p.ProductID === item.ProductID);

            if (existingProduct) {
                existingProduct.Colors.push(item.ColorName);
            } else {
                acc.push({
                    ProductID: item.ProductID,
                    ProductName: item.ProductName.trim(),
                    CategoryID: item.CategoryID,
                    UnitPrice: item.UnitPrice,
                    Gender: item.Gender.trim(),
                    Colors: [item.ColorName],
                });
            }

            return acc;
        }, []);

        res.status(200).json(products);

    } catch (err) {
        console.error('Data download error:', err);
        res.status(500).json({ error: err.message });
    }
});


router.get('/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        await sql.connect(dbConfig);

        const result = await sql.query`EXEC GetProductDetails @ProductId = ${productId}`;

        await sql.close();

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }


        const product = {
            ProductID: result.recordset[0].ProductID,
            ProductName: result.recordset[0].ProductName,
            UnitPrice: result.recordset[0].UnitPrice,
            Gender: result.recordset[0].Gender,
            Colors: []
        };

        result.recordset.forEach(record => {
            const existingColor = product.Colors.find(color => color.ColorName === record.ColorName);

            if (existingColor) {
                existingColor.Sizes.push({
                    SizeName: record.Size,
                    InStock: record.UnitInStock
                });
            } else {
                product.Colors.push({
                    ColorName: record.ColorName,
                    Sizes: [{
                        SizeName: record.Size,
                        InStock: record.UnitInStock
                    }]
                });
            }
        });

        res.status(200).json(product);

    } catch (err) {
        console.error('Data download error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;