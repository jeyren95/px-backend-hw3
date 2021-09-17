require("dotenv").config()
const bcrypt = require("bcrypt")

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS)
const test_username = "test_username"
const test_password = "test_password"

// mock the db 
const db = {}

db.findUserByUsername = jest.fn(async () => {
    return {
        id: 1,
        username: test_username,
        password_hash: await bcrypt.hash(test_password, SALT_ROUNDS)
    }
})

db.insertUser = jest.fn(async () => {
    return {
        id: 1,
        username: test_username,
        password_hash: await bcrypt.hash(test_password, SALT_ROUNDS)
    }
})

const service = require("./auth")(db)


describe("register user", () => {
    describe("given a username and password", () => {
        test("should return a token", async () => {
            db.findUserByUsername.mockResolvedValueOnce(null)
            const accessToken = await service.registerUser(test_username, test_password)
            expect(accessToken).toBeTruthy()
        })

        test("should return null if user already exists", async () => {
            const accessToken = await service.registerUser(test_username, test_password)
            expect(accessToken).toBeFalsy()
        })
    })
})

describe("login user", () => {
    describe("given a valid username and password", () => {
        test("should return a token", async () => {
            const accessToken = await service.loginUser(test_username, test_password)
            expect(accessToken).toBeTruthy()
        })
    })

    describe("given invalid password", () => {
        test("should return null", async () => {
            const accessToken = await service.loginUser(test_username, "wrong_password")
            expect(accessToken).toBeFalsy()
        })
    })

    describe("given username that does not exist", () => {
        test("should return null", async () => {
            db.findUserByUsername.mockResolvedValueOnce(null)
            const accessToken = await service.loginUser("fake_username", test_password)
            expect(accessToken).toBeFalsy()
        })
    })
})

describe("verify token", () => {
    describe("given a token", () => {
        test("should return a user id if token is valid", async () => {
            const uid = 2 
            const accessToken = await service.generateToken(uid)
            const decodedUid = await service.verifyToken(accessToken)

            expect(decodedUid).toEqual(uid)
        })

        test("should return null if token is invalid", async () => {
            const accessToken = "some_invalid_token"
            const decodedUid = await service.verifyToken(accessToken)

            expect(decodedUid).toBeFalsy()
        })
    })
})