// public/js/board.js

function openAddColumnModal() {
    const modal = document.getElementById('addColumnModal');
    if (modal) {
        document.getElementById('newColumnName').value = '';
        modal.style.display = 'flex';
    }
}

function closeAddColumnModal() {
    const modal = document.getElementById('addColumnModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function slugifyLabel(label) {
    return label.toLowerCase().trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
}

function dragTask(event) {
    const permission = window.currentUserPermission || 'view';
    const isOwner = window.currentUserIsOwner === true || window.currentUserIsOwner === 'true';
    const allowed = isOwner || permission === 'admin' || permission === 'comment';

    if (!allowed) {
        event.preventDefault();
        alert('You do not have permission to move tasks.');
        return;
    }

    const taskCard = event.currentTarget || event.target;
    if (taskCard && taskCard.id) {
        event.dataTransfer.setData('text/plain', taskCard.id);
    }
}

function allowDrop(event) {
    event.preventDefault();
}

async function submitAddColumn(projectId, currentWorkflow) {
    projectId = projectId || window.currentProjectId;
    currentWorkflow = currentWorkflow || window.currentProjectWorkflow || [];
    const nameInput = document.getElementById('newColumnName');
    const label = nameInput.value.trim();
    
    if (!label) return alert('Please enter a column name.');

    const key = slugifyLabel(label);
    if (!key) return alert('Column name must contain valid letters or numbers.');

    // Kiểm tra trùng key
    const existingKeys = currentWorkflow.map(item => item.key);
    if (existingKeys.includes(key)) {
        return alert('A column with this name already exists.');
    }

    const workflow = [...currentWorkflow, { key, label }];

    try {
        const response = await fetch(`/api/projects/${projectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ workflow })
        });

        if (response.ok) {
            location.reload();
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Could not add column.');
        }
    } catch (error) {
        console.error('Add column error:', error);
        alert('Could not add column.');
    }
}

function closeInviteModal() {
    const modal = document.getElementById('projectInviteModal');
    if (modal) modal.style.display = 'none';
}

// Hàm hủy lời mời đã có trong HTML của bạn
async function cancelProjectInvite(projectId, userId) {
    if (!confirm('Are you sure you want to cancel this invitation?')) return;

    try {
        const response = await fetch(`/api/projects/${projectId}/invite/cancel`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });

        if (response.ok) {
            window.location.reload();
        } else {
            const err = await response.json();
            alert(err.message || 'Failed to cancel invite');
        }
    } catch (error) {
        console.error('Cancel invite error:', error);
    }
}

// Thêm hàm
async function submitInviteMember(projectId) {
    const emailInput = document.getElementById('inviteEmail');
    const permissionInput = document.getElementById('invitePermission');
    
    if (!emailInput || !permissionInput) return;

    const email = emailInput.value.trim();
    const permission = permissionInput.value;

    if (!email) return alert('Please enter an email address.');

    try {
        const response = await fetch(`/api/projects/${projectId}/invite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, permission })
        });

        const result = await response.json();
        if (response.ok) {
            alert('Invitation sent successfully!');
            window.location.reload();
        } else {
            alert(result.message || 'Error sending invitation');
        }
    } catch (err) {
        console.error('Invite error:', err);
        alert('Connection error');
    }
}

// Export functions to window so inline handlers can call them safely
window.openAddColumnModal = openAddColumnModal;
window.closeAddColumnModal = closeAddColumnModal;
window.submitAddColumn = submitAddColumn;
window.closeInviteModal = closeInviteModal;
window.cancelProjectInvite = cancelProjectInvite;
window.submitInviteMember = submitInviteMember;
window.dragTask = dragTask;
window.allowDrop = allowDrop;

// Cập nhật lại phần DOMContentLoaded trong board.js để không bị lỗi cú pháp EJS
document.addEventListener('DOMContentLoaded', () => {
    const inviteBtn = document.getElementById('openProjectInviteModal');
    if (inviteBtn) {
        inviteBtn.addEventListener('click', () => {
            const modal = document.getElementById('projectInviteModal');
            if (modal) modal.style.display = 'flex';
        });
    }

    const inviteForm = document.getElementById('inviteMemberForm');
    if (inviteForm) {
        inviteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Lấy projectId từ biến toàn cục đã khai báo ở dashboard.ejs
            if (window.currentProjectId) {
                submitInviteMember(window.currentProjectId);
            } else {
                alert("Project ID not found.");
            }
        });
    }
});