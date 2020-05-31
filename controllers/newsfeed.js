//db connections
const mysql_connection = require('../database/mysql_connection');
const mongodb_connection = require('../database/mongodb_connection')

//validation 
const { validationResult } = require('express-validator')

//utility
const util = require('../util/check-input')

//models
const Newsfeed = require('../models/newsfeed')

module.exports.getPostNewsfeed = async (req, res, next) => {

    let validationErr = validationResult(req)

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg)
        err.status = 0
        next(err)
    }

    const timeFrom = req.query.time_from || null
    const oldOrNew = req.query.old_or_new


    try {

        const newsfeed = new Newsfeed()

        let [postList] = await newsfeed.getPostList(req.decodedToken.profileId, timeFrom, oldOrNew)


        if (postList.length > 0) {

            let postIdArray = postList.map(({ id }) => id);


            let postDetails = await newsfeed.getPostDetails(postIdArray)

            let completePostDetailsArray = [];

            for (let i = 0; i < postDetails.length; i++) {

                let completePostDetails = { ...postDetails[i], ...postList[i] }
                completePostDetailsArray.push(completePostDetails)

            }

            return res.send({
                status: 1,
                details: completePostDetailsArray
            })

        } else {
            return res.json({
                status: 1,
                details: []
            })

        }

    } catch (err) {
        err.status = 0
        next(err)
    }
}


module.exports.getComment = async (req, res, next) => {

    const validationErr = validationResult(req)

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg)
        err.status = 0
        next(err)
    }


    const postId = req.query.post_id
    const postType = req.query.post_type

    try {
        let getCommentResult = await mongodb_connection.get().collection(postType).findOne({ _id: postId })

        if (getCommentResult) {

            let comment = getCommentResult.comment;

            let commentUser = comment.map(({ user_id }) => user_id)

            let [getPpResult] = await mysql_connection.query('SELECT profile_picture, profile_id FROM profile WHERE profile_id IN (?)', [commentUser])

            if (util.validateArray(getPpResult)) {

                let completeCommentArray = []

                for (let i = 0; i < comment.length; i++) {
                    let matchProfile = getPpResult.find(obj => obj.profile_id == comment[i].user_id)
                    completeCommentArray.push({ ...comment[i], ...matchProfile })
                }

                return res.json({
                    status: 1,
                    details: completeCommentArray
                })

            } else {
                return res.send({
                    status: 0,
                    details: "Error getting comment users' profile picture"
                })
            }

        } else {
            let err = new Error('Such PostID was not existed')
            err.status = 0
            next(err)
        }

    } catch (err) {
        err.status = 0
        next(err)
    }

}