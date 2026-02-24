import User from "../model/User.js";

/* ============================
   📊 GET ALL USERS
============================ */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   📈 GET ADMIN STATISTICS
============================ */
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalRegularUsers = await User.countDocuments({ role: "user" });

    res.json({
      totalUsers,
      totalAdmins,
      totalRegularUsers,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   👤 DELETE USER
============================ */
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent deleting yourself
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   👑 CHANGE USER ROLE
============================ */
export const changeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Prevent changing your own role
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Role updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   🔍 GET USER DETAILS
============================ */
export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   🔐 GET CURRENT ADMIN INFO
============================ */
export const getAdminInfo = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).select("-password");
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};