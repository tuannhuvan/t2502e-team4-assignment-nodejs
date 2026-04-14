const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  fullName: String,
  avatar: String,
  role: { type: String, enum: ["Owner", "Member"], default: "Member" },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// Hash password before saving
schema.pre("save", async function() {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return;

  // Hash password with cost of 12
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