const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: String,
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: { type: String, enum: ["Owner", "Member"] }
  }]
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual property to count members
schema.virtual('membercount').get(function() {
  return this.members.length;
});

module.exports = mongoose.model("Project", schema);