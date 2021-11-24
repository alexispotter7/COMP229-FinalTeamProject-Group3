const express = require('express')
const router = express.Router()
const userController = require('../controller/user')

router.post('/signup', userController.singup)
router.post('/signin', userController.signin)
router.get('/check', userController.check)
//router.get('/', userController.getAllUsers)

// router.get('/signout', userController.signout) // As we don't have session info in the backend, it's not possible to use passport logout()



module.exports = router