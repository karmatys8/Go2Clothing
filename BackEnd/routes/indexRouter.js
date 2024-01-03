const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require("./db");


router.get('/', (req, res) => {
  res.send("Main Page");
});

module.exports = router;