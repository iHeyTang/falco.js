# Falco.js

Falco.js 是一个基于 Next.js 的 Web 快速开发框架，采用 Turborepo 管理的 monorepo 架构，旨在提供一套完整的企业级 Web 应用开发解决方案。

## 特性

- 🚀 基于 Next.js 15 和 React 19
- 📦 Monorepo 架构，更好的代码复用和管理
- 🔥 TypeScript 支持
- 🛠️ 内置服务端状态管理
- 📝 统一的日志和错误处理
- ⚡️ 开发体验优化

## 快速开始

```bash
# 克隆项目
git clone https://github.com/iheytang/falco.js.git
cd falco.js

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 项目结构

```
apps/
  ├── web/          # 主要的 Web 应用
  └── docs/         # 文档网站
packages/
  ├── utils/        # 通用工具库
  ├── persistence/  # 数据持久化模块
  ├── ui/           # UI 组件库
  └── eslint-config/# ESLint 配置
```

## 核心功能

- **服务端动作**: 简化服务端状态管理和数据获取
- **持久化层**: 统一的数据访问接口
- **工具集**: 包含日志、时间处理等常用工具
- **类型安全**: 完整的 TypeScript 支持

## 开发命令

```bash
# 开发模式
pnpm dev

# 构建项目
pnpm build

# 运行测试
pnpm test

# 代码检查
pnpm lint
```

## 贡献指南

欢迎提交 Issue 和 Pull Request。在提交 PR 之前，请确保：

1. 代码通过所有测试
2. 遵循项目的代码规范
3. 提供清晰的提交信息

## 许可证

[MIT License](LICENSE)
