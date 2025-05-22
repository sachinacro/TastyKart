// import jwt from "jsonwebtoken";

// const authMiddleware = async (req,res,next) =>{
//     const {token} = req.headers;
//     if (!token) {
//         return res.json({success:false,message:"Not Authorixed Login Again"});
//     }  
//     try {
//         const token_decode = jwt.verify(token,process.env.JWT_SECRET)
//         req.body.userId = token_decode.id;
//         next();
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
        
//     }

//     //token will be convert userid

// }
// export default authMiddleware;

import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized. Please log in again." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.id;
        next();
    } catch (error) {
        console.log("JWT Error:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
        }

        return res.status(401).json({ success: false, message: "Invalid token. Please log in again." });
    }
};

export default authMiddleware;
