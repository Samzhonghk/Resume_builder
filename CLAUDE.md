# 项目说明

本项目是一个 AI 简历生成网站，面向新西兰求职者，支持所有职业方向。
详细需求见 docs/PRD.md，任何关于功能设计的具体问题，先查这份文档对应章节。

## 当前开发阶段

阶段四（完善）：版本管理 / 数据隐私合规（视产品是否对外开放而定）
前三阶段已全部完成：落地页 → 表单/上传两条路径 → AI生成/优化 → 5套模板 → Cover Letter + 关键词检查 → PDF导出
对应 docs/PRD.md 第5节（阶段一～三全部 ✅）。

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
- API 层：Vercel Serverless Functions（`api/` 目录），前端通过 `fetch('/api/...')` 调用
- 简历内容生成/优化：Claude API（claude-opus-4-8），调用在服务端，Key 不暴露到浏览器
- PDF 解析：pdfjs-dist；Word 解析：mammoth（均在浏览器端动态 import）
- PDF 导出：react-pdf（动态 import）
- 数据存储（MVP阶段）：localStorage
- 本地开发：`npm run dev`（vercel dev，同时启动 Vite + serverless functions）

## 踩坑配置记录

| 问题 | 现象 | 规避方式（已采用） |
|---|---|---|
| `@react-pdf/renderer` 不能静态 import 到主 bundle | Vite 预构建报错或 HMR 崩溃 | `handleExportPDF` 内用 `await import(...)` 动态加载，永不静态引入 |
| `@anthropic-ai/sdk` 在浏览器端直接调用 | 默认 SDK 拒绝浏览器环境 | `new Anthropic({ dangerouslyAllowBrowser: true })`（见 `src/services/aiGenerate.js`）|
| API Key 暴露在前端 | 明文可见于浏览器 DevTools | MVP 阶段接受，生产对外开放前须迁移到 BFF（见 PRD.md §8）|
| `workExperience._id` 不能发给 AI | AI 原样返回或格式混乱 | 发送前 strip `_id`，返回后按 index 对位合并（见 `aiGenerate.js`）|
| `optimizeDeps.exclude: ['@react-pdf/renderer']` | 若改为静态引入 react-pdf 则 Vite 预构建出错 | 保持动态 import 则无需此配置；若改静态引入再加 |
| mammoth 在 Vite dev 动态 import 时报 "Can't find end of central directory" | mammoth 的 `browser` 字段替换在 Vite 动态 import 中不生效，加载了 Node 版本 | `vite.config.js` 加 `optimizeDeps: { include: ['mammoth'] }` 强制预构建走 browser field |
| `docx` 包与 react-pdf / pdfjs-dist 同时存在时 `npm run build` 崩溃 | Vite 8（rolldown/Rust）构建时 Rust 线程池初始化失败，OS 报页面文件耗尽（exit code 9） | 用纯文本 RTF 格式替代 .docx（Word/LibreOffice/Google Docs 均支持），彻底移除 `docx` 依赖 |

## 协作说明

本项目可能由 Claude Code 和 Codex 协同开发。两者共用本文件作为项目上下文
（Codex 通过 .codex/config.toml 的 fallback 配置读取本文件，详见该文件说明）。
如果需求或架构发生变化，请同步更新本文件和 docs/PRD.md，保持两者一致。
