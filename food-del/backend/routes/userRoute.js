import express from 'express';
import { loginUser, registerUser } from '../controllers/userController.js';

const userRouter = express.Router();

// Middleware to validate request data (optional, depending on your needs)
const validateRequest = (req, res, next) => {
    const { name, email, password } = req.body;
    if (!email || !password || (req.path === "/register" && !name)) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    next();
};

userRouter.post("/register", validateRequest, registerUser);
userRouter.post("/login", validateRequest, loginUser);

export default userRouter;

// import express from  'express';
// import { loginUser,registerUser } from '../controllers/userController.js';

// const userRouter=express.Router()

// userRouter.post("/register",registerUser)
// userRouter.post("/login",loginUser)

// export default userRouter;
