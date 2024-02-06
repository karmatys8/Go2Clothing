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

router.post('/newOrder', decodeTokenMiddleware, async (req, res) => {
    const userID = req.decodedToken.userID;
    try {
        const pool = await sql.connect(dbConfig);
        const { CustomerID, DeliveryDays, Freight, OrderDetails } = req.body;

        if (userID !== CustomerID) {
            console.log('Authentication error');
            res.status(500).json({ success: false, error: 'Authentication error' });
        }

        const result = await sql.query`
            DECLARE @NewOrderID INT;

            EXEC dbo.AddOrder
                 @CustomerID = ${CustomerID},
                 @DeliveryDays = ${DeliveryDays},
                 @Freight = ${Freight},
                 @NewOrderID = @NewOrderID OUTPUT;

            SELECT @NewOrderID AS NewOrderID;
        `;

        const NewOrderID = result.recordset[0].NewOrderID;

        for (const detail of OrderDetails) {
            const result = await sql.query`select dbo.GetProductDetailsID(${detail.ProductID},${detail.Color},${detail.Size}) AS Product_DetailsID`;
            await sql.query`
                EXEC InsertOrderDetails ${NewOrderID},${result.recordset[0].Product_DetailsID},${detail.Quantity}
            `;
        }
        await sql.close();
        res.status(200).json({ success: true, NewOrderID: NewOrderID });

    } catch (err) {
        console.error('Error adding order:', err);
        res.status(500).json({ success: false, error: 'Error adding order: ' + err.message });
    }
});


module.exports = router;
