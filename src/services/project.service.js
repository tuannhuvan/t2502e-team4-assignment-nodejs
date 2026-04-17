const Project = require("../models/Project");

exports.createProject = async (data, userId) => {
  return await Project.create({
    name: data.name,
    description: data.description,
    owner: userId,
    members: [
      {
        user: userId,
        role: "Owner",
        permission: "admin",
        status: "accepted",
        invitedBy: userId
      }
    ]
  });
};

exports.getProjects = async (userId) => {
  if (userId) {
    return await Project.find({
      $or: [
        { owner: userId },
        { members: { $elemMatch: { user: userId, status: "accepted" } } }
      ]
    }).lean();
  }

  return await Project.find().lean();
};

exports.getLatestProjectWithMembers = async (userId) => {
  const query = userId
    ? {
        $or: [
          { owner: userId },
          { members: { $elemMatch: { user: userId, status: "accepted" } } }
        ]
      }
    : {};

  return await Project.findOne(query)
    .sort({ createdAt: -1 })
    .populate({
      path: "members.user",
      select: "fullName avatar github dob email"
    })
    .lean();
};

exports.getProjectById = async (id) => {
  return await Project.findById(id)
    .populate({
      path: "members.user",
      select: "fullName avatar github dob email"
    })
    .lean();
};

exports.getProjectIfAccessible = async (projectId, userId) => {
  const project = await Project.findById(projectId)
    .populate({
      path: "members.user",
      select: "fullName avatar github dob email"
    })
    .lean();

  if (!project) return null;

  const isOwner = project.owner?.toString() === userId.toString();
  const isAcceptedMember = (project.members || []).some(member => member.user?.toString() === userId.toString() && member.status === "accepted");

  return isOwner || isAcceptedMember ? project : null;
};

exports.getProjectIfPendingInvite = async (projectId, userId) => {
  const project = await Project.findById(projectId)
    .populate({
      path: "members.user",
      select: "fullName avatar github dob email"
    })
    .lean();

  if (!project) return null;

  const isPendingInvite = (project.members || []).some(
    member => member.user?.toString() === userId.toString() && member.status === "pending"
  );

  return isPendingInvite ? project : null;
};

exports.getUserPendingInvites = async (userId) => {
  return await Project.find({
    members: { $elemMatch: { user: userId, status: "pending" } }
  })
    .populate({
      path: "members.user",
      select: "fullName avatar github dob email"
    })
    .lean();
};

exports.rejectProjectInvite = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;

  const memberIndex = project.members.findIndex(member => member.user?.toString() === userId.toString() && member.status === "pending");
  if (memberIndex === -1) return null;

  project.members.splice(memberIndex, 1);
  return await project.save();
};

exports.cancelProjectInvite = async (projectId, invitedUserId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;

  const memberIndex = project.members.findIndex(member => member.user?.toString() === invitedUserId.toString() && member.status === "pending");
  if (memberIndex === -1) return null;

  project.members.splice(memberIndex, 1);
  return await project.save();
};

exports.getProjectMembership = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;

  if (project.owner?.toString() === userId.toString()) {
    return {
      role: "Owner",
      permission: "admin",
      status: "accepted"
    };
  }

  const member = project.members.find(member => member.user?.toString() === userId.toString());
  return member ? member.toObject ? member.toObject() : member : null;
};

exports.userHasProjectAccess = async (projectId, userId) => {
  const membership = await exports.getProjectMembership(projectId, userId);
  return !!membership && membership.status === "accepted";
};

exports.userCanModifyProject = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return false;

  if (project.owner?.toString() === userId.toString()) {
    return true;
  }

  const member = project.members.find(member => member.user?.toString() === userId.toString() && member.status === "accepted");
  return member?.permission === "admin";
};

exports.userCanCommentProject = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return false;

  if (project.owner?.toString() === userId.toString()) {
    return true;
  }

  const member = project.members.find(member => member.user?.toString() === userId.toString() && member.status === "accepted");
  return member && ["admin", "comment"].includes(member.permission);
};

exports.inviteProjectMember = async (projectId, userId, invitedBy, permission = "view") => {
  const project = await Project.findById(projectId);
  if (!project) return null;

  const existingMember = project.members.find(member => member.user?.toString() === userId.toString());
  if (existingMember) {
    return null;
  }

  project.members.push({
    user: userId,
    role: "Member",
    permission,
    status: "pending",
    invitedBy
  });

  return await project.save();
};

exports.acceptProjectInvite = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;

  const member = project.members.find(member => member.user?.toString() === userId.toString() && member.status === "pending");
  if (!member) return null;

  member.status = "accepted";
  return await project.save();
};

exports.updateProject = async (id, data, userId) => {
  const project = await Project.findById(id);
  if (!project) {
    throw new Error("Project not found");
  }

  const canModify = await exports.userCanModifyProject(id, userId);
  if (!canModify) {
    throw new Error("Only project owner or admin can update this project");
  }

  return await Project.findByIdAndUpdate(id, data, { returnDocument: 'after' });
};

exports.deleteProject = async (id, userId) => {
  const project = await Project.findById(id);
  if (!project) {
    throw new Error("Project not found");
  }

  if (project.owner.toString() !== userId.toString()) {
    throw new Error("Only project owner can delete this project");
  }

  return await Project.findByIdAndDelete(id);
};