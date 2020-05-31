//npm packages
const {validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const moment = require('moment')

//models
const UserAuth = require('../models/user-auth')
const ValidToken = require('../models/validToken')
const Profile = require('../models/profile')
const Follower = require('../models/follower')

dotenv.config();

module.exports.login = async (req, res, next) => {

    const validationErr = validationResult(req)

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg)
        err.status = 0
        return next(err)
    }

    try{

        const userAuth = new UserAuth()

        let [[checkAuthResult]] = await userAuth.checkAuth(req.body.email)

        if(checkAuthResult){

            let isCorrectPwd = await bcrypt.compare(req.body.password , checkAuthResult.password)

            if(isCorrectPwd){

                const profile = new Profile()
                
                let [[getProfileResult]] = await profile.getByUid(checkAuthResult.id)

                const authToken = jwt.sign({userId: checkAuthResult.id, profileId: getProfileResult.id} , process.env.ACCESS_TOKEN_SECRET);

                const validToken = new ValidToken()

                let addNewTokenResult = await validToken.addNewToken(getProfileResult.id, authToken)

                const follower = new Follower()

                let [[getFollowerCount]] = await follower.getFollowerCount(getProfileResult.id)

                getProfileResult.followerCount = getFollowerCount.followerCount - 1

                let [[getFollowingCount]] = await follower.getFollowingCount(getProfileResult.id)

                getProfileResult.followingCount = getFollowingCount.followingCount - 1

                if(addNewTokenResult.modifiedCount == 1 ){

                    return res.json({
                        status : 1,
                        auth_token: authToken,
                        profileSetup: checkAuthResult.profile_setup,
                        profileDetails: getProfileResult
                      })
                    
                }else{
                    let err = new Error('Cannot create authToken')
                    err.status = 0
                    return next(err)
                }
                

            }else{
                let err = new Error('Incorrect password')
                err.status = 0
                return next(err)
            }

        }else{
            let err = new Error('Incorrect email address')
            err.status = 0
            return next(err)
        } 

    }catch(err){
        err.status = 0
        return next(err)
    }

}