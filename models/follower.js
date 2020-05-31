//datebase
const mysql_connection = require('../database/mysql_connection')


module.exports = class Follower{

   async follow(followerId, profileId) {
        return mysql_connection.execute('INSERT INTO follower (follower_id, profile_id) VALUES (?,?)',[followerId, profileId])
   }

   async getFollower(profileId) {
        return mysql_connection.execute('SELECT follower_id FROM follower WHERE profile_id = ?', [profileId])
   }

   async unfollow(followerId, profileId) {
        return mysql_connection.execute('DELECT FROM follower WHERE follower_id = ? AND profile_id = ?', [followerId, profileId])
   }

   async getFollowing(followerId) {
        return mysql_connection.execute('SELECT profile_id FROM follower WHERE follower_id = ?', [followerId])
   }

   async getFollowerCount(profileId) {
     return mysql_connection.execute('SELECT COUNT (*) as followerCount FROM follower WHERE profile_id = ?', [profileId])
   }

   async getFollowingCount(followerId) {
     return mysql_connection.execute('SELECT COUNT (*) as followingCount FROM follower WHERE follower_id = ?', [followerId])
   }

}