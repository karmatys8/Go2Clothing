const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require("./db");
const cors = require("cors");


router.use(cors());


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

router.get('/size/:id',async (req, res) => {
    const productId = req.params.id;
    try {
        await sql.connect(dbConfig);
        const result = await sql.query`EXEC GetSizes @ProductId = ${productId}`;
        await sql.close();
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        const sizes = result.recordset.map(record => record.Size.trim()); // Usuwa białe znaki ze wszystkich rozmiarów

        res.status(200).json(sizes);
    } catch (err) {
        console.error('Error while fetching sizes:', err);
        res.status(500).send('An error occurred while fetching sizes:' + err.message);
    }
});

router.get('/images/:id',async (req, res) => {
    const productId = req.params.id;
    try {
        await sql.connect(dbConfig);
        const result = await sql.query`EXEC GetImagesAndIconsByProductID @ProductId = ${productId}`;
        await sql.close();
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        const images = result.recordset.map((record) => ({
            id: record.id,
            img: record.img,
            title: record.title.trim(),
        }));
        res.status(200).json(images);
    } catch (err) {
        console.error('Error while fetching images:', err);
        res.status(500).send('An error occurred while fetching images:' + err.message);
    }
});

router.get('/colors/:id',async (req, res) => {
    const productId = req.params.id;
    try {
        await sql.connect(dbConfig);
        const result = await sql.query`EXEC GetColorsByProductID @ProductId = ${productId}`;
        await sql.close();
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        const images = result.recordset.map((record) => ({
            id: record.id,
            colorHex: record.colorHex,
            colorName: record.colorName.trim(),
        }));
        res.status(200).json(images);
    } catch (err) {
        console.error('Error while fetching colors:', err);
        res.status(500).send('An error occurred while fetching colors:' + err.message);
    }
});


router.get('/details/:id',async (req, res) => {
    const productId = req.params.id;
    try {
        await sql.connect(dbConfig);
        const result = await sql.query`EXEC GetDetailsByProductID @ProductId = ${productId}`;
        await sql.close();
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        const details = {
            ProductName: result.recordset[0].ProductName,
            ProductPrice: result.recordset[0].ProductPrice,
        };
        res.status(200).json(details);
    } catch (err) {
        console.error('Error while fetching images:', err);
        res.status(500).send('An error occurred while fetching images:' + err.message);
    }
});

router.get('/description/:id',async (req, res) => {
    const productId = req.params.id;
    try {
        await sql.connect(dbConfig);
        const result = await sql.query`EXEC GetDescriptionByProductID @ProductId = ${productId}`;
        await sql.close();
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        const details = {
            ProductDescription: result.recordset[0].ProductDescription
        };
        res.status(200).json(details);
    } catch (err) {
        console.error('Error while fetching images:', err);
        res.status(500).send('An error occurred while fetching description:' + err.message);
    }
});


router.get('/recommendations/:productId', async (req, res) => {
    const productId = req.params.productId;

    try {
        await sql.connect(dbConfig);
        const result = await sql.query(`
            EXEC GetMainProductDetails3 ${productId}
            `);
        let products = result.recordset;

        products = products.map(product => {
            const colors = product.colors ? product.colors.split(",") : [];
            return {
                cover: product.cover,
                id: product.id,
                name: product.name,
                priceSale: product.priceSale,
                price: product.price,
                status: product.status,
                colors: colors
            };
        });

        const recordsets = [products];
        const recordset = [...products];
        const output = {};
        const rowsAffected = [products.length];

        const finalResult = {
            recordsets: recordsets,
            recordset: recordset,
            output: output,
            rowsAffected: rowsAffected
        };
        await sql.close();
        res.json(finalResult);
    } catch (err) {
        console.error('Data download error:', err);
        res.status(500).json({ error: err.message });
    }
});


router.get('/:from/:offset', async (req, res) => {
    const from = req.params.from;
    const offset = req.params.offset;

    try {
        await sql.connect(dbConfig);
        const result = await sql.query(`
            EXEC GetMainProductDetails2 ${from}, ${offset}
            `);
        let products = result.recordset;

        products = products.map(product => {
            const colors = product.colors ? product.colors.split(",") : [];
            return {
                cover: product.cover,
                id: product.id,
                name: product.name,
                priceSale: product.priceSale,
                price: product.price,
                status: product.status,
                colors: colors
            };
        });

        const recordsets = [products];
        const recordset = [...products];
        const output = {};
        const rowsAffected = [products.length];

        const finalResult = {
            recordsets: recordsets,
            recordset: recordset,
            output: output,
            rowsAffected: rowsAffected
        };

        await sql.close();
        res.json(finalResult);
    } catch (err) {
        console.error('Data download error:', err);
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;