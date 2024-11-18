import jwt from 'jsonwebtoken'
import { User } from '../schema/userModel.js';
// Middleware to check for JWT token
const authVerify = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return res.status(403).json({ message: "Token is invalid" });
        }
        next();

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Serve Error" })
    }

}


export default authVerify;