
//database
const mongodb_connection = require('../database/mongodb_connection')


module.exports = class ValidToken {

    async save(profileId, authToken) {

        const userValidToken = { _id: profileId, validToken: authToken }

        return mongodb_connection.get().collection('Authorization').insertOne(userValidToken)

    }

    async check(profileId, authToken){

        let isTokenExist = {_id: profileId , validToken: authToken } 
        
        return mongodb_connection.get().collection('Authorization').findOne(isTokenExist)

    }


    async addNewToken (profileId, authToken) {

        let tokenVault = { _id : profileId } 
        let newAuthToken = {$addToSet: { validToken : authToken}}

        return mongodb_connection.get().collection('Authorization').updateOne(tokenVault, newAuthToken)

    }

    async remove (profileId, authToken, logoutMode) {

       const logoutUser = {_id : profileId}

       let removeToken 

        if(logoutMode == 'one'){

           removeToken = { $pull: {validToken : authToken}}

           return mongodb_connection.get().collection('Authorization').updateOne(logoutUser, removeToken)

        }else if(logoutMode == 'all'){

           removeToken = { $set: {validToken : []} }

           return mongodb_connection.get().collection('Authorization').updateOne(logoutUser, removeToken)

        }

    }
    
}