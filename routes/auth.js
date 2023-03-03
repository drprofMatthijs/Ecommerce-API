const userModel = require("../models/userModel");
const cryptojs = require("crypto-js");
const router = require("express").Router();
const jwt = require("jsonwebtoken");

//REGISTER

router.post("/register", async (req,res)=>{
    const newUser = new userModel({
        username: req.body.username,
        email: req.body.email,
        password: cryptojs.AES.encrypt(req.body.password, process.env.SECRET_PASSWORD_KEY).toString()
    });
    try{
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch(err){
        res.status(500).json(err)
    }
    
})

//LOGIN

router.post("/login", async (req,res)=>{
    try{
        const user = await userModel.findOne({username: req.body.username});
        if (!user){res.status(401).json("Wrong credentials"); return}

        const hashedPassword = cryptojs.AES.decrypt(user.password, process.env.SECRET_PASSWORD_KEY);
        const actualPassword = hashedPassword.toString(cryptojs.enc.Utf8);
        if (actualPassword !== req.body.password){res.status(401).json("Wrong credentials"); return}

        const accessToken = jwt.sign({
            id:user._id, 
            isAdmin: user.isAdmin
        }, process.env.SECRET_JWT_KEY,
        {expiresIn: "3d"});

        const {password, ...others} = user._doc
        res.status(200).json({...others, accessToken});
    }
    catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;