const express = require("express")

module.exports = (db) => {
    const router = express();

    /**
     * @openapi
     * /users/{uid}/items:
     *  get:
     *      description: Get all items of a particular user id
     *      tags:
     *          - users
     *      security:
     *          - BearerAuth: []
     *      parameters:
     *          - in: path
     *            name: uid
     *            schema:
     *              type: integer
     *            required: true
     *            description: User id
     *      responses:
     *          200:
     *              description: OK
     *          401:
     *              description: Unauthorized
     * 
     */
    router.get("/:uid/items", async (req, res, next) => {
        const uid = req.params.uid
        const items = await db.findItemsByUser(uid)

        
        res.status(200).send(items)

    })

    return router
}