const express = require('express');
const validator = require('validator');
const bcrypt = require('bcrypt');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require("./db");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const decodeTokenMiddleware = require('./verifyTokenMiddleware');



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
        let result;

        try {
            result = await sql.query`SELECT * FROM Users WHERE Email = ${email}`;
            await sql.close();
        } catch (error) {
            console.error( 'SQL error:', error.message);
        }

        if (result.recordset.length === 0) {
            return res.status(400).json({ error: 'User not found.' });
        }

        const passwordFromDatabase = result.recordset[0].Password;

        const isPasswordValid = await bcrypt.compare(password, passwordFromDatabase);

        if (isPasswordValid) {
            const userData = {
                firstName: result.recordset[0].FirstName,
                lastName: result.recordset[0].LastName,
                email: result.recordset[0].Email,
                login: result.recordset[0].Login,
                role: result.recordset[0].Position,
                userID: result.recordset[0].UserID
            };
            const token = jwt.sign(userData, 'secretKey');
            res.status(200).json({
                success: true,
                message: 'Login successful',
                user: userData,
                token: token
            });
        } else {
            res.status(401).json({ error: 'Invalid password.' });
        }

    } catch (err) {
        console.error('Data download error:', err);
        res.status(500).send(err.message);
    }
});

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email address.' });
    }

    if (!validateName(firstName) || !validateName(lastName)) {
        return res.status(400).json({ error: 'Name and Surname cannot be empty or contain numbers.' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Password and confirmed password must be the same.' });
    }


    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await sql.connect(dbConfig);

        const result = await sql.query`SELECT TOP 1 * FROM Users WHERE Login = ${email}`;

        if (result.recordset.length > 0) {
            return res.status(400).json({ error: 'An account with this email address already exists.' });
        }

        const insertion = await sql.query`
            DECLARE @InsertedUserID INT = SCOPE_IDENTITY();
            INSERT INTO users (Login, Password, Position, FirstName, LastName, Email)
            VALUES (${email}, ${hashedPassword}, 'customer',  ${firstName}, ${lastName}, ${email});
        `;

        await sql.close();

        res.status(200).json({ message: 'User registered successfully.' });

    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send(err.message);
    }
});

router.get('/user-data', decodeTokenMiddleware, (req, res) => {
    const decodedToken = req.decodedToken;
    console.log('Decoded user data:', decodedToken);
    res.status(200).json({ success: true, userData: decodedToken });
});

module.exports = router;