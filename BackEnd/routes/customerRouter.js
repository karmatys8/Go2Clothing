const express = require('express');
const sql = require('mssql');
const router = express.Router();
const dbConfig = require("./db");
const decodeTokenMiddleware = require('./verifyTokenMiddleware');

router.get('/', decodeTokenMiddleware, async (req, res) => {
    const userId = req.decodedToken.userID;

    try {
        await sql.connect(dbConfig);
        const result = await sql.query`EXEC GetOrderDetailsByCustomer ${userId}`;
        await sql.close();

        const orders = result.recordset.map(order => ({
            OrderID: order.OrderID,
            OrderDate: order.OrderDate,
            UserID: order.CustomerID,
            Products: [
                {
                    ProductID: order.ProductID,
                    ProductName: order.ProductName.trim(),
                    ColorName: order.ColorName,
                    Size: order.Size.trim(),
                    Quantity: order.Quantity,
                    Discount: order.Discount,
                    UnitPrice: order.UnitPrice
                }
            ]
        }));

        const groupedOrders = orders.reduce((acc, order) => {
            const existingOrder = acc.find(o => o.OrderID === order.OrderID);

            if (existingOrder) {
                existingOrder.Products.push(...order.Products);
            } else {
                acc.push(order);
            }

            return acc;
        }, []);

        res.status(200).json(groupedOrders);
    } catch (err) {
        console.error('Error fetching order details:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
