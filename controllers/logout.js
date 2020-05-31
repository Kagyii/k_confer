//validation
const { validationResult } = require('express-validator')

//models
const ValidToken = require('../models/validToken')

module.exports.logout = async (req, res, next) => {

    const validationErr = validationResult(req)

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg)
        err.status = 0
        return next(err)
    }
  
    const validToken = new ValidToken()

    let {modifiedCount} = await validToken.remove(req.decodedToken.profileId, req.headers.auth_token, req.body.logout_mode)

    if(modifiedCount == 1){
        return res.json({
            status: 1,
            details: 'Successfully logout'
        })
    }else{
        let err = new Error('Error logout')
        err.status = 0
        return next(err)
    }


  
  }