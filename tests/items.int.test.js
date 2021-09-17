const request = require("supertest");
const utils = require("./utils")
const app = utils.app 
const db = utils.db

let token1;
let token2;
beforeAll(async () => {
    await utils.setup()
    token1 = await utils.registerUser("user_1", "password_1")
    token2 = await utils.registerUser("user_2", "password_2")
})

afterAll(async () => {
    await utils.teardown()
})

describe("GET /items", () => {
    beforeAll(async () => {
        await db.clearItemsTable()
    })

    test("should return an empty array", async () => {
        return request(app)
        .get("/items")
        .set("Authorization", `Bearer ${token1}`)
        .expect(200)
        .then((res) => {
            const items = res.body
            expect(items).toEqual([])
        })
    })

    describe("given some items in db", () => {
        const items = [
            { name: "item_1", quantity: 100},
            { name: "item_2", quantity: 200}
        ]

        beforeAll(async () => {
            await db.clearItemsTable()
            await Promise.all(
                items.map((item) => {
                    return request(app)
                    .post("/items")
                    .set("Authorization", `Bearer ${token1}`)
                    .send(item)
                })
            )
        })

        test("should return all items", async () => {
            return request(app)
            .get("/items")
            .set("Authorization", `Bearer ${token1}`)
            .expect(200)
            .then((res) => {
                const returnedItems = res.body
                // expect items in array to match the items inserted
                expect(returnedItems).toEqual(
                    expect.arrayContaining(
                        items.map((item) => {
                            return expect.objectContaining({
                                name: item.name,
                                quantity: item.quantity
                            })
                        })
                    )
                )
            })
        })
    })
})

describe("POST /items", () => {
    beforeAll(async () => {
        await db.clearItemsTable()
    })

    describe("create an item", () => {
        let id;
        const item = {
            name: "item_1",
            quantity: 100
        }

        test("should return 201", async () => {
            return request(app)
            .post("/items")
            .set("Authorization", `Bearer ${token1}`)
            .send(item)
            .expect(201)
            .then((res) => {
                returnedItem = res.body 
                id = returnedItem.id 
                expect(returnedItem).toMatchObject(item)
            })
        })

        test("should return the item", async () => {
            return request(app)
            .get(`/items/${id}`)
            .set("Authorization", `Bearer ${token1}`)
            .expect(200)
            .then((res) => {
                returnedItem = res.body 
                expect(returnedItem).toMatchObject(item)
            })
        })
    })
})

describe("PUT /items", () => {
    beforeAll(async () => {
        await db.clearItemsTable() 
    })

    describe("update an item", () => {   
        const item1 = {
            name: "item_1",
            quantity: 100
        }

        const updatedItem1 = {
            name: "item_1",
            quantity: 50000
        }
        
        const item2 = {
            name: "item_2",
            quantity: 200
        }

        beforeAll(async () => {
            return request(app)
            .post("/items")
            .set("Authorization", `Bearer ${token1}`)
            .send(item1)
        })

        beforeAll(async () => {
            return request(app)
            .post("/items")
            .set("Authorization", `Bearer ${token2}`)
            .send(item2)
        })

        describe("given the same user", () => {
            test("should return 201", async () => {
                return request(app)
                .put(`/items/1`)
                .set("Authorization", `Bearer ${token1}`)
                .send(updatedItem1)
                .expect(200)
                .then((res) => {
                    const updatedItem = res.body 
                    expect(updatedItem).toMatchObject(updatedItem1)
                })
            })

            test("should return the updated item", async () => {
                return request(app)
                .get("/items/1")
                .set("Authorization", `Bearer ${token1}`)
                .expect(200)
                .then((res) => {
                    const returnedItem = res.body 
                    expect(returnedItem).toMatchObject(updatedItem1)
                })
            })
        })

        describe("given a different user", () => {
            test("should return 403", async () => {
                return request(app)
                .put("/items/2")
                .set("Authorization", `Bearer ${token1}`)
                .expect(403)
            })

            test("should return item that is not updated", async () => {
                return request(app)
                .get("/items/2")
                .set("Authorization", `Bearer ${token1}`)
                .expect(200)
                .then((res) => {
                    const returnedItem = res.body 
                    expect(returnedItem).toMatchObject(item2)
                })
            })
        })
    })
})


describe("DELETE /items", () => {
    beforeAll(async () => {
        await db.clearItemsTable()
    })

    describe("delete an item", () => {
        let id;
        const item = {
            name: "item_1",
            quantity: 100
        }

        beforeAll(async () => {
            return request(app)
            .post("/items")
            .set("Authorization", `Bearer ${token1}`)
            .send(item)
            .expect(201)
            .then((res) => {
                const insertedItem = res.body 
                id = insertedItem.id
            })
        })

        test("should return 200", async () => {
            return request(app)
            .delete(`/items/${id}`)
            .set("Authorization", `Bearer ${token1}`)
            .expect(200)
        })

        test("should return 400 when getting item after deletion", async () => {
            return request(app)
            .get(`/items/${id}`)
            .set("Authorization", `Bearer ${token1}`)
            .expect(400)
        })

        test("should return 400 when trying to delete non-existent item", async () => {
            return request(app)
            .delete(`/items/${id}`)
            .set("Authorization", `Bearer ${token1}`)
            .expect(400)
        })


    })
})