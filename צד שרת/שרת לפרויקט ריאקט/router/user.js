const express = require('express');
const router = express.Router();
const userController = require('../controller/user');

router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/logout', userController.logout);
router.get('/', userController.get);
router.get('/:id', userController.getById);

module.exports = router;
