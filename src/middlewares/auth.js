// auth middleware - make sure that any requests made by the user is an authenticated user

module.exports = (service) => {
    // middleware has access to the req and res objects => token will be in the headers
    const authMiddleware = (req, res, next) => {
        const authHeader = req.headers.authorization
        const accessToken = authHeader && authHeader.split(" ")[1]

        // if there is an access token => verify token
            // if returns a uid => call next()
            // if no uid, means is the wrong token => send 401 unauthorized
        
        // if no access token => send 401 unauthorized
        if (accessToken) {
            const uid = service.verifyToken(accessToken)
            if (uid !== null) {
                req.uid = uid
                next()
                return
            } 
        }
        res.status(401).send("Unauthorized user")
    }

    return authMiddleware
}