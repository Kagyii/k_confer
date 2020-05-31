//npm packages
const router = require('express').Router();
const { body, query } = require('express-validator')
const validator = require('validator')

//middlewares
const tokenValidator = require('../middlewares/tokenValidator')

//controllers
const profileController = require('../controllers/profile')

//utility
const suggestion = require('../util/suggestion')

router.get('/get', [
    query('profile_id').exists({checkNull: true}).not().isEmpty({ignore_whitespace: true}).withMessage('Required profileId').isString().isNumeric().withMessage('Invalid profileId').trim().escape()
],
tokenValidator, profileController.getProfile)


router.post('/setup', [
    body('university').exists({checkNull: true}).not().isEmpty({ignore_whitespace: true}).withMessage('Required university').isString().withMessage('Invalid university').trim().escape(),
    body('hometown').optional().isString().withMessage('Invalid hometown').trim().escape(),
    body('speciality').optional().isString().withMessage('Invalid speciality').trim().escape(),
    body('work').optional().isString().withMessage('Invalid work').trim().escape(),
    body('workplace').optional().isString().withMessage('Invalid workplace').trim().escape(),
    body('studentYear').exists({checkNull: true}).not().isEmpty({ignore_whitespace: true}).withMessage('Required student year').isIn(suggestion.studentYearList).withMessage('Invalid student year'),
    body('interestedFields').exists({checkNull: true}).not().isEmpty({ignore_whitespace: true}).withMessage('Required interested Fields').isArray({min: 1, max: 1}).withMessage('Invalid interested fields'),
    body('image').exists({checkNull: true}).not().isEmpty({ignore_whitespace: true}).withMessage('Required image').isArray({min: 1, max: 1}).withMessage('Required image').custom(value => {
        if( !value.every( i => { return validator.isBase64(i) }) )
        {
         throw false
        }
        return true
     }).withMessage('Bad image')
],
tokenValidator, profileController.setupProfile)


// router.post('/edit', tokenValidator)


// router.post('/editProfile', async (req,res)=> {

//     const authToken = await verifyToken(req.body.auth_token);
//     if (!authToken) {
//         return res.send({
//             status: 0,
//             details: "invalid auth token"
//         })
//     }

//     const userId = authToken.userId;
//     const profileId = authToken.profileId;

//     const removeInterestSubject = req.body.removeInterestSubject; 
//     const addInterestSubject = req.body.addInterestSubject;
//     let profilePictureOldPath; 

//     function profileUpdateQueryBuilder(work, workplace, username, dateOfBirth, country, accountType, speciality, studentYear, university, profilePicture) {

//         let profileUpdateQuery = 'UPDATE profile SET ';

//         if(work){
//             profileUpdateQuery = profileUpdateQuery.concat(`work = '${req.body.work}',`)
//         }
    
//         if(workplace){
//             profileUpdateQuery = profileUpdateQuery.concat(`workplace = '${req.body.workplace}',`)
//         }
    
//         if(username){
//             profileUpdateQuery = profileUpdateQuery.concat(`username = '${req.body.username}',`)
//         }
    
//         if(dateOfBirth){
//             profileUpdateQuery = profileUpdateQuery.concat(`date_of_birth = '${req.body.dateOfBirth}',`)
//         }
    
//         if(country){
//             profileUpdateQuery = profileUpdateQuery.concat(`country = '${req.body.country}',`)
//         }
    
//         if(accountType){
//             profileUpdateQuery = profileUpdateQuery.concat(`account_type = '${req.body.accountType}',`)
//         }
    
//         if(speciality){
//             profileUpdateQuery = profileUpdateQuery.concat(`speciality = '${req.body.speciality}',`)
//         }
    
//         if(studentYear){
//             profileUpdateQuery = profileUpdateQuery.concat(`student_year = '${req.body.studentYear}',`)
//         }
    
//         if(university){
//             profileUpdateQuery = profileUpdateQuery.concat(`university = '${req.body.university}'`)
//         }


//         if(profilePicture){

//             const imageName = `K_confer-${Date.now()}${Math.floor(Math.random() * 9999999) + 999}.jpg`
//             const profilePictureNewPath = `images/profile-picture/${imageName}`;
//             profileUpdateQuery = profileUpdateQuery.concat(`profile_picture = '${profilePictureNewPath}',`)

//             query(`SELECT profile_picture FROM profile WHERE user_id = '${userId}'`, function(error, result){
//                 if(error){
//                     return res.send({
//                         status: 0,
//                         details: error
//                     })
//                 }
        
//                 profilePictureOldPath = `images/profile-picture/${result[0].profile_picture}`;
//             })
            

//             writeFile(profilePicturePath, Buffer.from(imageString, "base64") , function (err) {
//                 if (err) {
//                     return res.send({
//                         status: 0,
//                         details: 'Error in saving profile picture'
//                     })
//                 }
//               });
    
//         }

//         profileUpdateQuery = profileUpdateQuery.substr(0, profileUpdateQuery.length-1)

//         profileUpdateQuery = profileUpdateQuery.concat(` WHERE user_id='${userId}'`)

//         return profileUpdateQuery

//     }


//     function removeSubjectQueryBuilder(removeSubject){

//         let removeList = "";
    
//         for(let i = 0 ; i < removeSubject.length; i++){

//             removeList = removeList.concat(`'${removeSubject[i]}',`)

//         }
        
//         removeList = removeList.substr(0,removeList.length-1)

//         return `DELETE FROM interest_subject WHERE user_id = '${userId}' AND subject IN (${removeList})`
//     }


//     function addSubjectQueryBuilder(addSubject){


//         let addSubjectQuery = "INSERT INTO interest_subject (user_id, subject) VALUES ";
    
//         for(let i = 0 ; i < addSubject.length; i++){

//             if(i == addSubject.length - 1){
//                 addSubjectQuery = addSubjectQuery.concat(`('${userId}','${addSubject[i]}')`)
//                 break
//             }
//             addSubjectQuery = addSubjectQuery.concat(`('${userId}','${addSubject[i]}'),`)
//         }
        
//         return addSubjectQuery

//     }

//     query(profileUpdateQueryBuilder(req.body.work, req.body.workplace, req.body.username, req.body.dateOfBirth, req.body.country, req.body.accountType,
//          req.body.speciality, req.body.studentYear, req.body.university, req.body.profilePicture),
//          function(error){
//             if(error){
//                 return res.send({
//                     status: 0,
//                     details: 'Error in updating profile data'
//                 })
//             }

//             if(req.body.profilePicture){
//                 try {
//                     unlinkSync(profilePictureOldPath)
//                   } catch(err) {
//                     console.error(err)
//                   }                
//             }

//             if(typeof removeInterestSubject != 'undefined' && removeInterestSubject != null && removeInterestSubject.length != null && removeInterestSubject.length > 0){
       
//                query(removeSubjectQueryBuilder(removeInterestSubject), function(error){
//                    if(error){
//                        return res.send({
//                            status: 0,
//                            details: 'Error in removing interest subject'
//                        })
//                    }
//                })
//            }

//            if(typeof addInterestSubject != 'undefined' && addInterestSubject != null && addInterestSubject.length != null && addInterestSubject.length > 0){

//                 query(addSubjectQueryBuilder(addInterestSubject), function(error){
//                     if(error){
//                         return res.send({
//                             status: 0,
//                             details: 'Error in adding interest subject'
//                         })
//                     }
//                 })
//            }

//            return res.send({
//                status: 1,
//                details: "Successlly update"
//            })
//     })
    
// })


// router.post('/follow', async (req, res)=>{
//     const authToken = await verifyToken(req.body.auth_token);
//     if (!authToken) {
//         return res.send({
//             status: 0,
//             details: "Invalid auth token"
//         })
//     }

//     let followingStatus = req.body.following_status

//     if(followingStatus == true){

//         mysql_connection.query(`DELETE FROM follow WHERE user_id = '${authToken.profileId}' AND follower_id = '${req.body.profile_id}'`, function(err){
//             if(err){
//                 return res.send({
//                     status: 0,
//                     details: 'Fail to unfollow',
//                     following_status: true
//                 })
//             }

//             return res.send({
//                 status: 1,
//                 details: 'Successfully unfollow',
//                 following_status: false
//             })
//         })
        
//     }else if(followingStatus == false){
//         mysql_connection.query(`INSERT INTO follow (user_id, follower_id) VALUES ('${authToken.profileId}','${req.body.profile_id}') `,function(err){
//             if(err){
//                 return res.send({
//                     status: 0,
//                     details: 'Fail to follow',
//                     following_status: false
//                 })
//             }

//             return res.send({
//                 status: 1,
//                 details: 'Successfully follow',
//                 following_status: true
//             })
//         })
//     }else{
//         return res.send({
//             status: 0,
//             details: 'Follow status error'
//         })
//     }
// })


// router.get('/followerList', async (req, res) =>{
//     var authToken = await verifyToken(req.headers.auth_token);

//     if (!authToken) {
//         return res.send({
//             status: 0,
//             details: "Invalid auth token"
//         })
//     }

//     mysql_connection.query(`SELECT follow.follower_id, profile.username, profile.profile_picture FROM follow LEFT JOIN profile ON follow.follower_id = profile.profile_id WHERE follow.user_id = '${authToken.profileId}'`,
//      function (err, result){
//          if(err){
//             return res.send({
//                 status: 0,
//                 details: 'Error get followers'
//             })
//          }

//          return res.send({
//              status: 1,
//              details: result
//          })
//      })
// })


// router.get('/followList', async (req, res) =>{

//     var authToken = await verifyToken(req.headers.auth_token);

//     if (!authToken) {
//         return res.send({
//             status: 0,
//             details: "Invalid auth token"
//         })
//     }

//     mysql_connection.query(`SELECT follow.user_id, profile.username, profile.profile_picture FROM follow LEFT JOIN profile ON follow.user_id = profile.profile_id WHERE follow.follower_id = '${authToken.profileId}'`,
//      function (err, result){
//          if(err){
//             return res.send({
//                 status: 0,
//                 details: 'Error get followers'
//             })
//          }

//          return res.send({
//              status: 1,
//              details: result
//          })
//      })
// })


    

module.exports = router;

