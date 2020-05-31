const mysql_connection = require('../database/mysql_connection')

module.exports = class Profile{

    async save(profileId, username, gender, dateOfBirth, country, accountType, userId) {
       return mysql_connection.execute('INSERT INTO profile (id, username, gender, date_of_birth, country, account_type, user_id) VALUES (?,?,?,?,?,?,?)',
        [profileId, username, gender, dateOfBirth, country, accountType, userId])
    }

    async setup(university, hometown, speciality, work, workplace, profilePicture, studentYear, profileId) {
       return mysql_connection.execute('UPDATE profile SET university = ?, hometown = ?, speciality = ?, profile_picture = ?, student_year = ? WHERE user_id = ?',
        [university, hometown, speciality, profilePicture, studentYear, profileId])
    }
    
    // edit() {
    //     mysql_connection.execute('UPDATE profile SET username, gender, date_of_birth, hometown, country, account_type, speciality, university, work, workplace, profile_picture, student_year, user_id, p')
    // }

    async getByUid(userId) {
        return mysql_connection.execute('SELECT id, username, gender, date_of_birth, country, account_type, profile_picture, university, hometown, speciality, student_year FROM profile WHERE user_id = ?', [userId])
    }

    async getByPid(profileId){
        return mysql_connection.execute('SELECT id, username, gender, date_of_birth, country, account_type, profile_picture, university, hometown, speciality, student_year FROM profile WHERE id = ?', [profileId])
    }

    async getUsernameAndPp (profileIdArray) {
        return mysql_connection.query('SELECT id, username, profile_picture FROM profile WHERE id IN (?)', [profileIdArray])
    }
}

//SELECT profile.username, COUNT(follower.follower_id) as NumberOfFollower FROM profile RIGHT JOIN follower ON follower.profile_id = profile.id WHERE profile.id = '1813688261583150655511';