const request = require("supertest")
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

describe("GET /{uid}/items", () => {
    beforeAll(async () => {
        await db.clearItemsTable()
    })

    describe("get items of a particular user", () => {
        test("should return an empty array", async () => {
            return request(app)
            .get("/users/1/items")
            .set("Authorization", `Bearer ${token1}`)
            .expect(200)
            .then((res) => {
                const returnedItems = res.body 
                expect(returnedItems).toEqual([])
            })
        })
    })

    describe("given some items in db", () => {
        const items = [
            {name: "item_1", quantity: 100},
            {name: "item_2", quantity: 200}
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

        test("should return all items that were added by the user", async () => {
            return request(app)
            .get("/users/1/items")
            .set("Authorization", `Bearer ${token1}`)
            .expect(200)
            .then((res) => {
                const returnedItems = res.body 
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

        test("should return an empty array if items were not added by the user", async () => {
            return request(app)
            .get("/users/2/items")
            .set("Authorization", `Bearer ${token2}`)
            .expect(200)
            .then((res) => {
                const returnedItems = res.body 
                expect(returnedItems).toEqual([])
            })
        })
    })
}) 
