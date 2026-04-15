const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  taskOrdersIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task", default: [] }],
  
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: { type: String, enum: ["Owner", "Member"] }
  }],
}, { timestamps: true,
    toJSON: { virtuals: true},
    toObject: { virtuals: true }
 });
// Virtual property để đếm số lượng thành viên trong dự án
schema.virtual("memberCount").get(function() {
  return this.members ? this.members.length : 0;
});

module.exports = mongoose.model("Project", schema);