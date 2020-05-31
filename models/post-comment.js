//database 
const mongodb_connection = require('../database/mongodb_connection')

module.exports = class PostComment {

    async createSession(commentSessionId) {

        return mongodb_connection.get().collection('Post_Comment').insertOne({ _id: commentSessionId, comment: [] })

    }

    async write(commentSessionId, profileId, content, currentTimestamp) {

        return mongodb_connection.get().collection('Post_Comment').updateOne({ _id: commentSessionId }, { $push: { comment: { profileId: profileId, content: content, createdAt: currentTimestamp, updatedAt: currentTimestamp } } })

    }

    async getBySessionId(commentSessionId) {

        return mongodb_connection.get().collection('Post_Comment').find({ _id: commentSessionId }).toArray()

    }

    async deleteSession (commentSessionId) {

        return mongodb_connection.get().collection('Post_Comment').deleteOne({_id: commentSessionId})
        
    }

    async deleteByIndex(commentSessionId, commentIndex, profileId) {

        return new Promise( async(resolve, reject) => {
            try {

                let removeComment = await mongodb_connection.get().collection('Post_Comment').updateOne({$and: [{ _id: commentSessionId }, { [`comment.${commentIndex}.profileId`] : profileId}] }, { $unset: { [`comment.${commentIndex}`]: 1 } })

                let completelyRemoveComment = await mongodb_connection.get().collection('Post_Comment').updateOne({ _id: commentSessionId}, { $pull: {comment: null}})

                if(removeComment.modifiedCount == 1 && completelyRemoveComment.modifiedCount == 1){
                    resolve('Successfully delete')
                }else{
                    let err = new Error ('Something wrong while deleting comment')
                    reject(err)
                }
                
            } catch (err) {
                reject(err)
            }
        }) 

    }


    async edit (commentSessionId, commentIndex, profileId, content, currentTimestamp) {

        return mongodb_connection.get().collection('Post_Comment').updateOne({$and: [{ _id: commentSessionId }, { [`comment.${commentIndex}.profileId`] : profileId}] }, { $set: { [`comment.${commentIndex}.content`]: content, [`comment.${commentIndex}.updatedAt`]: currentTimestamp } })
    
    }

}