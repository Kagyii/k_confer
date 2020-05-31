//database
const mysql_connection = require('../database/mysql_connection')

module.exports = class InterestedField{

    async save(interestedFields) {

        return mysql_connection.query('INSERT INTO interested_field (profile_id, field) VALUES ?', [interestedFields])
    }

    async delete() {
        
    }
}