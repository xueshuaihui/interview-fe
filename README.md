# 前端面试题库系统

## 项目概述

集面试题管理、随机抽题和模拟面试功能于一体的Web应用，提供Vue/React技术栈真题演练和实时编码环境。支持200+前端核心知识点题库，涵盖HTML/CSS基础、框架原理、算法实现等模块。

## 核心功能

- 📚 分类查看HTML5/CSS3/ES6+等基础理论题
- ⚡ Vue/React框架专项题库（含最新特性）
- 🧠 算法题与工程化问题实战演练
- 🎯 模拟面试场景随机抽题（支持难度筛选）
- 💻 实时代码编辑与运行沙箱
- 📦 LocalStorage数据持久化存储

## 技术栈

- Vue 3 + Composition API
- Vue Router 4
- Vite 4 构建工具
- marked 4.2 文档渲染
- ES2022 语法规范

## 快速启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 数据生成

生成模拟题库JSON文件：

```bash
node scripts/generate-json.js
```

## 项目结构

```
├── src
│   ├── views/          # 页面组件
│   │   ├── MockInterview.vue  模拟面试页
│   │   └── RandomQuestions.vue 随机抽题页
│   ├── datalist/       # 题库数据
│   │   ├── code/       算法题库
│   │   ├── vue/        Vue专项题库
│   │   └── react/      React专项题库
│   ├── router/         # 路由配置
│   └── assets/         # 静态资源
```

## 环境要求

- Node.js 18+
- npm 9+ 或 yarn 1.22+
- 现代浏览器（支持ES6语法）

## 贡献指南

1. 在GitHub提交issue说明问题
2. Fork仓库并创建feature分支
3. 提交Pull Request附详细说明
4. 遵循ESLint代码规范

## 许可证

MIT License © 2024
