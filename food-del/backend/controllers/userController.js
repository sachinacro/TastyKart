import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Login user
const loginUser = async (req, res) => {
    let { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.json({ success: false, message: "Email and password are required." });
        }

        password = String(password); // 👈 Force password to string

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (typeof user.password !== 'string') {
            return res.json({ success: false, message: "Stored password is invalid." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.log("Login Error:", error);
        res.json({ success: false, message: "Error logging in" });
    }
};


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '24d' }); // valid for 24 hours
  };
  
// Register user
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        // Checking if the user exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User Already Exists!" });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Validate password length (check for at least 8 characters)
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters long" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();

        // Create token
        const token = createToken(user._id);

        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error registering user" });
    }
};

export { loginUser, registerUser };

// import userModel from "../models/userModel.js";
// import jwt from "jsonwebtoken"
// import bcrypt from "bcrypt"
// import validator from "validator"

// //login user
// const loginUser= async(req,res)=>{

// }

// const createToken = (id) =>{
//     return jwt.sign({id},process.env.JWT_SECRET)    //grnrate the tocken
// }

// //register user
// const registerUser= async(req,res)=>{
//     const {name,password,email}= req.body;
//     try {
//         //chechking user exisit
//         const exists=await userModel.findOne({email});
//         if(exists){
//             returnres.json({success:false, message:"User Already Exists!..."});
//         }

//         //vaild email and strong password
//         if(!validator.isEmail()){
//             return res.json({success:false,message:"Please enter a vaild email"})
//         }

//         //strong password
//         if (password.length<8) {
//             return res.json({success:false,message:"Please enter a Strong password"})
//         }

//         //hashing userpassword

//         const salt=await bcrypt.genSalt(10)
//         const hashedPassword= await bcrypt.hash(password,salt);  //solid pass..

//         const newUser= new  userModel({
//             name:name,
//             email:email,
//             password:hashedPassword
//         })

//         const user= await newUser.save()
//         const token = createToken(user._id)
//         res.json({success:true,token})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
//     }
// }

// export {loginUser,registerUser}