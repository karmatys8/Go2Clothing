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
        const {
            name: ProductName,
            category: CategoryName,
            price: UnitPrice,
            discount: Discount,
            inStock: UnitsInStock,
            color: Color,
            size: Size
        } = req.body;

        const categoryId = await sql.query`
            SELECT CategoryID
            FROM Categories
            WHERE CategoryName = ${CategoryName}
        `;

        if (categoryId === null) {
            categoryId = await sql.query`
            INSERT INTO Categories (CategoryName)
            VALUES(${CategoryName})
        `;
        }

        const productResult = await sql.query`
            INSERT INTO Products (ProductName, CategoryID, UnitPrice, Discount)
            VALUES (${ProductName}, ${categoryId}, ${UnitPrice}, ${Discount})
        `;

        const productId = await sql.query`
            SELECT ProductID FROM Products
            WHERE ProductName = ${ProductName}
                AND CategoryID = ${categoryId}
                AND UnitPrice = ${UnitPrice}
                AND Discount = ${Discount}
        `;


        const colorId = await sql.query`
            SELECT ColorID
            FROM Colors
            WHERE ColorName = ${Color}
        `;

        if (colorId === null) {
            colorId = await sql.query`
            INSERT INTO Colors (ColorName, Name)
            VALUES(${Color}, ${Color})
        `; // Name could be either obtained on backend (preferably) or written by admin
        }

        const detailsResult = await sql.query`
        INSERT INTO Product_Details (ProductID, ColorID, Size, UnitsInStock, Active)
        VALUES (${productId}, ${colorId}, ${Size}, ${UnitsInStock}, 1)
    `

        if (productResult?.rowsAffected[0] > 0 && detailsResult?.rowsAffected[0] > 0) {
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
            UPDATE Products
            SET Active = 0
            WHERE ProductID=${req.params.id}
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
            name: ProductName,
            price: UnitPrice,
            discount: Discount,
            inStock: UnitInStock,
        } = req.body;

        const result = await sql.query`
            SELECT dbo.GetProductIDByProductDetailsID(${Product_DetailsID})
            AS ProductId
        `;

        const ProductId = result.recordset[0].ProductId;

        const productUpdateResult = await sql.query`
                UPDATE Products SET 
                    ProductName = ${ProductName},
                    UnitPrice = ${UnitPrice}, 
                    Discount = ${Discount}
                WHERE ProductID = ${ProductId};
        `;

        const productDetailsUpdateResult = await sql.query`
                UPDATE Product_Details SET 
                    UnitInStock = ${UnitInStock}
                WHERE Product_DetailsID = ${Product_DetailsID};
        `;

        await sql.close();

        if (productDetailsUpdateResult?.rowsAffected[0] > 0 && productUpdateResult?.rowsAffected[0] > 0) {
            res.status(201).send('The product and product details have been updated successfully.');
        } else if(productUpdateResult?.rowsAffected[0] > 0){
            res.status(500).send('Only the product has been updated successfully.');
        } else {
            res.status(500).send('An error occurred while updating the product.');
        }

    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).send('An error occurred while updating the product:' + err.message);
    }
});


router.get('/nextProductId', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);

        const result = await sql.query`
            SELECT TOP 1 Product_DetailsID
            FROM Product_Details
            ORDER BY Product_DetailsID DESC
        `;

        if (result.recordset.length > 0) {
            res.status(201).json({nextId: result.recordset[0].Product_DetailsID + 1});
        } else {
            res.status(500).send('An error occurred while getting the next available product id.');
        }
    } catch (err) {
        console.error('Error getting next available index for product:', err);
        res.status(500).send('An error occurred while getting the next available product id:' + err.message);
    }
});

module.exports = router;
