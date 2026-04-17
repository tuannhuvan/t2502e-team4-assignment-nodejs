const service = require("../services/project.service");
const notificationSocket = require("../sockets/index");
const notificationService = require("../services/notification.service");
const userService = require("../services/user.service");

exports.create = async (req, res) => {
  try {
    const userId = req.userId || (req.user && req.user._id);
    const data = await service.createProject(req.body, userId);

    await notificationSocket.emitNotification({
      projectId: data._id,
      userId,
      action: "created",
      entityType: "project",
      entityData: data
    });

    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await service.getProjects(req.userId);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.inviteMember = async (req, res) => {
  try {
    const { email, permission } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    const validPermissions = ["admin", "comment", "view"];
    const selectedPermission = validPermissions.includes(permission) ? permission : "view";

    const invitedUser = await userService.getUserByEmail(email.trim().toLowerCase());
    if (!invitedUser) {
      return res.status(404).json({ message: "User not found with @example.com email" });
    }

    const data = await service.inviteProjectMember(req.params.id, invitedUser._id, req.userId, selectedPermission);
    if (!data) {
      return res.status(400).json({ message: "User is already a member or has already been invited to this project." });
    }

    const notification = await notificationService.createNotification({
      recipient: invitedUser._id,
      sender: req.userId,
      type: "project_invite",
      content: `You have been invited to join project "${data.name}" with ${selectedPermission} permission.`,
      link: `/dashboard?inviteProjectId=${data._id}`,
      isRead: false
    });

    notificationSocket.emitToUser(invitedUser._id, {
      title: "Project Invitation",
      message: `You have been invited to join project "${data.name}".`,
      type: "info",
      link: `/dashboard?inviteProjectId=${data._id}`,
      notificationId: notification._id
    });

    res.json({ message: "Invitation sent successfully", project: data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.acceptInvite = async (req, res) => {
  try {
    const data = await service.acceptProjectInvite(req.params.id, req.userId);
    if (!data) {
      return res.status(404).json({ message: "Project invitation not found" });
    }
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.rejectInvite = async (req, res) => {
  try {
    const data = await service.rejectProjectInvite(req.params.id, req.userId);
    if (!data) {
      return res.status(404).json({ message: "Project invitation not found" });
    }
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.cancelInvite = async (req, res) => {
  try {
    const invitedUserId = req.body.userId;
    if (!invitedUserId) {
      return res.status(400).json({ message: "Invited user ID is required" });
    }

    const data = await service.cancelProjectInvite(req.params.id, invitedUserId);
    if (!data) {
      return res.status(404).json({ message: "Pending invite not found" });
    }
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await service.updateProject(req.params.id, req.body, req.userId);

    await notificationSocket.emitNotification({
      projectId: req.params.id,
      userId: req.userId,
      action: "updated",
      entityType: "project",
      entityData: data
    });

    res.json(data);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await service.deleteProject(req.params.id, req.userId);

    await notificationSocket.emitNotification({
      projectId: req.params.id,
      userId: req.userId,
      action: "deleted",
      entityType: "project",
      entityData: { _id: req.params.id, name: "Deleted Project" }
    });

    res.json({ msg: "Deleted" });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};