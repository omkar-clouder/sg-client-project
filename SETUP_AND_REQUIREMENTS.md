# Setup and Requirements Guide

## Prerequisites

### Required Software

1. **Node.js (Version 18.x)**
   - Download: https://nodejs.org/
   - Required Version: 18.x (e.g., 18.17.0, 18.19.0)
   - This includes npm (Node Package Manager)
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

### Optional but Recommended Tools

1. **Git** (for version control)
   - Download: https://git-scm.com/
2. **Visual Studio Code** (recommended editor)
   - Download: https://code.visualstudio.com/
   - Recommended Extensions:
     - ES7+ React/Redux/React-Native snippets
     - Tailwind CSS IntelliSense
     - ESLint
     - Prettier
     - Vite

## Project Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2.0 | UI Framework |
| react-dom | ^18.2.0 | React DOM bindings |
| react-icons | ^4.12.0 | Icon library |
| framer-motion | ^10.16.16 | Animation library |
| papaparse | ^5.4.1 | CSV parsing |
| xlsx | ^0.18.5 | Excel file handling |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| @vitejs/plugin-react | ^4.2.1 | Vite React plugin |
| autoprefixer | ^10.4.16 | CSS autoprefixer |
| postcss | ^8.4.32 | PostCSS processor |
| tailwindcss | ^3.4.0 | Utility-first CSS |
| vite | ^5.0.10 | Build tool & dev server |

## Installation Steps

### Step 1: Install Node.js

1. Go to https://nodejs.org/
2. Download Node.js 18.x (LTS version recommended)
3. Run the installer and follow the instructions
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Clone or Download Project

```bash
# If using git
git clone <repository-url>
cd new-project

# OR download and extract the project folder
```

### Step 3: Install Dependencies

```bash
npm install
```

This command will:
- Read `package.json` file
- Download all required packages (listed above)
- Install them in `node_modules/` folder
- Takes approximately 2-5 minutes depending on internet speed

### Step 4: Start Development Server

```bash
npm run dev
```

This will:
- Start the Vite development server
- Usually runs on http://localhost:5173
- Opens automatically in your browser
- Supports hot module replacement (instant updates)

### Step 5: Build for Production

```bash
npm run build
```

This creates an optimized production build in `dist/` folder.

### Step 6: Preview Production Build

```bash
npm run preview
```

Tests the production build locally before deployment.

## File Structure

```
new-project/
├── src/                    # Source code
│   ├── App.jsx            # Main React component
│   ├── App.css            # Component styles
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── package.json           # Dependencies list
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
├── Dockerfile             # Docker container config
├── .dockerignore          # Docker ignore rules
└── README.md              # Project documentation
```

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Development | `npm run dev` | Start dev server with hot reload |
| Build | `npm run build` | Create production build |
| Preview | `npm run preview` | Preview production build |

## System Requirements

### Minimum
- **OS**: Windows 10/11, macOS 10.15+, or Linux
- **RAM**: 4 GB
- **Storage**: 500 MB free space
- **Node.js**: 18.x

### Recommended
- **OS**: Latest Windows 11, macOS 13+, or Ubuntu 22+
- **RAM**: 8 GB or more
- **Storage**: 1 GB free space
- **Node.js**: 18.19.0 or latest 18.x LTS

## Troubleshooting

### Issue: 'npm' is not recognized

**Solution**: 
- Restart your terminal/command prompt
- Verify Node.js is installed: `node --version`
- If still not working, reinstall Node.js and select "Add to PATH" option

### Issue: Port already in use

**Solution**:
```bash
# Kill process on port 5173
# On Windows PowerShell
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Then restart dev server
npm run dev
```

### Issue: Module not found errors

**Solution**:
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Build fails

**Solution**:
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Quick Start (TL;DR)

```bash
# 1. Install Node.js 18.x from nodejs.org

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open http://localhost:5173 in browser
```

## Docker Alternative

If you prefer using Docker:

```bash
# Build Docker image
docker build -t import-export-app .

# Run container
docker run -p 4173:4173 import-export-app

# Access at http://localhost:4173
```

## Support

For issues or questions:
1. Check Node.js version: `node --version` (should be 18.x)
2. Delete `node_modules` and reinstall: `npm install`
3. Check console for error messages
4. Verify all files are present in project folder

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ❌ Internet Explorer (not supported)

