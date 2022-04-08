const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { checkSchema } = require('express-validator');

const usersController = require('../controllers/usersController');
const interactionsController = require('../controllers/interactionsController');
const { loginSchema, registerSchema, handleValidation } = require('../middlewares/validation');
const { awaitHandler } = require('../middlewares/awaitHandler');

router.use(express.json());

router.get('/:id', usersController.getUser);
router.put("/:id", usersController.modifyUser);
router.delete("/:id", usersController.removeUser);

router.post('/register', checkSchema(registerSchema), handleValidation, awaitHandler(usersController.registerUser));
router.post('/login', checkSchema(loginSchema), handleValidation, awaitHandler(usersController.loginUser));
router.delete("/", (request, response) => {
  response.status(200).send("DELETE METHOD user");
});

router.get('/:id/interactions', interactionsController.getInteractionsByID);
router.post('/:id/interactions', interactionsController.createInteractionByID);

module.exports = router;

