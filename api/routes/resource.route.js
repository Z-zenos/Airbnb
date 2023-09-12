const express = require('express');

const resourceController = require('../controllers/resource.controller');

const router = express.Router();

router.get('/countries', resourceController.getAllCountries);

module.exports = router;