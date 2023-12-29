const express = require('express');
const router = express.Router();
const adminsRouter = require('./adminsRouter');

router.use('/admin', adminsRouter);

router.get('/', (req, res, next) => {});

router.get('/:value', (req, res, next) => {
    const value = req.params.value;
});

router.post('/', (req, res, next) => {});
module.exports = router;