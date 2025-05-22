import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import { connectDB } from './config/db.js';
import Product from './models/product.model.js';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json()); //allows us to accept json data in res.body.

app.get("/api/products", async (req,res) =>{
    try {
        const allProducts = await Product.find({});
        res.status(200).json({success: true, data:allProducts});

    } catch (error) {
       res.status(400).json({success:false, message: "Products not found"}); 
    }


});

app.post("/api/products", async (req,res) =>{
   const product= req.body;

   if(!product.name || !product.price || !product.image){
    return res.status(400).json({success:false, message: "Please provide all fields"});

   }
   const newProduct = new Product(product);

   try{
    await newProduct.save();
    res.status(200).json({success: true, data: newProduct});
   }catch(error){
    console.log("Error in create product", error.message);
    res.status(500).json({success: false, data: "server error"})
   }

});

app.delete("/api/products/:id", async (req,res) => {
    const {id} = req.params;
    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({success:true, message:"Product is deleted"});
    } catch (error) {
        res.status(400).json({success:false, message: "Please provide unable to delete fields"});
    }
});

app.put("/api/products/:id", async (req,res) => {
      const {id} = req.params;

      const product = req.body;

      try {
        const updateProduct =await Product.findByIdAndUpdate(id,product,{new:true});
        res.status(200).json({success: true, data:updateProduct});
      } catch (error) {
        res.status(400).json({success:false, message:"Unable to update"});
      }
});

console.log(process.env.MONGO_URL)
app.listen(5000, () =>{
    connectDB();
    console.log("server is running in 5000");
});

//NSKhmSOssDXllFJ8