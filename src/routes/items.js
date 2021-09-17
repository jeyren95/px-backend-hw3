const express = require("express")
const Item = require("../models/item")

// need to use DI since these routes are dependent on the items db
module.exports = (db) => {
    const router = express.Router()

    /**
     * @openapi
     *  components:
     *      schemas:
     *          Item:
     *              type: object
     *              properties:
     *                  name:
     *                      type: string
     *                  quantity:
     *                      type: integer
     *      securitySchemes:
     *          BearerAuth:
     *              type: http
     *              scheme: bearer
     *              bearerFormat: JWT
     *              
     */
    

    /**
     * @openapi
     * /items:
     *  get:
     *      tags: 
     *          - items
     *      description: Get all items 
     *      security:
     *          - BearerAuth: []
     *      responses:
     *          200:
     *              description: OK
     *          401:
     *              description: Unauthorized 
     *     
     */
    // 1. Get all items route
    router.get("/", async (req, res, next) => {
        const items = await db.findAllItems()
        res.status(200).send(items)
    })

    /**
     * @openapi
     * /items:
     *  post:
     *      tags:
     *          - items
     *      description: Add an item
     *      security:
     *          - BearerAuth: []
     *      requestBody:
     *          required: true
     *          content:
     *              application/json:
     *                  schema:
     *                      $ref: "#/components/schemas/Item"
     *      responses:
     *          201:
     *              description: Successfully added item   
     *          401:
     *              description: Unauthorized 
     */

    // 2. Insert item route
    router.post("/", async (req, res, next) => {
        const uid = req.uid
        const { name, quantity } = req.body
        const newItem = new Item({ name, quantity, uid })
        const insertedItem = await db.insertItem(newItem)

        res.status(201).send(insertedItem)
    })


    /**
     * @openapi
     * /items/{id}:
     *  get:
     *      tags:
     *          - items
     *      description: Get single item based on item id
     *      security:
     *          - BearerAuth: []
     *      parameters:
     *          - in: path
     *            name: id
     *            schema:
     *              type: integer
     *            required: true
     *      responses:
     *          200: 
     *              description: OK
     *          400:
     *              description: Item not found
     *          401:
     *              description: Unauthorized
     *      
     */

    // 3. Get single item route
    router.get("/:id", async (req, res, next) => {
        const id = req.params.id
        const item = await db.findItem(id)

        if (item) {
            res.status(200).send(item)
        } else {
            res.status(400).send(`Item with id ${id} not found`)
        }
        
    })

    /**
     * @openapi
     * /items/{id}:
     *  put:
     *      tags:
     *          - items
     *      description: Update an item 
     *      security:
     *          - BearerAuth: []
     *      parameters:
     *          - in: path
     *            required: true
     *            name: id
     *            schema:
     *              type: integer
     *      requestBody:
     *          required: true
     *          content:
     *              application/json:
     *                  schema:
     *                      $ref: "#/components/schemas/Item"
     *      responses:
     *          201:
     *              description: Successfully updated item
     *          400:
     *              description: Item not found
     *          401:
     *              description: Unauthorized
     *          403:
     *              description: This item is not allowed to be updated
     *  
     *  
     */

    // 4. Update item route
    router.put("/:id", async (req, res, next) => {
        // retrieve the item to be updated
        const id = req.params.id 
        const itemToUpdate = await db.findItem(id)

        // if uid is not the same as the req.uid => cannot update
        // if same => allow update
        const uid = req.uid

        if (itemToUpdate) {
            if (itemToUpdate.uid === uid) {
                const { name, quantity } = req.body 
                const updatedItem = await db.updateItem(id, new Item({ name, quantity, uid }))     
                
                if (updatedItem) {
                    res.status(200).send(updatedItem)
                }                   
            } else {
                res.status(403).send("Sorry you are not allowed to update this item.")
            }           
        } else {
            res.status(400).send(`Item with id ${id} not found`)
        }

    })

    /**
     * @openapi
     * /items/{id}:
     *  delete:
     *      tags:
     *          - items
     *      description: Delete an item
     *      security: 
     *          - BearerAuth: []
     *      parameters:
     *          - in: path
     *            required: true
     *            name: id
     *            schema:
     *              type: integer
     *      responses:
     *          200:
     *              description: Item succesfully deleted
     *          400:
     *              description: Item not found    
     *          401:
     *              description: Unauthorized
     *  
     */
    // 5. Delete item route
    router.delete("/:id", async (req, res, next) => {
        const id = req.params.id 
        const isDeleted = await db.deleteItem(id)

        if (isDeleted) {
            res.status(200).send(`Successfully deleted item with id ${id}`)
        } else {
            res.status(400).send(`Item with id ${id} not found`)
        }
    })

    return router
}
