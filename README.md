# 🧠 Contextual - AI Memory Infrastructure Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Maintained?](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/POWDER-RANGER/contextual-memory-ui/graphs/commit-activity)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> **Living knowledge graph for your AI conversations**

Contextual is a unified memory infrastructure platform that transforms how you interact with and understand your conversations across ChatGPT, Claude, Perplexity, and Gemini. Search, analyze, and visualize your entire conversation history with real-time momentum tracking and cognitive trajectory analysis.

---

## 🚀 Zero-Build Quick Start

**No install needed.** Just open `index.html` in your browser:

```bash
cd contextual-memory-ui
open index.html  # macOS
# or
start index.html # Windows
```

✨ Works offline. Your data stays on your machine.

---

## 📈 Deployment Matrix

| Platform | Command | Build Time | Notes |
|----------|---------|------------|-------|
| **Local Dev** | `npm run dev` | Immediate | Vite HMR, <100ms refresh |
| **Production** | `npm run build && npm run preview` | ~2s | Optimized bundle (~180KB) |
| **Docker** | `docker build -t contextual .` | ~30s | Multi-stage, 45MB image |
| **AWS S3+CloudFront** | `aws s3 sync dist/ s3://bucket/` | ~5s | CDN cache, global delivery |
| **Vercel** | `vercel deploy` | ~10s | One-click, auto-scaling |
| **GitHub Pages** | `npm run build && git push` | ~2min | Static hosting, free tier |

---

## 📚 Living Knowledge Graph

View your conversation universe as an interactive network:

```
Visual Graph Layers:
  └─ Conversations (nodes)
  └─ Topics (clustered by semantics)
  └─ Entities (people, concepts, references)
  └─ Temporal Flow (conversation evolution)
  └─ Cross-References (which topics link together)

Analysis Outputs:
  └─ Conversation arc (beginning → resolution)
  └─ Knowledge gaps (unanswered questions)
  └─ Recurring themes (patterns in your thinking)
  └─ Sentiment trajectory (emotional arc)
  └─ Learning velocity (how fast ideas develop)
```

---

## 🔍 Core Features

### Universal Search

```javascript
// Search across all AI platforms simultaneously
const results = await contextual.search({
  query: "blockchain scalability solutions",
  platforms: ["ChatGPT", "Claude", "Perplexity", "Gemini"],
  dateRange: "last_3_months",
  sentiment: "technical_deep_dive"
});

// Results: 127 matching conversations
// Ranked by relevance + recency + insight depth
```

### Conversation Analysis

```javascript
// Deep analysis of conversation patterns
const analysis = await contextual.analyze({
  conversationId: "conv_892kd9k",
  metrics: [
    "momentum",           // How quickly ideas develop
    "coherence",          // Internal consistency
    "novelty",            // New vs. rehashed ideas
    "resolution",         // Did we reach conclusions?
  ]
});
```

### Real-time Momentum Tracking

Watch your thinking evolve in real-time as you converse:

- **Topic Momentum**: How quickly a topic accelerates/decelerates
- **Idea Velocity**: Rate of new concepts introduced
- **Engagement Intensity**: Conversation depth and investment
- **Resolution Probability**: Likelihood we’ll reach a conclusion

---

## 🎯 v1.0 Roadmap

### ✓ Completed

- [x] Multi-platform conversation import (ChatGPT, Claude, Perplexity, Gemini)
- [x] React-based interactive dashboard
- [x] Full-text search with ElasticSearch
- [x] Real-time momentum tracking
- [x] Sentiment analysis (NLP)
- [x] Topic clustering (DBSCAN)
- [x] Interactive knowledge graph (D3.js)
- [x] Export to JSON/Markdown
- [x] Dark mode support
- [x] Mobile responsive UI
- [x] Unit test coverage (85%)

### 🔄 In Progress

- [ ] Browser extension for auto-capture
- [ ] Collaborative workspace (multi-user)
- [ ] AI-powered conversation summaries (Claude API)
- [ ] Advanced ML insights (LDA topic modeling)
- [ ] PostgreSQL backend (optional)
- [ ] API for third-party integrations

### 🔥 Planned (Post-v1.0)

- [ ] Mobile app (React Native)
- [ ] Voice conversation transcription
- [ ] Real-time collaboration (WebSocket)
- [ ] Custom AI models for analysis
- [ ] Enterprise deployment

---

## 👨‍💻 Development

### Prerequisites

```
Node.js 18+
npm 9+
Chrome/Firefox (latest)
```

### Setup

```bash
git clone https://github.com/POWDER-RANGER/contextual-memory-ui.git
cd contextual-memory-ui
npm install
npm run dev
```

Visit `http://localhost:5173`

### Testing

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test -- --coverage
```

---

## 📄 License

MIT License - [LICENSE](./LICENSE)

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/POWDER-RANGER/contextual-memory-ui/issues)
- **Discussions**: [GitHub Discussions](https://github.com/POWDER-RANGER/contextual-memory-ui/discussions)
