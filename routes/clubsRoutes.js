const express = require("express");
const router = express.Router();

const clubsController = require('../controllers/clubsController');

// CRUD implementation
router.use(express.json());
router.get('/', clubsController.getClubs);

module.exports = router;