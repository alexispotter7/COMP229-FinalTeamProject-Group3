const userModel = require('../models/user')

const adminAuthorization = async (req, res, next) => {

    // read the token from header     
    let token = req.headers.authorization

    // If token does not exist
    if(!token) {
        return res.status(401).json({
            success: false,
            message: 'Token for Authentication is Required.'
        })
    }

    token = token.split(' ')[1];

    jwt.verify(token, config.secret, (err, decoded) => {
        if(err) return res.status(401).json({"message": "Error in Token Verification"})
        
        // The payload is in the "decoded"
        // res.json({"what's in payload": decoded}) // ==> _id, username, firstname, etc ...
        
        req.decoded = decoded
        next()
        
    })
}

module.exports = adminAuthorization;