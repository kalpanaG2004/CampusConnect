# Firebase IDX configuration for React + FastAPI Full-Stack Application
# To learn more: https://developers.google.com/idx/guides/devnix-reference
{ pkgs, ... }: {
  # Use stable Nix channel for reliability
  channel = "stable-24.05";

  # System packages required for this full-stack application
  packages = [
    # Core runtime environments
    pkgs.nodejs_20              # Node.js 20 for React frontend
    pkgs.python311              # Python 3.11 for FastAPI backend
    pkgs.python311Packages.pip  # Python package manager

    # System dependencies for Python packages
    pkgs.openssl.dev           # Required for cryptography, passlib, python-jose
    pkgs.libffi.dev            # Required for cffi, cryptography
    pkgs.pkg-config            # Build configuration tool
    pkgs.gcc                   # Compiler for native extensions
    pkgs.zlib.dev              # Compression library for various packages

    # Database and networking tools
    pkgs.mongodb-tools         # MongoDB utilities (if needed for development)
    pkgs.curl                  # HTTP client for API testing
    pkgs.wget                  # Download tool

    # Development tools
    pkgs.git                   # Version control
    pkgs.jq                    # JSON processor for debugging APIs
    pkgs.tree                  # Directory structure visualization
    pkgs.htop                  # Process monitoring

    # Additional tools that might be useful
    pkgs.gnumake              # Build automation
    pkgs.unzip                # Archive extraction
  ];

  # Environment variables for the workspace
  env = {
    # Python configuration
    PYTHONUNBUFFERED = "1";                    # Immediate output for logs
    PYTHONDONTWRITEBYTECODE = "1";             # Don't create .pyc files
    PIP_NO_CACHE_DIR = "1";                    # Don't cache pip downloads
    PIP_DISABLE_PIP_VERSION_CHECK = "1";       # Disable pip version warnings

    # Node.js configuration
    NODE_ENV = "development";                   # Development mode
    GENERATE_SOURCEMAP = "true";               # Enable source maps for debugging

    # FastAPI configuration
    UVICORN_HOST = "0.0.0.0";                  # Listen on all interfaces
    UVICORN_PORT = "8000";                     # Backend port

    # NLTK data path (for natural language processing)
    NLTK_DATA = "/tmp/nltk_data";              # NLTK downloads location
  };

  idx = {
    # VS Code extensions for optimal development experience
    extensions = [
      # Python development
      "ms-python.python"                       # Python language support
      "ms-python.black-formatter"              # Python code formatting
      "ms-python.flake8"                       # Python linting
      "ms-python.mypy-type-checker"            # Python type checking

      # JavaScript/TypeScript development
      "ms-vscode.vscode-typescript-next"       # TypeScript support
      "esbenp.prettier-vscode"                 # Code formatting
      "dbaeumer.vscode-eslint"                 # JavaScript linting

      # Frontend-specific
      "bradlc.vscode-tailwindcss"              # Tailwind CSS IntelliSense
      "formulahendry.auto-rename-tag"          # HTML/JSX tag renaming
      "ms-vscode.vscode-json"                  # JSON support

      # API development
      "humao.rest-client"                      # REST API testing
      "ms-vscode.vscode-thunder-client"        # Alternative API client

      # General development
      "ms-vscode.vscode-docker"                # Docker support (if needed)
      "eamodio.gitlens"                        # Git integration
      "ms-vscode.hexeditor"                    # Binary file editor
    ];

    # Web preview configuration
    previews = {
      enable = true;
      
      previews = {
        # React frontend preview
        web = {
          command = [
            "npm"
            "run" 
            "start"
            "--"
            "--port" "$PORT"
            "--host" "0.0.0.0"
            "--disable-host-check"              # Allow external connections
          ];
          cwd = "frontend";                     # Run from frontend directory
          manager = "web";
          env = {
            PORT = "$PORT";                     # Use IDX-assigned port
            BROWSER = "none";                   # Don't auto-open browser
            CHOKIDAR_USEPOLLING = "true";      # Better file watching in containers
            WATCHPACK_POLLING = "true";        # Webpack polling for file changes
          };
        };

        # FastAPI backend preview  
        api = {
          command = [
            ".venv/bin/python"
            "-m"
            "uvicorn"
            "main:app"
            "--host" "0.0.0.0"
            "--port" "8000"
            "--reload"                          # Auto-reload on file changes
            "--reload-dir" "."                  # Watch current directory
            "--log-level" "info"               # Detailed logging
          ];
          cwd = "backend";                      # Run from backend directory
          manager = "web";
          env = {
            PORT = "8000";                      # Fixed backend port
            PYTHONPATH = ".";                   # Current directory in Python path
          };
        };
      };
    };

    # Workspace lifecycle hooks
    workspace = {
      # One-time setup when workspace is created
      onCreate = {
        # Set up Python backend environment
        setup-python-backend = ''
          echo "🐍 Setting up Python backend environment..."
          cd backend
          
          # Create virtual environment
          python3 -m venv .venv
          
          # Activate and upgrade pip
          source .venv/bin/activate
          pip install --upgrade pip setuptools wheel
          
          # Install Python dependencies
          if [ -f "requirements.txt" ]; then
            echo "📦 Installing Python dependencies..."
            pip install -r requirements.txt
            
            # Download NLTK data if NLTK is installed
            python -c "
import nltk
try:
    nltk.download('punkt', download_dir='/tmp/nltk_data', quiet=True)
    nltk.download('vader_lexicon', download_dir='/tmp/nltk_data', quiet=True)
    nltk.download('stopwords', download_dir='/tmp/nltk_data', quiet=True)
    print('✅ NLTK data downloaded successfully')
except Exception as e:
    print(f'⚠️  NLTK data download failed: {e}')
" 2>/dev/null || echo "⚠️  NLTK not available or download failed"
          else
            echo "❌ requirements.txt not found in backend directory"
          fi
          
          cd ..
        '';

        # Set up Node.js frontend environment
        setup-node-frontend = ''
          echo "⚛️  Setting up React frontend environment..."
          cd frontend
          
          if [ -f "package.json" ]; then
            echo "📦 Installing Node.js dependencies..."
            npm install
            
            # Build Tailwind CSS if needed
            if command -v tailwindcss >/dev/null 2>&1; then
              echo "🎨 Building Tailwind CSS..."
              npx tailwindcss build -o src/index.css 2>/dev/null || echo "⚠️  Tailwind build skipped"
            fi
          else
            echo "❌ package.json not found in frontend directory"
          fi
          
          cd ..
        '';

        # Final setup message
        setup-complete = ''
          echo ""
          echo "🎉 Workspace setup complete!"
          echo "   Frontend: React app with Tailwind CSS"
          echo "   Backend:  FastAPI with MongoDB support"
          echo "   Ready for full-stack development!"
          echo ""
        '';
      };

      # Run every time workspace starts
      onStart = {
        # Ensure Python environment is ready
        check-python-env = ''
          echo "🔍 Checking Python backend environment..."
          cd backend
          
          if [ ! -d ".venv" ]; then
            echo "🐍 Creating missing Python virtual environment..."
            python3 -m venv .venv
          fi
          
          source .venv/bin/activate
          pip install --upgrade pip >/dev/null 2>&1
          
          if [ -f "requirements.txt" ]; then
            echo "🔄 Updating Python dependencies..."
            pip install -r requirements.txt
          fi
          
          cd ..
        '';

        # Ensure Node.js environment is ready  
        check-node-env = ''
          echo "🔍 Checking React frontend environment..."
          cd frontend
          
          if [ -f "package.json" ]; then
            echo "🔄 Checking Node.js dependencies..."
            npm install
          fi
          
          cd ..
        '';

        # Display development URLs
        show-dev-info = ''
          echo ""
          echo "🚀 Development Environment Ready!"
          echo "   📱 Frontend Preview: Use the 'web' preview panel"
          echo "   🔌 Backend API: Use the 'api' preview panel (port 8000)"
          echo "   📚 API Docs: Visit <backend-url>/docs for FastAPI documentation"
          echo ""
          echo "⏱️  Starting preview servers in 3 seconds..."
          sleep 3
        '';
      };
    };
  };
}