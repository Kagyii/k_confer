//npm packages
const router = require('express').Router()
const { body, query } = require('express-validator')
const validator = require('validator');

//middlewares
const tokenValidator = require('../middlewares/tokenValidator')

//controllers
const postController = require('../controllers/post')

router.post('/create', [
    body('caption').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required caption').isString().withMessage('Bad Caption').trim(),
    body('image').optional().isArray({
        min: 1,
        max: 5
    }).withMessage('Required image').custom(value => {
        if (!value.every(i => { return validator.isBase64(i) })) {
            throw false
        }
        return true
    }).withMessage('Bad image')
],
tokenValidator, postController.create)


router.post('/edit', tokenValidator, postController.edit)

router.post('/delete', [
    body('post_id').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required postId').isString().isNumeric().withMessage('Invalid postId')
], 
tokenValidator, postController.delete)


router.post('/like', [
    body('post_id').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required postId').isString().isNumeric().withMessage('Invalid postId')
],
tokenValidator, postController.like)


router.post('/undoLike', [
    body('post_id').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required postId').isString().isNumeric().withMessage('Invalid postId')
], 
tokenValidator, postController.undoLike)

router.post('/comment/write', [
    body('comment_session_id').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required comment_session_id').isString().isNumeric().withMessage('Invalid comment session id'),
    body('content').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required content').isString().withMessage('Invalid content')
],
tokenValidator, postController.writeComment)

router.get('/comment/get', [
    query('comment_session_id').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required comment_session_id').isString().isNumeric().withMessage('Invalid comment_session_id')
],
tokenValidator, postController.getComment)


router.post('/comment/edit', [
    body('comment_session_id').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required comment_session_id').isString().isNumeric().withMessage('Invalid comment_session_id'),
    body('comment_index').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required comment_index').isInt().withMessage('Invalid index'),
    body('content').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required content').isString().withMessage('Invalid content')
],
tokenValidator, postController.editComment)

router.post('/comment/delete', [
    body('comment_session_id').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required comment_session_id').isString().isNumeric().withMessage('Invalid comment_session_id'),
    body('comment_index').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required comment_index').isInt().withMessage('Invalid index')
],
tokenValidator, postController.deleteComment)

router.post('/share', [
    body('share_post_id').exists({ checkNull: true }).not().isEmpty({ ignore_whitespace: true }).withMessage('Required share postId').isString().isNumeric().withMessage('Invalid share postId'),
    body('caption').optional().isString().withMessage('Invalid caption')
], 
tokenValidator, postController.share)

// router.post('/edit', tokenValidator, postController.edit)



// router.post('/share', async (req, res) => {

//     const authToken = await verifyToken(req.body.auth_token);
//     if (!authToken) {
//         return res.send({
//             status: 0,
//             details: "Invalid auth token"
//         })
//     }

//     mysql_connection.query(`INSERT INTO share (user_id, share_id) VALUES ('${authToken.profileId}', '${req.body.post_id}')`, function (err, result) {
//         if (err) {
//             return res.send({
//                 status: 0,
//                 details: 'Error sharing'
//             })
//         }

//         return res.send({
//             status: 1,
//             details: 'Successfully shared'
//         })

//     })

// })




// router.post('/comment', async (req, res) => {
//     const authToken = await verifyToken(req.body.auth_token);
//     if (!authToken) {
//         return res.send({
//             status: 0,
//             details: "Invalid auth token"
//         })
//     }

//     const postType = req.body.post_type
//     const postId = req.body.post_id
//     const content = req.body.content

//     if(!validateInput(postId) || !validateInput(postType) || !validateInput(content)){
//         return res.send({
//             status: 0,
//             details: 'Wrong requested information '
//         })
//     }
//     const commentLoaction = { _id: postId }
//     const writeContent = { $push: { comment: {user_id: authToken.profileId, content: content, timestamp: Date.now() } } }


//     let commentCollection
//     if (postType == 'Post') {
//         commentCollection = 'Post_Comment'
//     } else if (postType == 'Article') {
//         commentCollection = 'Article_Comment'
//     } else if (postType == 'Case') {
//         commentCollection = 'Case_Comment'
//     } else {

//         return res.send({
//             status: 0,
//             details: "Post Type Error"
//         })

//     }

//     mongoGet().collection(commentCollection).updateOne(commentLoaction, writeContent, function (err, result) {
//         if (err) {
//             return res.send({
//                 status: 0,
//                 details: "Error writing comment"
//             })
//         }

//         if(result.modifiedCount == 1){
//             return res.send({
//                 status: 1,
//                 details: 'Successfully write comment'
//             })
//         }else{
//             return res.send({
//                 status: 0,
//                 details: "Error writing comment"
//             })
//         }

//     })


// })

module.exports = router;