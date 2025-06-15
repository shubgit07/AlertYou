import mongoose from "mongoose";

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  userEmail: String,
  location: String,
  familyContact: String,
  message: String,
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

export default User;