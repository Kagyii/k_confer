const jwt = require('jsonwebtoken')
const {mongoGet} = require('../database/mongodb_connection')

 async function verifyToken(token){

        if(!token || token == 'null'){
            return null 
        }
        
        let authTokenValue;

        try{
         authTokenValue = await jwtVerify(token);
        }catch (err){
           return null
        }
        
    
        let tokenExistCondition ={_id: authTokenValue.profileId , validToken: token } 
        
        try{
            await mongoAuthValidation(tokenExistCondition)
            return authTokenValue
        }catch{
            return null
        }
        
}

function jwtVerify(authToken){
    return new Promise( (resolve, reject) =>{
        jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET,function (jwtErr, jwtResult){
            if(jwtErr){
                return reject('Invalid Token')
            }
            return resolve(jwtResult)
        });
    })  
}

function mongoAuthValidation(tokenExistCondition){
    return new Promise((resolve,reject)=>{
        mongoGet().collection('Authorization').findOne(tokenExistCondition, function(err, result){
            if(err){
                return reject('Error')
            }
                if(result){
                    return resolve('Success'); 
                }else{
                    return reject('Error')
                }
        })
    })
}


module.exports = {
    verifyToken: verifyToken
};

