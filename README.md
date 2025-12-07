# 🧠 Contextual - AI Memory Infrastructure Platform

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/POWDER-RANGER/contextual-memory-ui/graphs/commit-activity)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> **Search, analyze, and visualize your AI conversations across ChatGPT, Claude, Perplexity, and Gemini with real-time momentum tracking and cognitive trajectory analysis.**

## 🌟 Overview

**Contextual** is a cutting-edge AI memory infrastructure platform that transforms how you interact with and understand your conversations across multiple AI assistants. It provides a unified interface to search, analyze patterns, track cognitive momentum, and visualize the evolution of your thoughts across different AI platforms.

### Key Features

- 🔍 **Unified Search**: Search across all your AI conversations from ChatGPT, Claude, Perplexity, and Gemini in one place
- 📊 **Momentum Tracking**: Real-time visualization of conversation velocity and cognitive engagement patterns
- 🧬 **Trajectory Analysis**: Track the evolution of ideas and topics across multiple conversations
- 🎨 **Beautiful UI**: Modern, responsive interface with dark mode and cyberpunk aesthetics
- 🔐 **Privacy First**: Your data stays with you - self-hosted or local deployment options
- 🚀 **Fast & Efficient**: Built with React for lightning-fast performance
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## 🎯 Use Cases

- **Researchers**: Track research questions and insights across multiple AI platforms
- **Developers**: Reference past coding discussions and technical solutions
- **Writers**: Monitor creative ideation patterns and writing evolution
- **Students**: Organize learning conversations and study materials
- **Professionals**: Maintain searchable knowledge base of AI-assisted work

## 🚀 Quick Start

### Option 1: Direct Browser Use (Fastest)

1. Clone the repository:
   ```bash
   git clone https://github.com/POWDER-RANGER/contextual-memory-ui.git
   cd contextual-memory-ui
   ```

2. Open `index.html` in your browser:
   ```bash
   # On Windows
   start index.html
   
   # On macOS
   open index.html
   
   # On Linux
   xdg-open index.html
   ```

3. **That's it!** The application runs entirely in your browser.

### Option 2: Local Development Server

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 📖 Documentation

### Architecture

```
contextual-memory-ui/
├── index.html          # Main application (single-page app)
├── README.md           # This file
├── LICENSE             # MIT License
└── assets/            # Coming soon: screenshots, demos
```

### Configuration

#### Backend API Setup (Optional)

The application can work with a backend API for persistent storage:

```javascript
// In index.html, uncomment and configure:
window.CONTEXTUAL_API_URL = 'https://your-backend.com';
```

#### Local Storage Only

By default, the application uses browser localStorage for conversation data.

## 🎨 Features Deep Dive

### 1. Conversation Import
- **Multi-Platform Support**: Import from ChatGPT, Claude, Perplexity, Gemini
- **Batch Processing**: Handle multiple conversations at once
- **Smart Parsing**: Automatic extraction of metadata and timestamps

### 2. Advanced Search
- **Full-Text Search**: Search across all conversation content
- **Filter by Platform**: Focus on specific AI assistants
- **Date Range**: Find conversations from specific time periods
- **Tag Support**: Organize with custom tags (coming soon)

### 3. Analytics Dashboard
- **Momentum Metrics**: Track conversation frequency and intensity
- **Trajectory Visualization**: See how topics evolve over time
- **Platform Comparison**: Compare usage across different AI assistants
- **Cognitive Patterns**: Identify your thinking and questioning patterns

### 4. Export Capabilities
- **JSON Export**: Full data portability
- **Markdown Export**: Readable documentation format
- **Backup & Restore**: Easy data management

## 🛠️ Technology Stack

- **Frontend**: React 18 (via CDN)
- **Styling**: Custom CSS with cyberpunk design system
- **State Management**: React Hooks
- **Data Storage**: LocalStorage / IndexedDB
- **Build**: Zero-build setup (standalone HTML file)

## 🤝 Contributing

Contributions are welcome! This project thrives on community input.

### How to Contribute

1. **Fork the Repository**
   ```bash
   gh repo fork POWDER-RANGER/contextual-memory-ui
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit Your Changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

4. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**

### Development Guidelines

- Keep the single-file architecture for simplicity
- Maintain zero-build deployment capability
- Follow existing code style and patterns
- Add comments for complex logic
- Test across major browsers (Chrome, Firefox, Safari, Edge)

## 📋 Roadmap

### Version 1.0 (Current)
- [x] Basic conversation import
- [x] Search functionality
- [x] Momentum tracking
- [x] Responsive UI
- [ ] Export/Import features
- [ ] Advanced filtering

### Version 2.0 (Planned)
- [ ] Backend API integration
- [ ] Real-time sync across devices
- [ ] Advanced analytics dashboard
- [ ] AI-powered conversation summarization
- [ ] Tag management system
- [ ] Custom themes
- [ ] Browser extension

### Version 3.0 (Future)
- [ ] Collaborative features
- [ ] API for third-party integrations
- [ ] Mobile app (React Native)
- [ ] Advanced visualization options
- [ ] Machine learning insights

## 🐛 Known Issues

- Large conversation imports may slow down on older browsers
- Safari private mode has localStorage limitations
- Mobile UI needs optimization for tablets

See [Issues](https://github.com/POWDER-RANGER/contextual-memory-ui/issues) for full list.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the need for better AI conversation management
- Built with love for the AI research and development community
- Special thanks to all contributors and early adopters

## 💡 Support

- **Star** this repository if you find it useful
- **Watch** for updates and new features
- **Fork** to customize for your needs
- **Sponsor** via [GitHub Sponsors](https://github.com/sponsors/POWDER-RANGER)

## 📬 Contact

- **Issues**: [GitHub Issues](https://github.com/POWDER-RANGER/contextual-memory-ui/issues)
- **Discussions**: [GitHub Discussions](https://github.com/POWDER-RANGER/contextual-memory-ui/discussions)
- **Profile**: [@POWDER-RANGER](https://github.com/POWDER-RANGER)

---

<div align="center">
  <strong>Built with 🧠 by POWDER-RANGER</strong>
  <br>
  <sub>Making AI conversations searchable, analyzable, and actionable</sub>
</div>
