import User from "../model/User.js";
import bcryptjs from "bcryptjs"
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const isMatch = await bcryptjs.compare(password, user.password)
        if (!user || !isMatch) {
            return res.status(400).json({ message: "Invalid username and password" })
        } else {
            res.status(200).json({
                message: "Login successfully", user: {
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email
                }
            })
        }
    } catch (error) {
        console.log("Error" + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
