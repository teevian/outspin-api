const express = require("express");
const { checkSchema } = require("express-validator");

const router = express.Router();

const clubsController = require('../controllers/clubsController');
const validationMiddleware = require("../middlewares/validationMiddleware");

// CRUD implementation
router.use(express.json());
//router.get('/', clubsController.getClubs);
router.get("/:id", checkSchema(validationMiddleware.getClubSchema), validationMiddleware.handleValidation, clubsController.getClub);
module.exports = router;
