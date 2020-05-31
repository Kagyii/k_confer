const router = require('express').Router();
const mysql_connection = require('../database/mysql_connection');
const { verifyToken } = require('../verifier/verify_token');

router.get('/profiles', async (req, res)=>{
  
    mysql_connection.query(`SELECT id, profile_picture, username FROM profile WHERE username LIKE '%${req.query.name}%'`, function(err,result){
        if(err){
            console.log(err)
            return res.send({
                status: 0,
                details: 'Cannot find profile'
            })
        }

        return res.send({
            status: 1,
            details: result
        })
    })
})


module.exports = router

