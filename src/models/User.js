const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  fullName: { type: String, required: true },
  dob: Date,
  github: String,
  avatar: { type: String, default: "https://via.placeholder.com/150" },
  role: { type: String, enum: ["Owner", "Member"], default: "Member" },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// Hash password before saving
schema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// So sánh mật khẩu khi đăng nhập
schema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", schema);