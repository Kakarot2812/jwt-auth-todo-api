const jwt = require("jsonwebtoken");

function middleware(req,res,next){
    const token = req.headers.token;
    const decoded = jwt.verify(token,"Nitesh123");

    if(decoded.userId ){
        req.userId = parseInt(decoded.userId);
        next()
    }
    else{
        res.status(403).json({
            message: "Token invalid or not found"
        })
    }
}

module.exports = {
    middleware: middleware
}