import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"

// app config 
const app = express()
const port = 4000

// middleware
app.use(express.json())
app.use(cors())

// db connection
connectDB();

// API endpoints
app.use("/api/food", foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/",(req,res)=>{
    res.send("API Working")
})

// to run the express server
app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})












/*
post : http://localhost:4000/api/user/login
{
    "email":"test1@gmail.com",
    "password":12345678
}

get : http://localhost:4000/api/user/list

post : http://localhost:4000/api/cart/add
row {
   "itemId":"67f3d1b0eaa67d3572492563"
}
   header   token value

post : http://localhost:4000/api/cart/remove
row {
   "itemId":"67f3d1b0eaa67d3572492563"
}
   header   token value


   post http://localhost:4000/api/cart/get
   header token value
 */
