//database connection
const mysql_connection = require('../database/mysql_connection')
const mongodb_connection = require('../database/mongodb_connection')

module.exports = class UserAuth{

   async save(email,password) {
    return mysql_connection.execute('INSERT INTO user_auth (email, password) VALUES (?,?)', [email, password])
    }

   async addEmailVerification(userId) {
       return mysql_connection.execute('UPDATE user_auth SET email_verification = "1" WHERE id = ?', [userId] )
    }

   async checkAuth(email) {
       return mysql_connection.execute('SELECT id, password, profile_setup FROM user_auth WHERE email = ?', [email])
    }  

   async addProfileSetup(userId) {
      return mysql_connection.execute('UPDATE user_auth SET profile_setup = "1" WHERE id = ?', [userId])
    }

}
