const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require("./db");

router.get('/', (req, res) => {
    res.send("Admins main page");
});

router.get('/products', async (req, res) => {
    try {
        await sql.connect(dbConfig);

        const result = await sql.query('SELECT * FROM AdminProductsView');

        const groupedProducts = result.recordset.reduce((acc, product) => {
            const existingProduct = acc.find(p => p.productId === product.ProductID);

            if (existingProduct) {
                const existingColor = existingProduct.colors.find(c => c.color === product.ColorName.trim());

                if (existingColor) {
                    existingColor.sizes.push({
                        size: product.Size.trim(),
                        stock: product.UnitinStock
                    });
                } else {
                    existingProduct.colors.push({
                        color: product.ColorName.trim(),
                        sizes: [{
                            size: product.Size.trim(),
                            stock: product.UnitinStock
                        }]
                    });
                }
            } else {
                acc.push({
                    productId: product.ProductID,
                    categoryName: product.CategoryName.trim(),
                    productName: product.ProductName.trim(),
                    colors: [{
                        color: product.ColorName.trim(),
                        sizes: [{
                            size: product.Size.trim(),
                            stock: product.UnitinStock
                        }]
                    }],
                    unitPrice: product.UnitPrice,
                });
            }

            return acc;
        }, []);

        res.status(200).json(groupedProducts);
    } catch (err) {
        console.error('Error fetching admin products:', err);
        res.status(500).json({ error: err.message });
    } finally {
        await sql.close();
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
            res.status(201).send('The product has been added successfully.');
        } else {
            res.status(500).send('An error occurred while adding the product.');
        }

    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).send('An error occurred while adding the product:' + err.message);
    }
});

router.delete('/deleteProduct/:id', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);

        const result = await sql.query`
            Delete from Products where ProductID=${req.params.id}
        `;

        if (result.rowsAffected && result.rowsAffected[0] > 0) {
            res.status(201).send('The product has been deleted successfully.');
        } else {
            res.status(500).send('An error occurred while deleting the product.');
        }

    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).send('An error occurred while deleting the product:' + err.message);
    }
});

module.exports = router;
