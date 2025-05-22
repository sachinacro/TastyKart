import userModel from "../models/userModel.js"
import jwt from "jsonwebtoken";

//add items to user cart


const addToCart = async (req, res) => {
    try {
        const token = req.headers.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Token required" });
        }

        // Verify token and extract user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const { itemId } = req.body;
        if (!itemId) {
            return res.status(400).json({ success: false, message: "Item ID is required" });
        }

        // Find user
        let userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Initialize or update cart
        let cartData = userData.cartData || {};
        cartData[itemId] = (cartData[itemId] || 0) + 1;

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Item added to cart" });

    } catch (error) {
        console.log("Add to cart error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
// const addToCart = async(req,res)=>{
//     try {
//         let userDate = await userModel.findOne(_id.req.body.userId)
//         let cartData = await userDate.cartDate;
//         if (!cartData[req.body.itemId]) {
//             cartData[req.body.itemId]=1
//         }
//         else{
//             cartData[req.body.itemId] +=1;
//         }
//         await userModel.findByIdAndUpdate(req.body.userId,{cartData});
//        res.json({success:true,message:"Added To Cart"});
//     } catch (error) {
//        console.log(error);
//        res.json({success:false,message:"Error"})
//     }


// }

//remove item from user cart
const removeFromCart = async(req,res)=>{
    try {
        let userData= await userModel.findById(req.body.userId)
        let cartData= await userData.cartData;
        if (cartData[req.body.itemId]>0) {
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData})
        res.json({success:true,message:"Removed From Cart"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//fetch user cart data
const getCart=async(req,res)=>{
     try {
        let userData = await userModel.findById(req.body.userId)
        let cartData= await userData.cartData;
        res.json({success:true,cartData})
     } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
     }
}

export{addToCart,removeFromCart,getCart}