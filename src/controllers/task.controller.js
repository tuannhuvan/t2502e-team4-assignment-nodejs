const service = require("../services/task.service");
const projectService = require("../services/project.service");
const notificationSocket = require("../sockets/index");
const notificationService = require("../services/notification.service");
const userService = require("../services/user.service");

exports.create = async (req, res) => {
  try {
    const { projectId } = req.body;
    if (!projectId) {
      return res.status(400).json({ message: "Project is required" });
    }

    const canCreate = await projectService.userCanModifyProject(projectId, req.userId);
    if (!canCreate) {
      return res.status(403).json({ message: "Only project owner or admin can create tasks in this project" });
    }

    const taskData = {
      ...req.body,
      assignee: req.body.assigneeId,
      createdBy: req.userId
    };

    const data = await service.createTask(taskData);
    res.json(data);
  } catch (error) {
    console.error("Task create error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getByProject = async (req, res) => {
  try {
    const data = await service.getTasksByProject(req.params.projectId);
    res.json(data);
  } catch (error) {
    console.error("Get tasks by project error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const existingTask = await service.getTaskById(req.params.id);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const canModify = await projectService.userCanModifyProject(existingTask.projectId, req.userId);
    if (!canModify) {
      return res.status(403).json({ message: "Only project owner or admin can update this task" });
    }

    const taskData = {
      ...req.body
    };
    if (req.body.assigneeId) {
      taskData.assignee = req.body.assigneeId;
      delete taskData.assigneeId;
    }

    const data = await service.updateTask(req.params.id, taskData);
    if (!data) {
      return res.status(404).json({ message: "Task not found" });
    }

    await notificationSocket.emitNotification({
      projectId: data.projectId,
      userId: req.userId,
      action: "updated",
      entityType: "task",
      entityData: data
    });

    res.json(data);
  } catch (error) {
    console.error("Task update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.remove = async (req, res) => {
  try {
    const existingTask = await service.getTaskById(req.params.id);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const canModify = await projectService.userCanModifyProject(existingTask.projectId, req.userId);
    if (!canModify) {
      return res.status(403).json({ message: "Only project owner or admin can delete this task" });
    }

    const deleted = await service.deleteTask(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    await notificationSocket.emitNotification({
      projectId: deleted.projectId,
      userId: req.userId,
      action: "deleted",
      entityType: "task",
      entityData: deleted
    });

    res.json({ msg: "Deleted" });
  } catch (error) {
    console.error("Task delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.inviteMember = async (req, res) => {
  try {
    const { email, userId } = req.body;
    if ((!email || !email.trim()) && !userId) {
      return res.status(400).json({ message: "Email or user ID is required" });
    }

    const task = await service.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const invitedUser = userId
      ? await userService.getUserById(userId)
      : await userService.getUserByEmail(email.trim().toLowerCase());
    if (!invitedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const project = await projectService.getProjectById(task.projectId);
    if (!project) {
      return res.status(400).json({ message: "Task project not found" });
    }

    const projectMember = (project.members || []).find(member =>
      member.user?.toString() === invitedUser._id.toString() && member.status === 'accepted'
    );
    if (!projectMember) {
      return res.status(400).json({ message: "User must already be a member of this project to be added to the task." });
    }

    const alreadyOnTask = (task.members || []).some(member => member.user?.toString() === invitedUser._id.toString());
    if (alreadyOnTask) {
      return res.status(400).json({ message: "This user is already invited or assigned to the task." });
    }

    const data = await service.inviteMember(req.params.id, invitedUser._id, req.userId);
    if (!data) {
      return res.status(404).json({ message: "Task not found" });
    }

    const notification = await notificationService.createNotification({
      recipient: invitedUser._id,
      sender: req.userId,
      type: "task_invite",
      content: `You have been invited to join task "${data.title}".`,
      link: `/task/${data._id}`,
      isRead: false
    });

    notificationSocket.emitToUser(invitedUser._id, {
      title: "Task Invitation",
      message: `You have a new invitation to task "${data.title}".`,
      type: "info",
      link: `/task/${data._id}`,
      notificationId: notification._id
    });

    res.json({ task: data, invitedUser: { id: invitedUser._id, email: invitedUser.email } });
  } catch (error) {
    console.error("Task invite error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.acceptInvite = async (req, res) => {
  try {
    const data = await service.acceptTaskInvite(req.params.id, req.userId);
    if (!data) {
      return res.status(404).json({ message: "Task invite not found" });
    }

    res.json(data);
  } catch (error) {
    console.error("Task accept invite error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addAttachment = async (req, res) => {
  try {
    const { fileName, fileUrl } = req.body;
    if (!fileName || !fileUrl) {
      return res.status(400).json({ message: "File name and URL are required" });
    }

    const existingTask = await service.getTaskById(req.params.id);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const canModify = await projectService.userCanModifyProject(existingTask.projectId, req.userId);
    if (!canModify) {
      return res.status(403).json({ message: "Only project owner or admin can update this task" });
    }

    const data = await service.addAttachment(req.params.id, { fileName, fileUrl });
    if (!data) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(data);
  } catch (error) {
    console.error("Add attachment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeAttachment = async (req, res) => {
  try {
    const { attachmentId } = req.params;
    const existingTask = await service.getTaskById(req.params.id);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const canModify = await projectService.userCanModifyProject(existingTask.projectId, req.userId);
    if (!canModify) {
      return res.status(403).json({ message: "Only project owner or admin can update this task" });
    }

    const data = await service.removeAttachment(req.params.id, attachmentId);
    if (!data) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    res.json(data);
  } catch (error) {
    console.error("Remove attachment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addTag = async (req, res) => {
  try {
    const { tag } = req.body;
    if (!tag || !tag.trim()) {
      return res.status(400).json({ message: "Tag is required" });
    }

    const existingTask = await service.getTaskById(req.params.id);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const canModify = await projectService.userCanModifyProject(existingTask.projectId, req.userId);
    if (!canModify) {
      return res.status(403).json({ message: "Only project owner or admin can update this task" });
    }

    const data = await service.addTag(req.params.id, tag.trim());
    if (!data) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(data);
  } catch (error) {
    console.error("Add tag error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
