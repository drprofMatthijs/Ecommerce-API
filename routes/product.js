const router = require("express").Router();
const productModel = require("../models/productModel");
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifytoken");

//CREATE PRODUCT BY ADMIN

router.post("/", verifyTokenAndAdmin, async (req,res)=>{
    const newProduct = new productModel(req.body);

    try{
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    }
    catch(err){
        res.status(500).json(err);
    }
})


//UPDATE PRODUCT BY ADMIN

router.put("/:id", verifyTokenAndAdmin, async (req,res) =>{
    try{
        const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true})
        res.status(200).json(updatedProduct)
    }
    catch(err){
        res.status(500).json(err);
    }
})


//DELETE PRODUCT BY ADMIN

router.delete("/:id", verifyTokenAndAdmin, async (req,res)=>{
    try{
        await productModel.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted");
    }
    catch(err){
        res.status(500).json(err);
    }
})

//GET PRODUCT

router.get("/find/:id", async (req,res)=>{
    try{
        const product = await productModel.findById(req.params.id);
        res.status(200).json(product);
    }
    catch(err){
        res.status(500).json(err);
    }
})

//GET ALL PRODUCTS

router.get("/", async (req,res)=>{
    const qNew = req.query.new;
    const qcategory = req.query.category;

    try{
        let products;
        if(qNew){
            products = await productModel.find().sort({createdAt: -1}).limit(5);
        }else if(qcategory){
            products = await productModel.find({categories:{
                $in: [qcategory]
            }})
        }
        else{
            products = await productModel.find();
        }
        res.status(200).json(products);
    }
    catch(err){
        res.status(500).json(err);
    }
})


module.exports = router;