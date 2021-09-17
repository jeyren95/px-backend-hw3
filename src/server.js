require("dotenv").config()

const db = require("./db")
const authService = require("./services/auth")(db)
const authMiddleware = require("./middlewares/auth")(authService)

const router = require("./routes")(db, authService, authMiddleware)
const app = require("./app")(router)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})