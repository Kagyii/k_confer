const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const env = require('dotenv');
const connection = require('../database/mysql_connection');

env.config();

 async function sendVerificationCode(email, userId, verification_times) {

var result;

  // create reusable transporter object using the default SMTP transport
  let smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "kconfercom@gmail.com",
        pass: "cfajnwqeulccmqvb"
    }
});


var random,mailOptions;

random = 100000 + Math.floor(Math.random() * 900000)
mailOptions={
    from: '"K Confer" <noreply.kconfercom@gmail.com>',
    to : email,
    subject : "Please confirm your Email account",
    html : "Hello,<br> Please Click on the link to verify your email.<br><h3>Your Verification Code is "+random+"</h3>"
}

 await smtpTransport.sendMail(mailOptions).then((results)=>{


     if(results.accepted !==undefined && results.accepted.length !==0){
        const verifyToken = jwt.sign({
            id: userId,
            code: random,
            email: email,
            verification_times: verification_times,
           },
           process.env.ACCESS_TOKEN_SECRET,
           {expiresIn: "5m"}
           
           );

           result = {
            status: 1,
            verify_token: verifyToken
        };



     }else{
           
        result = {
            status: 0,
            details: "email sending error"
        };

     }
              
          
 })

return result;
  
}

async function verifyEmail(token,code){
 

return new Promise((resolve,reject)=>{

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,results)=>{

    
        if(err)  reject({
            status: 0,
            details : "Invalid token"
        });
           
        
        if(results.code === code){
    
     connection.query("UPDATE user_auth SET email_verification = true WHERE id='"+results.id+"'", function (error, results, fields) {
    
    
      if (error){
    
    
        reject({
    
            status: 0,
            details : "Data Update Error"
        }); 
    
      }else{
    
        resolve({
            status: 1,
            details : "Verification & Account Creation Successful"
    
    
      });
    
      
    }
    
    
      
    
    
    });
    
           
    
    
    
        }else{
    
        reject({
            status: 0,
            details : "Incorrect Code"
        }); 
        }
        
        
     
        
    
    
     });


});

 




}

module.exports = {
    sendVerificationCode: sendVerificationCode,
    verifyEmail: verifyEmail 
}