import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { 
      type: String, 
      required: true,
      minlength: [8, 'Password must be at least 8 characters long'] // Password length constraint
    },
    cartData: {
      type: Object,
      default: {},
    },
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;

// import mongoose from "mongoose";

// const userSchema=new mongoose.Schema({
//     name:{type:String,required:true},
//     email:{type:String,required:true,unique:true},
//     password:{type:String,required:true},
//     cartData:{type:Object,default:{}}
// },{minimize:false})

// const userModel= mongoose.models.user || mongoose.model("user",userSchema);

// export default userModel;