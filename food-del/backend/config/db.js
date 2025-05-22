import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://prachipandey7898:tsTastyKart1234@cluster0.zobc8.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}