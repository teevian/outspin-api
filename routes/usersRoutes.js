const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { checkSchema } = require('express-validator');

//const { hash, verify } = require('../utils/hash');
const { authorize } = require("../middlewares/auth");
const usersController = require('../controllers/usersController');
const interactionsController = require('../controllers/interactionsController');
const { loginSchema, registerSchema, handleValidation } = require('../middlewares/validation');

router.use(express.json());

router.get('/:id', usersController.getUser);
router.put("/:id", usersController.modifyUser);
router.delete("/:id", usersController.removeUser);
router.post('/:id/auth', usersController.authorization);

router.post('/register', checkSchema(registerSchema), handleValidation, usersController.registerUser);
router.post('/login', checkSchema(loginSchema), handleValidation, usersController.loginUser);

/*router.post("/login1", authorize, (req, res) => {
  res.status(200).json({ success: true });
});

router.delete("/", (request, response) => {
  response.status(200).send("DELETE METHOD user");
});
*/
router.get('/:id/interactions', interactionsController.getInteractionsByID);
router.post('/:id/interactions', interactionsController.createInteractionByID);

module.exports = router;

