// connect pool to the db
const { Pool } = require("pg")
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const db = {...require("./items")(pool), ...require("./users")(pool)}

// Initialise tables
db.initialise = async () => {
    await pool.query(
        `CREATE TABLE IF NOT EXISTS Users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(100) NOT NULL,
            password_hash VARCHAR(200) NOT NULL
        )`
    )

    await pool.query(
        `CREATE TABLE IF NOT EXISTS Items (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            quantity INTEGER NOT NULL,
            uid INTEGER NOT NULL,
            FOREIGN KEY (uid) REFERENCES Users(id) ON DELETE CASCADE
        )`
    )
}

db.end = async () => {
    await pool.end()
}


db.clearUsersTable = async () => {
    await pool.query(`DELETE FROM Users`)
    await pool.query(`ALTER SEQUENCE users_id_seq RESTART`)
}

db.clearItemsTable = async () => {
    await pool.query(`DELETE FROM Items`)
    await pool.query(`ALTER SEQUENCE items_id_seq RESTART`)
}

module.exports = db