const utils = require("./utils")
const request = require("supertest")

const app = utils.app 
const db = utils.db

const test_username = "test_username"
const test_password = "test_password"

beforeAll(async () => {
    await utils.setup()
})

afterAll(async () => {
    await utils.teardown()
})


// 1. home route
describe("GET /", () => {
    test("should return home page", async () => {
        return request(app)
        .get("/")
        .expect(200)
    })
})


// 2. register route
describe("POST /register", () => {  
    beforeAll(async () => {
        await db.clearUsersTable()
    })

    describe("given username and password", () => {
        test("should return an access token", async () => {
            return request(app)
            .post("/register")
            .send({ username: test_username, password: test_password })
            .expect(201)
            .then((res) => {
                const accessToken = res.body.accessToken
                expect(accessToken).toBeTruthy()
            })
        })

        test("should return null if user already exists", async () => {
            return request(app)
            .post("/register")
            .send({ username: test_username, password: test_password })
            .expect(400)
            .then((res) => {
                const accessToken = res.body.accessToken
                expect(accessToken).toBeFalsy()
            })
        })
    })
})


// 3. login route
describe("POST /login", () => {
    // register a user first
    beforeAll(async () => {
       await db.clearUsersTable()
       await utils.registerUser(test_username, test_password)
    })
    
    describe("given valid credentials", () => {
        test("should return access token", async () => {
            return request(app)
            .post("/login")
            .send({ username: test_username, password: test_password })
            .expect(200)
            .then((res) => {
                const accessToken = res.body.accessToken
                expect(accessToken).toBeTruthy()
            })
        })

        test("should return error message if credentials are invalid", async () => {
            return request(app)
            .post("/login")
            .send({ username: "some_fake_username", password: test_password })
            .expect(400)
            .then((res) => {
                const accessToken = res.body.accessToken
                expect(accessToken).toBeFalsy()
            })
        })
    })
})
