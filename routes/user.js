const { Router } = require("express");
const User = require("../models/user");

const router = Router();

// add new user
router.post("/register", async (req, res) => {
  const { username, displayName, firstName, lastName, age, email, role } = req.body;

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ $or: [{ username }] });
    
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    // Create a new user
    const newUser = new User({
      username,
      displayName,
      firstName,
      lastName,
      age,
      email,
      role
    });

    // Save the user to the database
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//show user details
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// update user
router.patch("/update", async (req, res) => {
  const { userId, username, displayName, firstName, lastName, age, email } = req.body;
  try {


    // Find the user by ID and update the provided fields
    const user = await User.findByIdAndUpdate(userId, {
      $set: {
        username,
        displayName,
        firstName,
        lastName,
        age,
        email
      }
    }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User details updated successfully", user });
  } catch (error) {
    console.error("Error during user update:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Delete user
router.delete("/delete/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID and delete
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error during user deletion:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
