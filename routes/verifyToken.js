const jtw = require("jsonwebtoken");

const verifyToken = (req,res,next) =>{
    const authHeader = req.headers.token
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jtw.verify(token, process.env.SECRET_JWT_KEY, (err,user)=>{
            if(err){return res.status(401).json("You are not authenticated")}
            req.user = user;
            next();
        })
    }
    else{
        return res.status(401).json("You are not authenticated")
    }
}

const verifyTokenAndAuthorization = (req,res,next) =>{
    verifyToken(req,res,() =>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }
        else{
            return res.status(403).json("You are not authorized")
        }
    })
}

const verifyTokenAndAdmin = (req,res,next) =>{
    verifyToken(req,res,() =>{
        if(req.user.isAdmin){
            next()
        }
        else{
            return res.status(403).json("You are not authorized")
        }
    })
}

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}