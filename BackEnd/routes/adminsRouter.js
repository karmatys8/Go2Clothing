const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require("./db");
const cors = require('cors');
router.use(cors());
router.get('/', (req, res) => {
    res.send("Admins main page");
});

router.get('/products', async (req, res) => {

    try {
        await sql.connect(dbConfig);

        const result = await sql.query('SELECT * FROM AllProductsData');

        const mappedRecords = result.recordset.map((record) => ({
            id: record.Product_DetailsID,
            category: record.CategoryName.trim(),
            name: record.ProductName.trim(),
            price: record.UnitPrice,
            discount: record.DiscountedPrice,
            color: record.ColorName,
            size: record.Size.trim(),
            inStock: record.UnitInStock,
        }));

        res.status(200).json(mappedRecords);
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

        const {
            id: Product_DetailsID,
            category: CategoryName,
            name: ProductName,
            price: UnitPrice,
            discount: Discount,
            color: Color,
            size: Size,
            inStock: UnitInStock,
            isNew: IsNew
        } = req.body;

        const result = await sql.query`SELECT dbo.GetProductIDByProductDetailsID(${Product_DetailsID}) AS ProductId`;

        const ProductId = result.recordset[0].ProductId;

        const productUpdateResult = await sql.query`
                UPDATE Products SET 
                    ProductName = ${ProductName}, UnitPrice = ${UnitPrice}, 
                    Discount = ${Discount}
                WHERE ProductID = ${ProductId};
        `;

        const productDetailsUpdateResult = await sql.query`
                UPDATE Product_Details SET 
                    UnitInStock = ${UnitInStock}, Size = ${Size}
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
