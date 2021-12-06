const jwt = require('jsonwebtoken')
const config = require('../config') // needs to be hidden

const authMiddleware = (req, res, next) => {
    // read the token from header or url     
    let token = req.headers.authorization
    // console.log("token:  " + token);

    // token does not exist
    if(!token) {
        return res.status(401).json({
            success: false,
            message: 'not logged in'
        })
    }
    
    token = token.split(' ')[1];
    // console.log("split:  " + token);

    // create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, config.secret, (err, decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )

    

    // if it has failed to verify, it will return an error message
    const onError = (error) => {
        res.status(401).json({
            success: false,
            message: error.message
        })
    }

    // process the promise
    p.then((decoded)=>{
        req.decoded = decoded
        next()
    }).catch(onError)
}

module.exports = authMiddleware