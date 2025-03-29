# AI+游戏实验平台

## 研究目的

设计并实现一个集成大模型 API 的游戏实验平台，使游戏开发者可以在一个环境内高效使用 AI 辅助游戏创作，包括扩写游戏背景故事、生成任务分支剧情、提供 AI 视觉素材（2D/3D）。通过统一的平台管理，可以让信息资源在不同的 AI 模型中互通，最终提高 AI 的生成效果。

## 技术路径

- 大模型 API 调用模块：
  采用 OpenAI API、Stable Diffusion API、Code Llama 等进行调用。
- 数据存储与管理：
  采用 MongoDB 存储生成内容。
- 前端交互设计：
  使用 React 开发可视化界面，方便用户操作。
- 后端服务：
  采用 Go 进行 API 服务器的开发。
- 模型优化与微调：
  通过 Prompt Engineering、LoRA 等技术优化生成质量。

## 使用教程

### 数据库

v8.0.5

`cd docker`

- 启动 `docker-compose up -d`

### 前端

v19.1.0

`cd static`

- 启动 `npm start`
- 添加依赖 `npm install`

### 后端

v1.24.1

`cd server`

- 启动 `make run`
- 添加依赖 `go get`
