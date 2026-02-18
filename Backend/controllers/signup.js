import User from "../model/User.js";
import bcryptjs from "bcryptjs"

export const signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        if(!fullname){
             return res.status(400).json({ message: "User name is required." });
        }
        if(!email){
            return res.status(400).json({ message: "User email is required." });
        }
        if(!password){
            return res.status(400).json({ message: "User password is required." }); 
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password is too weak!" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashPassword = await bcryptjs.hash(password, 10);
        const createdUser = new User({
            fullname: fullname,
            email: email,
            password: hashPassword
        });
        await createdUser.save();
         console.log(createdUser.data);
        res.status(201).json({ message: "User created successfully",
            user: {
                 _id:createdUser._id,
                 fullname:createdUser.fullname,
                 email:createdUser.email,
            },
             
         });
    } catch (error) {
        console.log("Error" + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}