//npm packages
const router = require('express').Router()
const { body } = require('express-validator')

//middlewares
const tokenValidator = require('../middlewares/tokenValidator')

router.post('/follow')

router.post('/unfollow')

module.exports = router