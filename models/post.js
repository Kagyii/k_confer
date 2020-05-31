//database
const mongodb_connection = require('../database/mongodb_connection')
const mysql_connection = require('../database/mysql_connection')

module.exports = class Post{

    async mongodbSave(postId, caption, numberOfImg, currentTimestamp, commentSessionId, s3ImagePath) {

        let postDoc 

        if (numberOfImg == 1) {
            postDoc = { _id: postId, caption: caption, image: s3ImagePath, like: [], postInfo: 'caption_image', type: 'Post', commentSessionIdRef: commentSessionId, createdAt: currentTimestamp, updatedAt: currentTimestamp };
        } else if (numberOfImg > 1) {
            postDoc = { _id: postId, caption: caption, image: s3ImagePath, like: [], postInfo: 'caption_images', type: 'Post', commentSessionIdRef: commentSessionId, createdAt: currentTimestamp, updatedAt: currentTimestamp };
        }else if(numberOfImg == 0){
            postDoc = { _id: postId, caption: caption, like: [], postInfo: 'caption', type: 'Post', commentSessionIdRef: commentSessionId, createdAt: currentTimestamp, updatedAt: currentTimestamp };
        }

        return mongodb_connection.get().collection('Post').insertOne(postDoc)
    }

    async mysqlSave(profileId, postId, commentSessionId, currentTimestamp) {

        return mysql_connection.execute('INSERT INTO post (id, profile_id, comment_session_id,created_at) VALUES ( ? , ? , ? , ?)', [postId, profileId, commentSessionId,currentTimestamp]) 
    
    }

    async checkPermission (postId) {

        return mysql_connection.execute('SELECT profile_id, comment_session_id FROM post WHERE id = ?', [postId])

    }

    // async edit(postId, caption, removeImage, newImage, currentTimestamp) {

    //     return mongodb_connection.get().collection('Post').updateOne({_id : postId})

    // }

    async mongodbDelete (postId) {

        return mongodb_connection.get().collection('Post').findOneAndDelete({_id: postId})

    }

    async mysqlDelete (postId) {

        return mysql_connection.execute('DELETE FROM post WHERE id = ?', [postId])

    }

    async mysqlShare (postId, profileId, commentSessionId, currentTimestamp, sharePostId, refProfileId) {

        return mysql_connection.execute('INSERT INTO post (id, profile_id, comment_session_id, created_at, share_post_id, ref_profile_id) VALUES (?, ?, ?, ?, ?, ?)', [postId, profileId, commentSessionId, currentTimestamp, sharePostId, refProfileId])

    }

    async mongodbShare(postId, commentSessionId, caption, sharePostId, currentTimestamp) {

        let postInfo = (caption) ? 'caption' : 'no-caption'

        const postDoc = { _id: postId, caption: caption, like: [], postInfo: postInfo , type: 'Post', commentSessionIdRef: commentSessionId, sharePostId: sharePostId, createdAt: currentTimestamp, updatedAt: currentTimestamp }

        return mongodb_connection.get().collection('Post').insertOne(postDoc)

    }

    async like(postId, profileId) {

        return mongodb_connection.get().collection('Post').updateOne( { _id: postId }, { $addToSet: { like: profileId } })
        
    }

    async undoLike(postId, profileId) {

        return mongodb_connection.get().collection('Post').updateOne({ _id: postId }, { $pull: { like: profileId } })
        
    }

}