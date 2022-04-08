const express = require("express");
const router = express.Router();

const tokensController = require('../controllers/tokensController');
const {awaitHandler} = require('../middlewares/awaitHandler');

router.get('/:id', awaitHandler(tokensController.authorization));

module.exports = router;
