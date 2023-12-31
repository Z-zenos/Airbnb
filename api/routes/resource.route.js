const express = require('express');

const resourceController = require('../controllers/resource.controller');

const router = express.Router();

router.get('/countries', resourceController.getAllCountries);
router.get('/currencies', resourceController.getAllCurrencies);
router.get('/interests', resourceController.getAllInterests);
router.get('/languages', resourceController.getAllLanguages);
router.get('/cities', resourceController.getCitiesByKeyword);

module.exports = router;