//npm packages
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')
const dotenv = require('dotenv');


//models
const UserAuth = require('../models/user-auth')
const Profile = require('../models/profile')
const ValidToken = require('../models/validToken')
const Follower = require('../models/follower')

dotenv.config()

module.exports.signUp = async (req, res, next) => {

    const validationErr = validationResult(req)

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg)
        err.status = 0
        return next(err)
    }

    const salt =  bcrypt.genSaltSync();

    const hashPassword = await bcrypt.hash(req.body.password, salt);

    try {

        const userAuth = new UserAuth();

        let [signupResult] = await userAuth.save(req.body.email, hashPassword)


        let userId = signupResult.insertId

        let profileId = (Math.floor(Math.random() * 99999999) + 9999).toString() + Date.now().toString()

        const profile = new Profile()

        await profile.save(profileId, req.body.username, req.body.gender, req.body.date_of_birth, req.body.country, req.body.account_type, userId)

        const follower = new Follower()

        await follower.follow(profileId, profileId)

        const authToken = [jwt.sign({ userId: userId, profileId: profileId }, process.env.ACCESS_TOKEN_SECRET)];

        const validToken = new ValidToken()
        
        await validToken.save(profileId, authToken)

        return res.json({
            status: 1,
            auth_token: authToken[0],
            verify_token: '123',
            profile_id: profileId
          });

    } catch (err) {
        err.status = 0
        next(err)
    }
}