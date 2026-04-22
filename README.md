# 📅 日程管理应用 (Scheduler App)

一个基于 React + TypeScript + SQLite 的现代化日程管理网站，数据完全存储在本地浏览器中。

## ✨ 功能特性

- ✅ **创建日程** - 添加标题、描述、日期、时间和优先级
- ✅ **编辑日程** - 随时修改已有日程信息
- ✅ **删除日程** - 轻松移除不需要的日程
- ✅ **完成标记** - 勾选复选框标记日程完成状态
- ✅ **日期筛选** - 按日期查看特定日程（默认显示当天）
- ✅ **优先级管理** - 支持高、中、低三种优先级，彩色标识
- ✅ **数据持久化** - 使用 SQLite 数据库，数据保存在 localStorage
- ✅ **响应式设计** - 完美支持桌面和移动设备
- ✅ **离线可用** - 所有数据存储在本地，无需网络连接

## 🚀 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 8
- **数据库**: sql.js (SQLite WebAssembly)
- **样式**: 纯 CSS（无第三方 UI 库）
- **编译器**: React Compiler (自动优化)

## 📦 安装与运行

### 前置要求

- Node.js 18+ 
- npm 或 yarn

### 快速开始

```bash
# 克隆项目
git clone https://github.com/your-username/scheduler-app.git
cd scheduler-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

开发服务器启动后，访问 `http://localhost:5173` 即可使用应用。

## 📁 项目结构

```
src/
├── components/          # React 组件
│   ├── ScheduleForm.tsx    # 日程表单组件
│   └── ScheduleList.tsx    # 日程列表组件
├── services/            # 业务逻辑层
│   └── scheduleService.ts  # 日程 CRUD 操作
├── utils/               # 工具函数
│   └── db.ts              # SQLite 数据库初始化和管理
├── types/               # TypeScript 类型定义
│   └── sql.d.ts           # sql.js 类型声明
├── App.tsx              # 主应用组件
├── App.css              # 应用样式
└── main.tsx             # 应用入口
```

## 💾 数据存储

应用使用 **sql.js**（SQLite 的 WebAssembly 版本）在浏览器端运行完整的 SQLite 数据库：

- 数据库文件以二进制形式存储在浏览器的 `localStorage` 中
- 每次数据变更都会自动保存
- 刷新页面后数据不会丢失
- 完全离线可用，无需后端服务器

## 🎨 界面预览

应用采用现代化的渐变设计，包含以下界面元素：

- **头部导航** - 应用标题和新建按钮
- **日期筛选器** - 快速筛选特定日期的日程
- **日程列表** - 卡片式展示，支持完成状态切换
- **表单弹窗** - 美观的模态框用于创建/编辑日程

## 🔧 开发说明

### 添加新功能

1. 在 `services/scheduleService.ts` 中添加数据库操作方法
2. 创建新的 React 组件（如需要）
3. 在 `App.tsx` 中集成新功能
4. 更新样式文件 `App.css`

### 修改数据库结构

编辑 `src/utils/db.ts` 中的 SQL 建表语句：

```typescript
db.run(`
  CREATE TABLE IF NOT EXISTS schedules (
    // 添加新字段
  )
`);
```

## 🌐 部署

### Vercel（推荐）

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# 将 dist 目录上传到 Netlify
```

### GitHub Pages

```bash
npm run build
# 使用 gh-pages 或其他工具部署 dist 目录
```

## 📝 API 参考

### scheduleService

```typescript
// 获取所有日程
scheduleService.getAll(): Schedule[]

// 根据日期获取日程
scheduleService.getByDate(date: string): Schedule[]

// 添加日程
scheduleService.add(schedule: Omit<Schedule, 'id'>): Schedule

// 更新日程
scheduleService.update(id: number, updates: Partial<Schedule>): Schedule

// 删除日程
scheduleService.delete(id: number): void

// 切换完成状态
scheduleService.toggleComplete(id: number): Schedule
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [React](https://react.dev/) - 用户界面库
- [Vite](https://vite.dev/) - 下一代前端构建工具
- [sql.js](https://sql.js.org/) - SQLite 的 WebAssembly 移植
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集

---

Made with ❤️ by Your Name
