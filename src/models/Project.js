const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: String,
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  workflow: {
    type: [
      {
        key: String,
        label: String
      }
    ],
    default: [
      { key: "todo", label: "To Do" },
      { key: "in_progress", label: "In Progress" },
      { key: "done", label: "Done" }
    ]
  },

  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: { type: String, enum: ["Owner", "Member"], default: "Member" },
    permission: { type: String, enum: ["admin", "comment", "view"], default: "comment" },
    status: { type: String, enum: ["pending", "accepted"], default: "pending" },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  }]
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual property to count members
schema.virtual('membercount').get(function() {
  return this.members.length;
});

module.exports = mongoose.model("Project", schema);