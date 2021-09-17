require("dotenv").config()
const db = require("../src/db")

db.initialise()
.then(() => {
    console.log("Successful migration of database")
    process.exit()
})
.catch((err) => {
    console.log("Failed to migrate database")
    console.log(err)
    process.exit(1)
})