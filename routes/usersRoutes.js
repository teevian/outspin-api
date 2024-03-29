const express = require("express");
const jwt = require('jsonwebtoken');
const { checkSchema } = require('express-validator');

const usersController = require('../controllers/usersController');
const interactionsController = require('../controllers/interactionsController');
const validationMiddleware = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const photoMiddleware = require("../middlewares/photoMiddleware");


const router = express.Router();

router.patch('/:id/photo', photoMiddleware.uploadUserPhoto, photoMiddleware.resizeUserPhoto, checkSchema(validationMiddleware.updateSchema), validationMiddleware.handleValidation,usersController.updateUser);
router.put("/:id", usersController.modifyUser);
router.delete("/:id", usersController.removeUser);

router.post('/register', checkSchema(validationMiddleware.registerSchema), validationMiddleware.handleValidation, usersController.registerUser);
router.post('/login', checkSchema(validationMiddleware.loginSchema), validationMiddleware.handleValidation, usersController.loginUser);
router.get("/checkPhoneNumber", usersController.checkPhoneNumber);
router.delete("/", (request, response) => {
  response.status(200).send("DELETE METHOD user");
});

router.get('/:id/interactions', interactionsController.getInteractionsByID);
router.post('/:id/interactions', interactionsController.createInteractionByID);

router.get('/:id/auth', usersController.authorization);
router.get("/:id/autho", authMiddleware.authorize, (req, res) => {res.status(400).json({status: "success"})});

module.exports = router;

