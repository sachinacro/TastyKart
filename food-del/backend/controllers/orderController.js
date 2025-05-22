import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";

// Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// const placeOrder = async (req, res) => {
//     const frontend_url = "http://localhost:5173";

//     try {
//         // Step 1: Save Order to DB
//         const newOrder = new orderModel({
//             userId: req.body.userId,
//             items: req.body.items,
//             amount: req.body.amount,
//             address: req.body.address,
//             paymentStatus: "pending"
//         });

//         await newOrder.save();

//         // Step 2: Clear User's Cart (assuming you want to clear it)
//         await userModel.findByIdAndUpdate(req.body.userId, { cartData: [] });

//         // Step 3: Create Razorpay Order
//         const options = {
//             amount: req.body.amount * 100, // Amount in paise
//             currency: "INR",
//             receipt: `order_rcptid_${newOrder._id}`,
//         };

//         const razorpayOrder = await razorpay.orders.create(options);

//         // Step 4: Send Razorpay Order details to frontend
//         res.json({
//             success: true,
//             orderId: razorpayOrder.id,
//             amount: razorpayOrder.amount,
//             currency: razorpayOrder.currency,
//             razorpayKey: process.env.RAZORPAY_KEY_ID,
//             newOrderId: newOrder._id,
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// };

const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";

    try {
        // Calculate estimated delivery time (e.g., 30 minutes from now)
        const deliveryTime = new Date();
        deliveryTime.setMinutes(deliveryTime.getMinutes() + 30);  // Adding 30 minutes to current time (you can adjust this as needed)

        // Step 1: Save Order to DB
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            paymentStatus: "pending",
            deliveryTime: deliveryTime  // Save the calculated delivery time
        });

        await newOrder.save();

        // Step 2: Clear User's Cart (assuming you want to clear it)
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: [] });

        // Step 3: Create Razorpay Order
        const options = {
            amount: req.body.amount * 100, // Amount in paise
            currency: "INR",
            receipt: `order_rcptid_${newOrder._id}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // Step 4: Send Razorpay Order details along with deliveryTime to frontend
        res.json({
            success: true,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            razorpayKey: process.env.RAZORPAY_KEY_ID,
            newOrderId: newOrder._id,
            deliveryTime: deliveryTime // Send the delivery time to frontend
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const verifyOrder = async(req,res)=>{
    const {orderId,success}= req.body;
    try {
        if (success =="true") {
            await orderModel.findByIdAndUpdate(orderId,{payment:true})
            res.json({success:true , message:"Paid"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false,message:"Not Paid"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
}

const userOrders = async(req,res)=>{
    try {
        const orders= await orderModel.find({userId:req.body.userId})
        res.json({success:true, data: orders})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

const listOrders = async (req, res) => {
    try {
      const orders = await orderModel.find({});
      res.json({ success: true, data: orders });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: "Error fetching orders" });
    }
  };

//api for updating order status
const updateStatus = async(req,res)=>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true, message:"status updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}
  
const updateDeliveryTime = async (req, res) => {
    try {
      const { orderId, deliveryTime } = req.body;
  
      await orderModel.findByIdAndUpdate(orderId, { deliveryTime });
      res.json({ success: true, message: "Delivery time updated successfully" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Failed to update delivery time" });
    }
  };
  
export { placeOrder,verifyOrder,userOrders,listOrders,updateStatus,updateDeliveryTime };


// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import Razorpay from "razorpay";

// //Placing user order for fronend
// // Key Id := rzp_test_HhWhYhg9mE0cgn
// // Key RAZORPAY_SECRET := Rm5Sb7y2uv5iss9EjhIbfUU0

// const razorpay = new Razorpay(process.env.RAZORPAY_SECRET_KEY)

// const placeOrder= async(req,res)=>{

//     const frontend_url = "http://localhost:5173"

//     try {
//         const newOrder = new orderModel({
//             userId:req.body.userId,
//             items:req.body.items,
//             amount:req.body.amount,
//             address:req.body.address
//         })
//         await newOrder.save();
//         await userModel.findByIdAndDelete(req.body.userId,{cartData:{}});

//         const line_items= req.body.items.map((item)=>({
//             price_data:{
//                 currency:"inr",
//                 product_data:{
//                     name:item.name
//                 },
//                 unit_amount:item.price*100*85
//             },
//             quantity:item.quantity

//         }))

//         line_items.push({
//             price_data:{
//                 currency:"inr",
//                 product_data:{
//                     name:"Delivery Charges"
//                 },
//                 unit_amount:2*100*85
//             },
//             quantity :1
//         })

//         const session = await razorpay.checkout.sessions.create({
//             line_items: line_items,
//             mode:'payment',
//             success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//             cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
//         })

//         res.json({success:true, session_url:session.url})

//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"internal server error"})
//     }

// }
// export {placeOrder}