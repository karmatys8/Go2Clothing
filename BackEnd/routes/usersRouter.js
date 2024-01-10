const express = require('express');
const validator = require('validator');
const bcrypt = require('bcrypt');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require("./db");

function validateName(name) {
    if (!name || name.trim() === '') {
        return false;
    }
    return /^[a-zA-Z]+$/.test(name);
}

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email address.' });
    }

    try {
        await sql.connect(dbConfig);

        const result = await sql.query`SELECT Password FROM Users WHERE Login = ${email}`;
        const admin = await  sql.query`SELECT a.FirstName,a.Lastname FROM Users as u INNER JOIN Admins AS a ON a.AdminID=u.UserID WHERE u.Login = ${email}`;
        const customer = await  sql.query`SELECT c.FirstName,c.LastName FROM Users as u INNER JOIN Customers AS c ON c.CustomerID=u.UserID WHERE u.Login = ${email}`;

        await sql.close();

        if (result.recordset.length === 0) {
            return res.status(400).json({ error: 'User not found.' });
        }

        const passwordFromDatabase = result.recordset[0].Password;

        const isPasswordValid = await bcrypt.compare(password, passwordFromDatabase);

        if (isPasswordValid) {
            if (admin.recordset.length>0){
                res.send("Hello Admin");
            }else res.send("Hello customer");
        } else {
            res.send('Fail');
        }

    } catch (err) {
        console.error('Data download error:', err);
        res.status(500).send(err.message);
    }
});
router.post('/register', async (req, res) => {
    const { firstname, lastname, email, password, confirmPassword } = req.body;

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email address.' });
    }

    if (!validateName(firstname) || !validateName(lastname)) {
        return res.status(400).json({ error: 'Name and Surname cannot be empty or contain numbers.' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Password and confirmed password must be the same.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password,10);

        await sql.connect(dbConfig);

        const result = await sql.query`SELECT TOP 1 * FROM Users WHERE Login = ${email}`;

        if (result.recordset.length > 0) {
            return res.status(400).json({ error: 'An account with this email address already exists.' });
        }

        const insertion = await sql.query`
            INSERT INTO users (Login, Password)
            VALUES (${email}, ${hashedPassword});

            DECLARE @InsertedUserID INT = SCOPE_IDENTITY();

            INSERT INTO customers (CustomerID, FirstName, LastName)
            VALUES (@InsertedUserID, ${firstname}, ${lastname});
        `;

        await sql.close();

        res.status(200).json({ message: 'User registered successfully.' });

    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send(err.message);
    }
});

module.exports = router;