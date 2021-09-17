const { getMockReq, getMockRes } = require("@jest-mock/express")
const e = require("express")

// mock the service
const service = {}
service.verifyToken = jest.fn()

const authMiddleware = require("./auth")(service)

describe("authentication middleware", () => {
    describe("given an access token", () => {
        let req;
        beforeEach(() => {
            req = getMockReq()
            req.headers.authorization = "Bearer some_access_token"
        })

        test("should call next if access token is valid", async () => {
            service.verifyToken.mockReturnValueOnce(1)
            const {res, next} = getMockRes()

            authMiddleware(req, res, next)
            expect(next).toBeCalled()
        })

        test("should return 401 if access token is invalid", async () => {
            service.verifyToken.mockReturnValueOnce(null)
            const {res, next} = getMockRes()

            authMiddleware(req, res, next)
            expect(next).not.toBeCalled()
            expect(res.status).toBeCalledWith(401)
        })
    })

    describe("given no access token", () => {
        test("should return 401", async () => {
            const req = getMockReq()
            const {res, next} = getMockRes()

            // shows that even if we purposely verify the token, next is still not called
            service.verifyToken.mockReturnValueOnce(1)

            authMiddleware(req, res, next)
            expect(next).not.toBeCalled()
            expect(res.status).toBeCalledWith(401)

        })
    })

})