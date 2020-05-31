//database
const mysql_connection = require('../database/mysql_connection')
const mongodb_connection = require('../database/mongodb_connection')

module.exports = class NewsFeed {

    async getPostList(profileId, timeFrom, oldOrNew) {

        if (oldOrNew == 'new') {

            return mysql_connection.execute('SELECT  post.id, post.profile_id, profile.username, profile.profile_picture, post.share_post_id, ref.username as ref_username, ref.profile_picture as ref_profile_picture FROM follower INNER JOIN post ON follower.follower_id = post.profile_id INNER JOIN profile ON profile.id = post.profile_id LEFT JOIN profile as ref ON ref.id = post.ref_profile_id WHERE follower.profile_id = ? AND post.created_at >= ? ORDER BY post.created_at DESC LIMIT 20', [profileId, timeFrom])

        } else if (oldOrNew == 'old') {

            return mysql_connection.execute('SELECT  post.id, post.profile_id, profile.username, profile.profile_picture, post.share_post_id, ref.username as ref_username, ref.profile_picture as ref_profile_picture FROM follower INNER JOIN post ON follower.follower_id = post.profile_id INNER JOIN profile ON profile.id = post.profile_id LEFT JOIN profile as ref ON ref.id = post.ref_profile_id WHERE follower.profile_id = ? AND post.created_at <= ? ORDER BY post.created_at DESC LIMIT 20', [profileId, timeFrom])
            
        } else if(oldOrNew == 'neither'){

            return mysql_connection.execute('SELECT post.id, post.profile_id, profile.username, profile.profile_picture, post.share_post_id, ref.username as ref_username, ref.profile_picture as ref_profile_picture FROM follower INNER JOIN post ON follower.follower_id = post.profile_id INNER JOIN profile ON profile.id = post.profile_id LEFT JOIN profile as ref ON ref.id = post.ref_profile_id WHERE follower.profile_id = ? ORDER BY post.created_at DESC LIMIT 20', [profileId])

        }
    }

    async getPostDetails(postIdArray) {

        return mongodb_connection.get().collection('Post').find({ _id: { $in: postIdArray } }).sort( { created_at: -1 } ).toArray()

    }

}