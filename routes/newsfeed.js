//npm packages
const router = require('express').Router()
const { body, query } = require('express-validator')
const validator = require('validator')

//middlewares
const tokenValidator = require('../middlewares/tokenValidator')

//controllers
const newsfeedController = require('../controllers/newsfeed')

//global variable
const oldOrNew = ['old', 'new', 'neither']

//routers
router.get('/post',[
    query('old_or_new').exists({checkNull: true}).not().isEmpty({ignore_whitespace: true}).withMessage('Required oldOrNew information').isIn(oldOrNew).withMessage('Invalid information'),
    query('time_from').exists({checkNull: true}).not().isEmpty({ignore_whitespace: true}).withMessage('Required time_form').isString().isNumeric().withMessage('Invalid timestamp value')
], tokenValidator, newsfeedController.getPostNewsfeed)

// router.get('/article', tokenValidator)

// router.get('/case', tokenValidator)


module.exports = router;