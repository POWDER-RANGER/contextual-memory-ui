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
- 🚀 **Fast & Efficient**: Built with React + Vite for lightning-fast performance
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- 🐳 **Docker Ready**: One-command containerized deployment
- ☁️ **Cloud Deploy**: Ready for Vercel, Netlify, GitHub Pages, and more

## 🎯 Use Cases

- **Researchers**: Track research questions and insights across multiple AI platforms
- **Developers**: Reference past coding discussions and technical solutions
- **Writers**: Monitor creative ideation patterns and writing evolution
- **Students**: Organize learning conversations and study materials
- **Professionals**: Maintain searchable knowledge base of AI-assisted work

## 📋 System Requirements

### All Platforms
- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 (or yarn/pnpm equivalent)
- **Modern Web Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Platform-Specific Requirements

#### Windows
- Windows 10 or later (Windows Server 2019+ for production)
- PowerShell 5.1 or later (PowerShell Core 7+ recommended)
- Visual Studio Build Tools (optional, for native modules)

#### Linux
- Ubuntu 20.04+, Debian 11+, CentOS 8+, or equivalent
- bash 4.0+
- systemd (for service deployment)

#### macOS
- macOS 11 (Big Sur) or later
- Xcode Command Line Tools: `xcode-select --install`

#### Docker
- Docker Engine 20.10+
- Docker Compose 2.0+ (optional)

## 🚀 Quick Start

### Option 1: Direct Browser Use (Fastest - No Build Required)

1. Clone the repository:
   ```bash
   git clone https://github.com/POWDER-RANGER/contextual-memory-ui.git
   cd contextual-memory-ui
   ```

2. Open `index.html` directly in your browser:
   
   **Windows:**
   ```powershell
   start index.html
   ```
   
   **macOS:**
   ```bash
   open index.html
   ```
   
   **Linux:**
   ```bash
   xdg-open index.html
   ```

3. **That's it!** The application runs entirely in your browser with zero build step.

### Option 2: Local Development Server

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Application will open at http://localhost:3000
```

### Option 3: Production Build

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

The production build will be in the `dist/` directory, ready for deployment.

## 🏗️ BUILD INSTRUCTIONS

### Windows Deployment

#### IIS (Internet Information Services)

1. **Build the application:**
   ```powershell
   npm install
   npm run build
   ```

2. **Run the deployment script:**
   ```powershell
   .\deploy\windows\deploy-iis.ps1
   ```

3. **Manual IIS setup:**
   - Open IIS Manager
   - Right-click "Sites" → "Add Website"
   - Site name: `Contextual-AI`
   - Physical path: `C:\path\to\contextual-memory-ui\dist`
   - Binding: HTTP, Port 80 (or HTTPS with certificate)
   - Click OK

4. **Configure web.config** (already included in `deploy/windows/web.config`):
   - Enables SPA routing
   - Adds security headers
   - Configures CORS (if needed)

#### Node.js on Windows

```powershell
# Using deployment script
.\deploy\windows\deploy-node.ps1

# Or manually:
npm install -g serve
serve -s dist -l 3000
```

#### Windows Service (Production)

See `deploy/windows/README.md` for detailed instructions on running as a Windows Service with PM2 or NSSM.

### Linux Deployment

#### Nginx

1. **Build the application:**
   ```bash
   npm install
   npm run build
   ```

2. **Run the deployment script:**
   ```bash
   chmod +x deploy/linux/deploy-nginx.sh
   sudo ./deploy/linux/deploy-nginx.sh
   ```

3. **Manual Nginx setup:**
   ```bash
   # Copy built files
   sudo cp -r dist/* /var/www/contextual-ai/
   
   # Copy nginx configuration
   sudo cp deploy/linux/nginx.conf /etc/nginx/sites-available/contextual-ai
   sudo ln -s /etc/nginx/sites-available/contextual-ai /etc/nginx/sites-enabled/
   
   # Test and reload
   sudo nginx -t
   sudo systemctl reload nginx
   ```

#### Apache

1. **Build and deploy:**
   ```bash
   npm install
   npm run build
   
   sudo cp -r dist/* /var/www/html/contextual-ai/
   sudo cp deploy/linux/apache.conf /etc/apache2/sites-available/contextual-ai.conf
   
   sudo a2ensite contextual-ai
   sudo a2enmod rewrite
   sudo systemctl reload apache2
   ```

#### systemd Service

See `deploy/linux/contextual-ai.service` for running as a system service with Node.js/serve.

### macOS Deployment

#### Local Development

```bash
npm install
npm run dev
```

#### Production Build

```bash
npm install
npm run build

# Serve with Python
python3 -m http.server --directory dist 8000

# Or with Node.js
npx serve -s dist
```

#### Apache on macOS

```bash
# Build
npm run build

# Deploy to Apache
sudo cp -r dist/* /Library/WebServer/Documents/contextual-ai/
sudo cp deploy/macos/httpd-vhost.conf /etc/apache2/extra/httpd-contextual.conf

# Enable and restart
sudo apachectl configtest
sudo apachectl restart
```

### Docker Deployment

#### Quick Start

```bash
# Build image
docker build -t contextual-ai .

# Run container
docker run -d -p 8080:80 --name contextual-ai contextual-ai

# Access at http://localhost:8080
```

#### Docker Compose

```bash
docker-compose up -d
```

#### Multi-stage Production Build

The included `Dockerfile` uses multi-stage builds:
- Stage 1: Node.js build environment
- Stage 2: Nginx production server (lightweight)

Final image size: ~25MB

### Cloud Platform Deployment

#### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo in the Vercel dashboard for automatic deployments.

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

Or use the Netlify dashboard with these settings:
- Build command: `npm run build`
- Publish directory: `dist`

#### GitHub Pages

```bash
# Build
npm run build

# Deploy to gh-pages branch
npm install -g gh-pages
gh-pages -d dist
```

Or use the included GitHub Actions workflow in `.github/workflows/deploy.yml`.

#### AWS S3 + CloudFront

See `deploy/aws/README.md` for detailed CloudFormation/Terraform templates.

#### Azure Static Web Apps

See `deploy/azure/README.md` for deployment via Azure CLI or GitHub Actions.

## 📖 Architecture

```
contextual-memory-ui/
├── index.html              # Standalone single-page app (zero-build option)
├── src/                    # Source files for Vite build
│   ├── App.jsx            # Main React application
│   ├── index.js           # Application entry point
│   └── core/              # Core business logic
│       ├── AIHousekeeper.js
│       ├── ContextBridge.js
│       └── StateVault.js
├── deploy/                 # Platform-specific deployment configs
│   ├── windows/           # Windows IIS, PowerShell scripts
│   ├── linux/             # Linux nginx, Apache, systemd
│   ├── macos/             # macOS Apache configuration
│   ├── docker/            # Docker and Docker Compose
│   ├── aws/               # AWS deployment templates
│   └── azure/             # Azure deployment templates
├── vite.config.js         # Vite build configuration
├── package.json           # Dependencies and scripts
├── Dockerfile             # Multi-stage production container
├── docker-compose.yml     # Orchestrated container deployment
└── README.md              # This file
```

### Shared Code Organization

All core application logic is platform-agnostic JavaScript/React:
- `src/core/`: Business logic (runs in any browser)
- `src/App.jsx`: Main UI components (React)
- `index.html`: Standalone version (no build required)

The application is **browser-based** and platform-agnostic at the code level. Platform differences are only in deployment/hosting infrastructure.

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

- **Frontend**: React 18 + Vite
- **UI Components**: Custom React components with Hooks
- **Styling**: Custom CSS with cyberpunk design system
- **State Management**: React Context + Hooks
- **Data Storage**: LocalStorage / IndexedDB
- **Charts**: Chart.js + react-chartjs-2
- **Build Tool**: Vite 5 (fast HMR, optimized production builds)
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier

## 🧪 Development

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Available variables:
- `VITE_API_URL`: Backend API URL (optional)
- `VITE_STORAGE_TYPE`: `local` or `indexeddb` (default: `local`)
- `VITE_DEBUG_MODE`: Enable debug logging (default: `false`)

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
   git commit -m 'feat: add amazing feature'
   ```

4. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📋 Roadmap

### Version 1.0 (Current)
- [x] Basic conversation import
- [x] Search functionality
- [x] Momentum tracking
- [x] Responsive UI
- [x] Cross-platform deployment
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
- [ ] Native mobile apps (React Native)
- [ ] Advanced visualization options
- [ ] Machine learning insights

## 🐛 Known Issues

- Large conversation imports may slow down on older browsers
- Safari private mode has localStorage limitations
- Mobile UI optimization ongoing for tablets

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