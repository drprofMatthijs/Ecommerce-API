const router = require("express").Router();
const userModel = require("../models/userModel");
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifytoken");

//UPDATE USER

router.put("/:id", verifyTokenAndAuthorization, async (req,res) =>{
    if(req.body.password){
        req.body.password = cryptojs.AES.encrypt(req.body.password, process.env.SECRET_PASSWORD_KEY).toString();
    }
    try{
        const updatedUser = await userModel.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true})
        res.status(200).json(updatedUser)
    }
    catch(err){
        res.status(500).json(err);
    }
})


//DELETE USER

router.delete("/:id", verifyTokenAndAuthorization, async (req,res)=>{
    try{
        await userModel.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted");
    }
    catch(err){
        res.status(500).json(err);
    }
})

//GET USER BY ADMIN

router.get("/find/:id", verifyTokenAndAdmin, async (req,res)=>{
    try{
        const user = await userModel.findById(req.params.id);
        const {password, ...others} = user._doc
        res.status(200).json({...others});
    }
    catch(err){
        res.status(500).json(err);
    }
})

//GET ALL USERS BY ADMIN

router.get("/", verifyTokenAndAdmin, async (req,res)=>{
    const query = req.query.new
    try{
        const users = query ? await userModel.find().sort({ _id:-1 }).limit(1) : await userModel.find();
        res.status(200).json(users);
    }
    catch(err){
        res.status(500).json(err);
    }
})

//GET USER STATS


module.exports = router;