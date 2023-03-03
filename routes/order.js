const router = require("express").Router();
const orderModel = require("../models/orderModel");
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifytoken");

//CREATE ORDER

router.post("/", verifyToken, async (req,res)=>{
    const newOrder = new orderModel(req.body);

    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    }
    catch(err){
        res.status(500).json(err);
    }
})

//UPDATE ORDER BY ADMIN

router.put("/:id", verifyTokenAndAdmin, async (req,res) =>{
    try{
        const updatedOrder = await orderModel.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true})
        res.status(200).json(updatedOrder)
    }
    catch(err){
        res.status(500).json(err);
    }
})


//DELETE ORDER BY ADMIN

router.delete("/:id", verifyTokenAndAdmin, async (req,res)=>{
    try{
        await orderModel.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted");
    }
    catch(err){
        res.status(500).json(err);
    }
})

//GET USER ORDER(S)

router.get("/find/:userid", verifyTokenAndAuthorization, async (req,res)=>{
    try{
        const orders = await orderModel.find({userId: req.params.userid});
        res.status(200).json(orders);
    }
    catch(err){
        res.status(500).json(err);
    }
})

//GET ALL ORDERS BY ADMIN

router.get("/", verifyTokenAndAdmin, async(req,res)=>{
    try{
        const orders = await orderModel.find();
        res.status(200).json(orders);
    }
    catch(err){
        res.status(500).json(err);
    }
})

//ADD STATISTICS FOR ADMINS?


module.exports = router;