const express = require('express');
const auth = require('../../src/middlewares/auth');
const validate = require('../../src/middlewares/validate');
const authValidation = require('../../src/validations/auth.validation');
const authController = require('../../src/controllers/auth.controller');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);

module.exports = router;