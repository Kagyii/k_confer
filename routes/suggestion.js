//npm packages
const router = require('express').Router();

//middlewares
const tokenValidator = require('../middlewares/tokenValidator')

//controller
const suggestionController = require('../controllers/suggestion')

router.get('/profileSetup', tokenValidator, suggestionController.profileSetup)

module.exports = router;