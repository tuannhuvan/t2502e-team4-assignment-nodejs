const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const schema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true, 
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email'] 
  },
  password: { type: String, required: true, select: false },
  fullName: String,
  dob: Date,
  github: String,
  avatar: String,
  role: { type: String, enum: ["Owner", "Member"], default: "Member" },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// Hash password before saving
schema.pre("save", async function() {
  if (!this.isModified("password")) return;
  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
});

// Compare password method
schema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model("User", schema);