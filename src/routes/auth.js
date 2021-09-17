const express = require("express")

// need to use DI since there routes are dependent on the users db
module.exports = (service) => {
    const router = express.Router()

    /**
     * @openapi
     * components:
     *      schemas:
     *          User:
     *              type: object
     *              properties:
     *                  username:
     *                      type: string
     *                  password:
     *                      type: string
     */


    // register user route
        // enter details => add to users db => send back access token
    /**
     * @openapi
     * /register:
     *  post:
     *      tags:
     *          - authentication
     *      description: Register a user
     *      requestBody:
     *          required: true
     *          content:
     *              application/json:
     *                  schema:
     *                      $ref: "#/components/schemas/User"
     *      responses:
     *          201: 
     *              description: User has been registered
     *          400:
     *              description: User already exists
     * 
     */
    router.post("/register", async (req, res, next) => {
        const { username, password } = req.body 
        const accessToken = await service.registerUser(username, password)
        
        if (accessToken) {
            res.status(201).send({ accessToken })
        } else {
            res.status(400).send("Sorry, user already exists")
        }
    })


    /**
     * @openapi
     * /login:
     *  post:
     *      tags:
     *          - authentication
     *      description: Login a user
     *      requestBody:
     *          required: true
     *          content:
     *              application/json:
     *                  schema:
     *                      $ref: "#/components/schemas/User"
     *      responses:
     *          200:
     *              description: User has been logged in
     *          400:
     *              description: Invalid credentials
     */

    // login user
    router.post("/login", async (req, res, next) => {
        const { username, password } = req.body 
        const accessToken = await service.loginUser(username, password)

        if (accessToken) {
            res.status(200).send({ accessToken })
        } else {
            res.status(400).send("Sorry, you have input invalid credentials")
        }
    })
      
    return router
}