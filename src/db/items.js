const Item = require("../models/item")

module.exports = (pool) => {
    const db = {}
    
    // db queries
    // 1. Get all items
    db.findAllItems = async () => {
        const res = await pool.query(
            `SELECT * FROM Items`
        )
        return res.rows.map((row) => new Item(row))
    }

    // 2. Get all items by user id
    db.findItemsByUser = async (uid) => {
        const res = await pool.query(
            `SELECT * FROM Items WHERE uid=$1`,
            [uid]
        )
        return res.rows.map((row) => new Item(row))
    }

    // 3. Insert item
    db.insertItem = async (item) => {
        const res = await pool.query(
            `INSERT INTO Items (name, quantity, uid) 
            VALUES ($1, $2, $3) RETURNING *`,
            [item.name, item.quantity, item.uid]
        )
        // res.rowCount is the number of rows that were updated
        // res.rows is an array of the rows that were updated
        return res.rowCount ? new Item(res.rows[0]) : null
    }

    // 4. Get item
    db.findItem = async (id) => {
        const res = await pool.query(
            `SELECT * FROM Items WHERE id=$1`,
            [id]
        )
        return res.rowCount ? new Item(res.rows[0]) : null
    }

    // 5. Update item
    db.updateItem = async (id, item) => {
        const res = await pool.query(
            `UPDATE Items SET name=$2, quantity=$3, uid=$4 WHERE id=$1 RETURNING *`,
            [id, item.name, item.quantity, item.uid]
        )
        return res.rowCount ? new Item(res.rows[0]) : null
    }

    // 6. Delete item
    db.deleteItem = async (id) => {
        const res = await pool.query(
            `DELETE FROM Items WHERE id=$1`,
            [id]
        )
        return res.rowCount > 0
    }

    return db
}


