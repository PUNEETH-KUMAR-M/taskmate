#!/bin/bash

# TaskMate Deployment Script for Render
echo "🚀 TaskMate Deployment Script"
echo "=============================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository. Please initialize git first:"
    echo "   git init"
    echo "   git remote add origin <your-repo-url>"
    exit 1
fi

# Add all files
echo "📁 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Add Docker and Render configuration for deployment"

# Push to remote
echo "🚀 Pushing to remote repository..."
git push origin main

echo ""
echo "✅ Deployment files have been pushed to your repository!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://dashboard.render.com"
echo "2. Click 'New +' → 'Blueprint'"
echo "3. Connect your GitHub repository"
echo "4. Render will automatically detect the render.yaml file"
echo "5. Click 'Apply' to deploy"
echo ""
echo "🌐 Your application will be available at: https://your-app-name.onrender.com"
echo ""
echo "📝 Environment variables will be automatically configured by Render." 