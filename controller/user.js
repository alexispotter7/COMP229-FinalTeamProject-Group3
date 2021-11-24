const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../config'); // needs to be hidden


const { OK, NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR, CREATED, NO_CONTENT } = require('http-status-codes');


exports.getAllUsers = (req, res) => {
    userModel.find((err, users) => {
        if (err) return res.status(INTERNAL_SERVER_ERROR).json({ "error": err.message })
        res.status(OK).json(users)
    })
}

exports.singup = (req, res) => {
    const { username, password,firstName,lastName, email } = req.body
    let newUser = null

    // create a new user if does not exist
    const create = (user) => { // where the hell is this user from?
        if(user) {
            throw new Error('username exists')
        } else {
            return userModel.create(username, password,firstName,lastName, email)
        }
    }    

    // respond to the client
    const respond = () => {
        res.json({
            message: 'signed up successfully'            
        })
    }

    // run when there is an error (username exists)
    const onError = (error) => {
        res.status(409).json({
            message: error.message
        })
    }

    // check username duplication
    userModel.findOneByUsername(username)
    .then(create)    
    .then(respond)
    .catch(onError)
}



exports.signin = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;    

    // check the user info & generate the jwt
        // check the user info & generate the jwt
    const check = (user) => {
        if(!user) {
            // user does not exist
            throw new Error('signin failed: Such username doesnt exist')
        } else {
            // user exists, check the password            
            if(user.verify(password)) {
                // create a promise that generates jwt asynchronously
                const p = new Promise((resolve, reject) => {
                    jwt.sign(
                        {
                            _id: user._id,
                            username: user.username,
                            firstName: user.firstName                            
                        }, 
                        config.secret,
                        {
                            expiresIn: '1d',
                            issuer: 'Group3'
                        },
                        (err, token) => {
                            if (err) reject(err)
                            resolve(token) 
                        })
                })
                return p
            } else {
                throw new Error('signin failed')
            }
        }
    }

    // respond the token 
    const respond = (token) => {
        res.json({
            message: 'logged in successfully',
            token
        })
    }

    // error occured
    const onError = (error) => {
        res.status(403).json({
            message: error.message
        })
    }

    // find the user
    userModel.findOneByUsername(username)
    .then(check)
    .then(respond)
    .catch(onError)

}





exports.check = (req, res) => {
    // read the token from header or url 
    const token = req.headers['x-access-token'] || req.query.token

    // token does not exist
    if(!token) {
        return res.status(403).json({
            success: false,
            message: 'not logged in'
        })
    }

    // create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, config.secret, (err, decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )

    // if token is valid, it will respond with its info
    const respond = (token) => {
        res.json({
            success: true,
            info: token
        })
    }

    // if it has failed to verify, it will return an error message
    const onError = (error) => {
        res.status(403).json({
            success: false,
            message: error.message
        })
    }

    // process the promise
    p.then(respond).catch(onError)
}


