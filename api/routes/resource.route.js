const express = require('express');

const resourceController = require('../controllers/resource.controller');

const router = express.Router();

router.get('/countries', resourceController.getAllCountries);
router.get('/currencies', resourceController.getAllCurrencies);

module.exports = router;