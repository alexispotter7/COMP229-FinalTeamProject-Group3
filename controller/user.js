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
    const { username, password,firstName,lastName, email, admin } = req.body    

    // create a new user if does not exist
    const create = (user) => {
        if(user) {
            throw new Error('username exists')
        } else {
            return userModel.create(username, password,firstName,lastName, email, admin)
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



//Get user's profile
exports.getProfile = async (req, res) => {
    const username = req.decoded.username

    const display = (user) => { 
        if(user) {
            return res.json({                
                "firstName": user.firstName,
                "lastName": user.lastName,
                "email": user.email,
                "admin" : user.admin
            })
        } else {
            throw new Error('Error!')
        }
    }  

    userModel.findOneByUsername(username)
    .then(display)    
}


//Update user's profile
exports.updateProfile = async (req, res) => {
    
    // res.json({"The decoded contents?": req.decoded, "The update info that the user tries to update with": req.body} )    
    
    // const test = userModel.findOneByUsername(username)        
    // if(test) {
    //     res.json({"Have we got the damn user?": "yes"})
    // } else {
    //     res.json({"Have we got the damn user?": "no"})
    // }
    
    const username = req.decoded.username
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email    

    // Update the user(document in the DB) with profile info in req.body 
    const update = (user) => { 
        if(user) {
            return userModel.updateOne(user, firstName, lastName, email)            
        } else {
            throw new Error('There is no such username')
        }
    }    

    // respond to the client
    const respond = () => {
        res.json({
            "message": 'Profile Updated successfully'
        })
    }

    // error occured
    const onError = (error) => {
        res.status(403).json({
            "message": error.message
        })
    }    
    
    userModel.findOneByUsername(username)
    .then(update)
    .then(respond)
    .then(onError)        
 }