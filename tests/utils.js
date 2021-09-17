// re-usable code for the integrated tests
require("dotenv").config({ path: ".env.test" })

// supertest is used to test http routes
const db = require("../src/db")
const authService = require("../src/services/auth")(db)
const authMiddleware = require("../src/middlewares/auth")(authService)

const router = require("../src/routes")(db, authService, authMiddleware)
const app = require("../src/app")(router)

const utils = {}

utils.db = db
utils.app = app

// setup the db
utils.setup = async () => {
    await db.initialise()
    await db.clearUsersTable()
    await db.clearItemsTable()
}

// teardown the db 
utils.teardown = async () => {
    await db.end()
}

// register a user
utils.registerUser = async (username, password) => {
    const accessToken = await authService.registerUser(username, password)
    return accessToken
}

module.exports = utils

