const router = require("express").Router();
const cartModel = require("../models/cartModel");
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifytoken");

//CREATE CART

router.post("/", verifyToken, async (req,res)=>{
    const newCart = new cartModel(req.body);

    try{
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    }
    catch(err){
        res.status(500).json(err);
    }
})

//UPDATE USER CART

router.put("/:id", verifyTokenAndAuthorization, async (req,res) =>{
    try{
        const updatedCart = await cartModel.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true})
        res.status(200).json(updatedCart)
    }
    catch(err){
        res.status(500).json(err);
    }
})


//DELETE USER CART

router.delete("/:id", verifyTokenAndAuthorization, async (req,res)=>{
    try{
        await cartModel.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted");
    }
    catch(err){
        res.status(500).json(err);
    }
})

//GET USER CART

router.get("/find/:userid", verifyTokenAndAuthorization, async (req,res)=>{
    try{
        const cart = await cartModel.findOne({userId: req.params.userid});
        res.status(200).json(cart);
    }
    catch(err){
        res.status(500).json(err);
    }
})

//GET ALL CARTS BY ADMIN

router.get("/", verifyTokenAndAdmin, async(req,res)=>{
    try{
        const carts = await cartModel.find();
        res.status(200).json(carts);
    }
    catch(err){
        res.status(500).json(err);
    }
})


module.exports = router;