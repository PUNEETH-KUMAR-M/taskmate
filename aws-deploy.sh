#!/bin/bash

# TaskMate AWS Deployment Script
echo "☁️ TaskMate AWS Deployment Script"
echo "=================================="

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install AWS CLI first:"
    echo "   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
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
git commit -m "Add AWS deployment configuration"

# Push to remote
echo "🚀 Pushing to remote repository..."
git push origin main

echo ""
echo "✅ AWS deployment files have been pushed!"
echo ""
echo "☁️ AWS DEPLOYMENT OPTIONS:"
echo ""
echo "📋 Option 1: AWS Elastic Beanstalk (Recommended)"
echo "1. Install AWS CLI and configure credentials"
echo "2. Install EB CLI: pip install awsebcli"
echo "3. Initialize EB: eb init"
echo "4. Create environment: eb create taskmate-env"
echo "5. Deploy: eb deploy"
echo ""
echo "📋 Option 2: AWS ECS with Fargate"
echo "1. Build Docker image: docker build -t taskmate ."
echo "2. Push to ECR: aws ecr get-login-password | docker login"
echo "3. Create ECS cluster and service"
echo "4. Deploy using ECS CLI or AWS Console"
echo ""
echo "📋 Option 3: AWS EC2"
echo "1. Launch EC2 instance"
echo "2. Install Docker and Java"
echo "3. Build and run container"
echo "4. Configure security groups"
echo ""
echo "🗄️ DATABASE OPTIONS:"
echo "- AWS RDS (MySQL/PostgreSQL)"
echo "- AWS Aurora (MySQL/PostgreSQL)"
echo "- AWS DynamoDB (NoSQL)"
echo ""
echo "🌐 Your app will be available at your AWS endpoint"
echo ""
echo "📝 Next steps:"
echo "1. Choose your AWS deployment method"
echo "2. Set up database (RDS recommended)"
echo "3. Configure environment variables"
echo "4. Set up monitoring and logging" 