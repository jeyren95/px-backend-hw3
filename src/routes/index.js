const express = require("express")
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

module.exports = (db, authService, authMiddleware) => {
    const router = express.Router()

    // swagger docs
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Backend Service API documentation",
                version: "1.0.0"
            },
        }, 
        apis: ["./src/routes/*.js"]
    }
    const swaggerSpec = swaggerJsdoc(options)
    router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))


    // home route
    /**
     * @openapi
     * /:
     *  get:
     *      description: Default home route
     *      responses:
     *          200:
     *              description: OK
     */

    router.get("/", (req, res, next) => {
        res.status(200).send("Hello world!")
    })

    // auth routes
    router.use("/", require("./auth")(authService))

    // auth middleware to be placed here
    // make sure that the items route uses the auth middleware to confirm that the user is authenticated
    router.use(authMiddleware)

    // item routes
    router.use("/items", require("./items")(db))

    // user routes
    router.use("/users", require("./users")(db))

    return router
}


