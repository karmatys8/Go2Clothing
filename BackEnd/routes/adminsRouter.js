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


router.post('/updateProduct', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const { ProductId, ProductName, CategoryID, UnitPrice, Discount, Gender,
            Product_DetailsID, UnitInStock, Active  } = req.body;

        const productUpdateResult = await sql.query`
                UPDATE Products SET 
                    ProductName = ${ProductName}, CategoryID = ${CategoryID}, UnitPrice = ${UnitPrice}, 
                    Discount = ${Discount}, Gender = ${Gender}
                WHERE ProductID = ${ProductId};
        `;

        const productDetailsUpdateResult = await sql.query`
                UPDATE Product_Details SET 
                    UnitInStock = ${UnitInStock}, Active = ${Active}
                WHERE Product_DetailsID = ${Product_DetailsID};
        `;

        await sql.close();

        if (productDetailsUpdateResult.rowsAffected && productDetailsUpdateResult.rowsAffected[0] > 0
            && productUpdateResult.rowsAffected && productUpdateResult.rowsAffected[0] > 0) {
            res.status(201).send('The product and product details have been updated successfully.');
        } else if(productUpdateResult.rowsAffected && productUpdateResult.rowsAffected[0] > 0){
            res.status(500).send('Only the product has been updated successfully.');
        }
        else {
            res.status(500).send('An error occurred while updating the product.');
        }

    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).send('An error occurred while updating the product:' + err.message);
    }
});

module.exports = router;
