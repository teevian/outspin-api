const express = require("express");
const router = express.Router();

const interactionsController = require('../controllers/interactionsController');

router.get('/', interactionsController.getInteractions);

router.post('/', interactionsController.createInteraction);

module.exports = router;