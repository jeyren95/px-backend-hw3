const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/user")

const JWT_SECRET = process.env.JWT_SECRET
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS)
const JWT_EXPIRY = parseInt(process.env.JWT_EXPIRY)

// auth services
module.exports = (db) => {
    const service = {}

    // 1. generate access token
    service.generateToken = (uid) => {
        return jwt.sign({ uid }, JWT_SECRET, {expiresIn: JWT_EXPIRY})
    }
    
    // 2. verify access token
    service.verifyToken = (accessToken) => {
        try {
            const decoded = jwt.verify(accessToken, JWT_SECRET)
            return decoded.uid
        } catch(err) {
            console.log(err)
            return null
        }  
    }
    
    
    // 3. register user
        // find user by username
        // if user not in db => add user to db => generate token => return token
        // if user already in db => return null
    service.registerUser = async (username, password) => {
        const user = await db.findUserByUsername(username)

        if (user) {
            return null 
        } else {
            const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
            const newUser = new User({ username, password_hash: passwordHash })
            const addedUser = await db.insertUser(newUser)

            return service.generateToken(addedUser.id)
        }
    }

    // 4. login user
        // find user by username
        // if user not in db => return null
        // if user in db 
            // if password matches => return access token
            // if password don't match => return null
    service.loginUser = async (username, password) => {
        const user = await db.findUserByUsername(username)

        if (user) {
            const isValid = await bcrypt.compare(password, user.password_hash)
            if (isValid) {
                return service.generateToken(user.id)
            }
        }
        
        return null
    }
    

    return service
}

