const express = require('express')
const router = require('express').Router()
const userController = require('../controllers/user-controller')


router.post('/user-data', userController.user_data)
router.post('/complete-check', userController.complete_check)
router.post('/get-info', userController.get_info)


module.exports = router