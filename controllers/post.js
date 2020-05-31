//validation
const { validationResult } = require('express-validator')

//aws
const s3 = require('../aws/s3')

//model 
const Post = require('../models/post')
const PostComment = require('../models/post-comment')
const Profile = require('../models/profile')

module.exports.create = async (req, res, next) => {

    const validationErr = validationResult(req)

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg)
        err.status = 0
        return next(err)
    }

    const caption = req.body.caption;
    const image = req.body.image;
    const postImageBucket = 'k-confer-post'

    const currentTimestamp = Date.now().toString();
    const postId = (Math.floor(Math.random() * 9999999999) + 99999).toString() + currentTimestamp
    const commentSessionId = (Math.floor(Math.random() * 9999999999) + 99999).toString() + currentTimestamp

    let s3ImagePath
    let numberOfImg



    if (image) {

        try {

            s3ImagePath = await s3.uploadImage(image, postImageBucket);

            numberOfImg = s3ImagePath.length

        } catch (err) {
            err.status = 0
            return next(err)
        }

    } else {
        numberOfImg = 0
    }


    try {

        const post = new Post()

        await post.mongodbSave(postId, caption, numberOfImg, currentTimestamp, commentSessionId, s3ImagePath)

        const postComment = new PostComment()

        await postComment.createSession(commentSessionId)

        await post.mysqlSave(req.decodedToken.profileId, postId, commentSessionId, currentTimestamp)

        return res.json({
            status: 1,
            details: 'Post was successfully created '
        })

    } catch (err) {
        err.status = 0
        return next(err)
    }

}


module.exports.like = async (req, res, next) => {

    const validationErr = validationResult(req)

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg)
        err.status = 0
        return next(err)
    }

    const postId = req.body.post_id

    try {

        const post = new Post()

        let likeResult = await post.like(postId, req.decodedToken.profileId)

        if (likeResult.modifiedCount == 1) {

            return res.json({
                status: 1,
                like_condition: true,
                details: 'Successfully like'
            })

        } else {
            let err = new Error('Already like')
            err.status = 0
            return next(err)
        }


    } catch (err) {
        err.status = 0
        return next(err)
    }


}


module.exports.undoLike = async (req, res, next) => {

    const validationErr = validationResult(req)

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg)
        err.status = 0
        return next(err)
    }

    const postId = req.body.post_id

    try {

        const post = new Post()

        let undoLikeResult = await post.undoLike(postId, req.decodedToken.profileId)

        if (undoLikeResult.modifiedCount == 1) {

            return res.json({
                status: 1,
                like_condition: false,
                details: 'Successfully undo like'
            })

        } else {
            let err = new Error('Already undo like')
            err.status = 0
            return next(err)
        }

    } catch (err) {
        err.status = 0
        return next(err)
    }

}

module.exports.edit = async (req, res, next) => {

    const validationErr = validationResult(req)

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg)
        err.status = 0
        return next(err)
    }

}


module.exports.delete = async (req, res, next) => {

    const validationErr = validationResult(req)

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg)
        err.status = 0
        return next(err)
    }

    const postImageBucket = 'k-confer-post'

    try {
        const post = new Post()

        let [[permissionResult]] = await post.checkPermission(req.body.post_id)

        if (permissionResult) {

            if (permissionResult.profile_id == req.decodedToken.profileId) {

                let [mysqlDeleteResult] = await post.mysqlDelete(req.body.post_id)

                let mongodbDeleteResult = await post.mongodbDelete(req.body.post_id)

                let imageArray = mongodbDeleteResult.value.image

                if( imageArray && imageArray.length > 0 ){
                     s3.deleteImages(imageArray, postImageBucket)
                }

                const postComment = new PostComment()

                let cmtSessionDeleteResult = await postComment.deleteSession(permissionResult.comment_session_id)

                if (mysqlDeleteResult.affectedRows == 1 && mongodbDeleteResult.ok == 1 && cmtSessionDeleteResult.deletedCount == 1) {

                    return res.json({
                        status: 1,
                        details: 'Successfully deleted your post'
                    })

                } else {
                    let err = new Error('Error deleting post')
                    err.status = 0
                    return next(err)
                }

            } else {
                let err = new Error('You are not permitted to delete this post')
                err.status = 0
                return next(err)
            }

        } else {
            let err = new Error('Such postId does not exist')
            err.status = 0
            return next(err)
        }


    } catch (err) {
        err.status = 0
        return next(err)
    }

}


module.exports.writeComment = async (req, res, next) => {

    const validationErr = validationResult(req)

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg)
        err.status = 0
        return next(err)
    }


    const commentSessionId = req.body.comment_session_id
    const content = req.body.content
    const currentTimestamp = Date.now().toString()

    try {

        const postComment = new PostComment()

        let writeCommentResult = await postComment.write(commentSessionId, req.decodedToken.profileId, content, currentTimestamp)

        if (writeCommentResult.modifiedCount == 1) {

            return res.json({
                status: 1,
                details: 'Successfully write comment'
            })

        } else {
            let err = new Error('Error writing comment')
            err.status = 0
            return next(err)
        }

    } catch (err) {
        err.status = 0
        return next(err)
    }

}

module.exports.getComment = async (req, res, next) => {

    const validationErr = validationResult(req)

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg)
        err.status = 0
        return next(err)
    }

    try {
        const comment = new PostComment()

        let [getCommentResult] = await comment.getBySessionId(req.query.comment_session_id)

        const commentDetailList = getCommentResult.comment

        let profileIdArray = commentDetailList.map((i) => {
            return i.profileId
        })

        const profile = new Profile()

        let [profileResult] = await profile.getUsernameAndPp(profileIdArray)

        for (let i = 0; i < commentDetailList.length; i++) {

            for (let j = 0; j < profileResult.length; j++) {

                if (profileResult[j].id == commentDetailList[i].profileId) {

                    commentDetailList[i].username = profileResult[j].username
                    commentDetailList[i].profilePicture = profileResult[j].profile_picture
                    break

                }

            }

        }

        return res.json({
            status: 1,
            details: commentDetailList
        })

    } catch (err) {
        err.status = 0
        return next(err)
    }

}


module.exports.editComment = async (req, res, next) => {

    const validationErr = validationResult(req)

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg)
        err.status = 0
        return next(err)
    }

    const currentTimestamp = Date.now().toString()

    try {
        const postComment = new PostComment()

        let cmtEditResult = await postComment.edit(req.body.comment_session_id, req.body.comment_index, req.decodedToken.profileId, req.body.content, currentTimestamp)

        if (cmtEditResult.modifiedCount == 1) {

            return res.json({
                status: 1,
                details: 'Successfully edited your comment'
            })

        } else {
            let err = new Error('Error editing comment')
            err.status = 0
            return next(err)
        }


    } catch (err) {
        err.status = 0
        return next(err)
    }

}

module.exports.deleteComment = async (req, res, next) => {

    const validationErr = validationResult(req)

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg)
        err.status = 0
        return next(err)
    }

    try {

        const postComment = new PostComment()
        let cmtDeleteResult = await postComment.deleteByIndex(req.body.comment_session_id, req.body.comment_index, req.decodedToken.profileId)

        return res.json({
            status: 1,
            details: cmtDeleteResult
        })
    } catch (err) {
        err.status = 0
        return next(err)
    }

}


module.exports.share = async (req, res, next) => {

    const validationErr = validationResult(req)

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg)
        err.status = 0
        return next(err)
    }

    const sharePostId = req.body.share_post_id
    const caption = req.body.caption || null

    const currentTimestamp = Date.now().toString();
    const postId = (Math.floor(Math.random() * 9999999999) + 99999).toString() + currentTimestamp
    const commentSessionId = (Math.floor(Math.random() * 9999999999) + 99999).toString() + currentTimestamp

    try {

        const post = new Post()

        let [[checkPermissionResult]] = await post.checkPermission(sharePostId)

        if (checkPermissionResult) {

            await post.mongodbShare(postId, commentSessionId, caption, sharePostId, currentTimestamp)

            const postComment = new PostComment()

            await postComment.createSession(commentSessionId)

            await post.mysqlShare(postId, req.decodedToken.profileId, commentSessionId, currentTimestamp, sharePostId, checkPermissionResult.profile_id)

            return res.json({
                status: 1,
                details: 'Successfully shared'
            })

        } else {
            let err = new Error('Such share postId does not exist')
            err.status = 0
            return next(err)
        }

    } catch (err) {
        err.status = 0
        return next(err)
    }
}


