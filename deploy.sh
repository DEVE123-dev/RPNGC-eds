#!/bin/bash

echo "🚀 RPNGC Dispatch - Quick Deploy Script"
echo "========================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Ready for deployment"
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

echo ""
echo "Choose deployment platform:"
echo "1) Render (Recommended - Free)"
echo "2) Railway"
echo "3) Heroku"
echo "4) Docker (Local)"
echo "5) Skip - Just prepare files"
echo ""
read -p "Enter choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "📋 Render Deployment Steps:"
        echo "1. Push code to GitHub"
        echo "2. Go to https://render.com"
        echo "3. Click 'New +' → 'Web Service'"
        echo "4. Connect your GitHub repo"
        echo "5. Render will auto-detect render.yaml"
        echo "6. Add environment variables:"
        echo "   - MONGO_URI: Your MongoDB connection string"
        echo "   - JWT_SECRET: (auto-generated or set your own)"
        echo "7. Click 'Create Web Service'"
        echo ""
        read -p "Press Enter to open Render.com..." 
        start https://render.com 2>/dev/null || open https://render.com 2>/dev/null || xdg-open https://render.com 2>/dev/null
        ;;
    2)
        echo ""
        echo "📋 Railway Deployment Steps:"
        echo "1. Push code to GitHub"
        echo "2. Go to https://railway.app"
        echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
        echo "4. Select your repo"
        echo "5. Add environment variables in Railway dashboard"
        echo ""
        read -p "Press Enter to open Railway.app..." 
        start https://railway.app 2>/dev/null || open https://railway.app 2>/dev/null || xdg-open https://railway.app 2>/dev/null
        ;;
    3)
        echo ""
        echo "📋 Heroku Deployment:"
        if ! command -v heroku &> /dev/null; then
            echo "❌ Heroku CLI not installed"
            echo "Install: https://devcenter.heroku.com/articles/heroku-cli"
        else
            echo "Creating Heroku app..."
            heroku create rpngc-dispatch-$(date +%s)
            echo ""
            echo "⚠️  Set environment variables:"
            echo "heroku config:set MONGO_URI='your_connection_string'"
            echo "heroku config:set JWT_SECRET='your_secret_key'"
            echo ""
            read -p "Press Enter after setting variables to deploy..."
            git push heroku main
            heroku open
        fi
        ;;
    4)
        echo ""
        echo "🐳 Building Docker image..."
        docker build -t rpngc-dispatch .
        echo ""
        echo "✅ Docker image built!"
        echo ""
        echo "To run:"
        echo "docker run -d -p 8000:8000 \\"
        echo "  -e MONGO_URI='your_connection_string' \\"
        echo "  -e JWT_SECRET='your_secret_key' \\"
        echo "  --name rpngc-dispatch \\"
        echo "  rpngc-dispatch"
        ;;
    5)
        echo ""
        echo "✅ Files prepared for deployment"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment preparation complete!"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
