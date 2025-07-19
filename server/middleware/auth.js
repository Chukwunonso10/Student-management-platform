const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) =>{
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith("Bearer ")) return res.status(403).json({ message: "invalid credentials"})
    
    const token = auth.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SIGN)
    req.user = decoded.userId
    next()
}

module.exports = authenticate;
