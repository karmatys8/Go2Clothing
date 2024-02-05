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
                    ProductImage: item.Path,
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
            Colors: [],
            ImagePaths: []
        };

        const tempColors = {};

        result.recordset.forEach(record => {
            const colorKey = record.ColorName;
            const sizeKey = record.Size;

            if (!tempColors[colorKey]) {
                tempColors[colorKey] = {
                    ColorName: record.ColorName,
                    Sizes: [{
                        SizeName: sizeKey,
                        InStock: record.UnitInStock
                    }]
                };
            } else {
                const existingSize = tempColors[colorKey].Sizes.find(size => size.SizeName === sizeKey);

                if (existingSize) {
                    existingSize.InStock = record.UnitInStock;
                } else {
                    tempColors[colorKey].Sizes.push({
                        SizeName: sizeKey,
                        InStock: record.UnitInStock
                    });
                }
            }

            if (record.Path && !product.ImagePaths.includes(record.Path)) {
                product.ImagePaths.push(record.Path);
            }
        });


        Object.values(tempColors).forEach(color => {
            product.Colors.push(color);
        });



        res.status(200).json(product);

    } catch (err) {
        console.error('Data download error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;