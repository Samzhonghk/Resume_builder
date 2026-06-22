# 项目说明

本项目是一个 AI 简历生成网站，面向新西兰求职者，支持所有职业方向。
详细需求见 docs/PRD.md，任何关于功能设计的具体问题，先查这份文档对应章节。

## 当前开发阶段

阶段一（MVP核心链路）：表单 → AI生成 → 单一模板 → 导出
对应 docs/PRD.md 第5、7节。

> 修改本节：每次进入新阶段时，更新这里的"当前阶段"，确保每次启动时读到的是最新进度。

## 核心原则（不可违反）

- **不做 Seek.co.nz 自动投递功能**。本产品只做投递前准备（定制化简历、求职信、关键词检查），实际投递动作由用户手动完成。原因见 PRD.md 第4节。
- 两条创建路径（从零创建 / 上传旧简历优化）必须共用同一套表单组件和数据结构，不要为两条路径分别开发独立组件。数据结构定义见 PRD.md 第3.2节。
- AI 优化润色已有简历内容时，不得编造用户未提供的具体事实或数据。

## 数据结构（核心契约，多个模块/多个 agent 协作时必须保持一致）

```json
{
  "source": "blank" | "uploaded",
  "targetIndustry": "string",
  "data": {
    "name": "...",
    "contact": {...},
    "workExperience": [
      {"company": "...", "title": "...", "period": "...", "bullets": ["...", "..."]}
    ],
    "education": [...],
    "skills": [...]
  }
}
```

## 技术栈

- 前端：React + Tailwind
- 简历内容生成/优化：Claude API（或同类 LLM API）
- PDF 解析：pdf-parse；Word 解析：mammoth
- PDF 导出：react-pdf
- 数据存储（MVP阶段）：localStorage

## 踩坑配置记录

| 问题 | 现象 | 规避方式（已采用） |
|---|---|---|
| `@react-pdf/renderer` 不能静态 import 到主 bundle | Vite 预构建报错或 HMR 崩溃 | `handleExportPDF` 内用 `await import(...)` 动态加载，永不静态引入 |
| `@anthropic-ai/sdk` 在浏览器端直接调用 | 默认 SDK 拒绝浏览器环境 | `new Anthropic({ dangerouslyAllowBrowser: true })`（见 `src/services/aiGenerate.js`）|
| API Key 暴露在前端 | 明文可见于浏览器 DevTools | MVP 阶段接受，生产对外开放前须迁移到 BFF（见 PRD.md §8）|
| `workExperience._id` 不能发给 AI | AI 原样返回或格式混乱 | 发送前 strip `_id`，返回后按 index 对位合并（见 `aiGenerate.js`）|
| `optimizeDeps.exclude: ['@react-pdf/renderer']` | 若改为静态引入 react-pdf 则 Vite 预构建出错 | 保持动态 import 则无需此配置；若改静态引入再加 |

## 协作说明

本项目可能由 Claude Code 和 Codex 协同开发。两者共用本文件作为项目上下文
（Codex 通过 .codex/config.toml 的 fallback 配置读取本文件，详见该文件说明）。
如果需求或架构发生变化，请同步更新本文件和 docs/PRD.md，保持两者一致。
