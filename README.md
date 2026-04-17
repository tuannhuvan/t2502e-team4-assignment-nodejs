🚀 TaskFlow – Mini Trello (NodeJS)
📌 Giới thiệu
link video : https://drive.google.com/file/d/1YXM_3ow2OZ5e2hfAgQQO6-9wAiRZYSMs/view?usp=drive_link
TaskFlow là hệ thống quản lý nhiệm vụ theo phong cách Trello/Linear, cho phép cá nhân hoặc nhóm:

Quản lý project
Giao việc
Theo dõi tiến độ
Nhận cập nhật realtime
🧠 Công nghệ sử dụng
Node.js + Express
MongoDB + Mongoose
JWT Authentication
Socket.io (Realtime)
dotenv
bcrypt
👥 Thành viên
4 members (Nhữ Văn Tuấn , Nguyễn Xuân Tùng, Nguyễn Hữu Trí, Nguyễn Văn Linh)
⏱ Thời gian
2 tuần (Deadline: 17/04/2026)
📦 Cài đặt & chạy project
1. Clone project
git clone https://github.com/tuannhuvan/t2502e-team4-assignment-nodejs.git
cd t2502e-team4-assignment-nodejs
2. Cài dependencies
npm install
3. Tạo file .env
PORT=3000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

⚠️ Không commit .env

4. Chạy project
npm run dev

hoặc:

npm start
🧩 Chức năng
🔐 Authentication
Đăng ký / đăng nhập
JWT + Refresh Token
Middleware bảo vệ route
📁 Project
CRUD project
Quản lý members
📝 Task
CRUD task
Fields:
title
description
status (todo / in-progress / done)
priority (low / medium / high)
deadline
assignee
💬 Comment
Thêm / xem comment
⚡ Realtime (Socket.io)
Update task → realtime
Comment → realtime
Assign user → realtime
📊 Dashboard
Task của tôi
Filter theo status / overdue
🚀 Nâng cao (2 điểm)
Role: Owner / Member
Filter & search
Soft delete
Upload avatar
📁 Cấu trúc project
src/
│
├── controllers/
├── models/
├── routes/
├── services/
├── middlewares/
├── sockets/
├── utils/
└── app.js
🔄 Git Workflow
⚠️ Quy định
❌ Không push trực tiếp lên master
✅ Mỗi task → 1 branch
❌ Không dùng:
git add .
🌿 Naming branch
<task-id>-<task-name>

Ví dụ:

1.2.4-create-task-api
🔄 Quy trình làm việc
1. Pull code
git checkout master
git pull origin master
2. Tạo branch
git checkout -b 1.2.4-create-task-api
3. Commit
git add file.js
git commit -m "create task api"
4. Push
git push -u origin 1.2.4-create-task-api
🎯 Coding Convention
📌 Naming
Loại	Quy tắc	Ví dụ
Variable	camelCase	userName
Function	camelCase	getUser()
Class	PascalCase	UserService
Constant	UPPER_CASE	MAX_LIMIT
Boolean	is/has/can	isActive
✅ Best practices
✔ Boolean
if (isActive) {}
if (!isDeleted) {}
✔ Clean code
Hàm ngắn
Tên rõ nghĩa
Không hard-code
❌ Không nên
let check = true;
if (isValid === true)
✅ Nên
let isValid = true;
if (isValid)
🔐 Bảo mật
❌ Không push:
.env
private key
✔ Dùng biến môi trường
🧪 Testing
Test API
Test validation
Test error case
🚀 Deploy
Render / Railway / Vercel
📌 Lưu ý quan trọng
Luôn format code trước khi commit
Kiểm tra git status trước khi push
Không push file rác / file nhạy cảm
✅ Checklist hoàn thành
 Auth + JWT
 Project CRUD
 Task CRUD
 Comment
 Realtime
 Dashboard
 Deploy
 README
🎯 Mục tiêu đạt được
CRUD với MongoDB
Authentication JWT
Realtime Socket.io
Clean architecture
Team workflow chuẩn
