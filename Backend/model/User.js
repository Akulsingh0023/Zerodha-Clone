// import mongoose from "mongoose";

// const userSchema = mongoose.Schema({
//     fullname: {
//         type:String,
//         required:true,
//     },
//     email: {
//         type:String,
//         required:true,
//         unique:true,
//     },
//     password: {
//         type:String,
//         required:true,
//     },
// });

// const User = mongoose.model("User",userSchema);

// export default User;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // 🔐 Role Based Access
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // 🔐 Forgot Password
    resetToken: {
      type: String,
      default: null,
    },

    resetTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;