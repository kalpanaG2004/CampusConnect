# Firebase IDX Migration Guide

This project has been migrated to work with Firebase IDX (now Firebase Studio). This document outlines the changes made and how to work with the project in Firebase IDX.

## 🚀 Quick Start in Firebase IDX

1. **Open in Firebase Studio**: Visit [https://studio.firebase.google.com/](https://studio.firebase.google.com/)
2. **Import Repository**: Import this repository into Firebase Studio
3. **Wait for Setup**: The workspace will automatically set up both frontend and backend environments
4. **Start Development**: Use the preview panels to see your app running

## 📁 Project Structure

```
/
├── .idx/
│   └── dev.nix              # Firebase IDX configuration
├── backend/                 # FastAPI backend
│   ├── main.py             # FastAPI app with IDX-compatible CORS
│   ├── requirements.txt    # Python dependencies
│   └── ...
├── frontend/               # React frontend
│   ├── package.json       # Node.js dependencies
│   ├── src/               # React source code
│   └── ...
└── README-FIREBASE-IDX.md  # This file
```

## 🔧 Configuration Changes

### 1. Firebase IDX Configuration (`.idx/dev.nix`)

- **Environment**: Python 3.11 + Node.js 20
- **Packages**: Includes OpenSSL, Git, Curl
- **Previews**: Configured for both React frontend and FastAPI backend
- **Auto-setup**: Automatically installs dependencies on workspace creation

### 2. Backend Changes

- **CORS Origins**: Updated to include Firebase IDX preview URLs:
  - `https://*.googleusercontent.com`
  - `https://*.cloudworkstations.dev`
  - `https://*.studio.firebase.google.com`

### 3. Gitignore Updates

- Added `.idx/` directory
- Added `.nix-profiler`
- Added IDE-specific files

## 🌐 Preview URLs

Firebase IDX provides automatic preview URLs for both services:

- **Frontend (React)**: Accessible via the "web" preview panel
- **Backend (FastAPI)**: Accessible via the "api" preview panel on port 8000

## 🛠 Development Workflow

### Frontend Development
```bash
cd frontend
npm start
```

### Backend Development
```bash
cd backend
source .venv/bin/activate  # Virtual environment is auto-created
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Full-Stack Development
Use the Firebase IDX preview panels to see both frontend and backend running simultaneously.

## 🔄 Environment Setup

The `dev.nix` file handles:

- **onCreate**: Initial setup of Python venv and npm dependencies
- **onStart**: Dependency updates and environment checks
- **Previews**: Automatic configuration of development servers

## 🚨 Important Notes

1. **Port Configuration**: 
   - Frontend uses the `$PORT` environment variable (auto-assigned by IDX)
   - Backend uses port 8000 (configurable in dev.nix)

2. **Virtual Environment**: 
   - Python virtual environment is automatically created in `backend/.venv/`
   - No manual activation needed for previews

3. **CORS**: 
   - Backend is configured to accept requests from IDX preview URLs
   - Credentials are enabled for authenticated requests

4. **Extensions**: 
   - Recommended VS Code extensions are auto-installed
   - Includes Python, TypeScript, Tailwind CSS, and Prettier support

## 🐛 Troubleshooting

### Common Issues:

1. **Dependencies not installing**: Check the terminal output during workspace startup
2. **CORS errors**: Ensure your frontend is making requests to the correct backend URL
3. **Preview not loading**: Check that the services are running on the correct ports

### Debug Commands:

```bash
# Check Python environment
cd backend && python --version && which python

# Check Node.js environment  
cd frontend && node --version && npm --version

# Check running processes
ps aux | grep -E "(uvicorn|node)"
```

## 📚 Resources

- [Firebase Studio Documentation](https://developers.google.com/idx)
- [dev.nix Reference](https://developers.google.com/idx/guides/devnix-reference)
- [Firebase Studio Community](https://community.firebasestudio.dev/)

## 🤝 Contributing

When contributing to this project in Firebase IDX:

1. The workspace configuration is version controlled
2. Changes to `dev.nix` affect all team members
3. Test your changes in a clean workspace before committing

---

**Note**: This project is now optimized for Firebase IDX. For local development, you may need to adjust the CORS configuration and port settings.