# ☁️ TaskMate AWS Deployment Guide

This guide will help you deploy your TaskMate application on AWS using various deployment options.

## 🚀 AWS Deployment Options

### Option 1: AWS Elastic Beanstalk (Recommended)
- **Pros**: Easy deployment, auto-scaling, managed environment
- **Cons**: Less control over infrastructure
- **Best for**: Quick deployment, managed service

### Option 2: AWS ECS with Fargate
- **Pros**: Container-based, serverless, auto-scaling
- **Cons**: More complex setup
- **Best for**: Containerized applications, microservices

### Option 3: AWS EC2
- **Pros**: Full control, customizable
- **Cons**: Manual management, more complex
- **Best for**: Custom requirements, full control

## 📋 Prerequisites

- [AWS Account](https://aws.amazon.com/)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [Docker](https://docs.docker.com/get-docker/)
- [Git](https://git-scm.com/)

## 🚀 Option 1: AWS Elastic Beanstalk Deployment

### Step 1: Install EB CLI
```bash
pip install awsebcli
```

### Step 2: Initialize Elastic Beanstalk
```bash
eb init
# Follow the prompts to configure your AWS region and application
```

### Step 3: Create Environment
```bash
eb create taskmate-env --instance-type t3.small --database.engine mysql
```

### Step 4: Configure Environment Variables
```bash
eb setenv SPRING_PROFILES_ACTIVE=aws
eb setenv DATABASE_URL=jdbc:mysql://your-rds-endpoint:3306/taskmate_db
eb setenv DATABASE_USERNAME=your_username
eb setenv DATABASE_PASSWORD=your_password
eb setenv JWT_SECRET=your_256_bit_secret_key
```

### Step 5: Deploy
```bash
eb deploy
```

## 🐳 Option 2: AWS ECS with Fargate

### Step 1: Build and Push Docker Image
```bash
# Build image
docker build -t taskmate .

# Create ECR repository
aws ecr create-repository --repository-name taskmate

# Get login token
aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-account-id.dkr.ecr.your-region.amazonaws.com

# Tag and push image
docker tag taskmate:latest your-account-id.dkr.ecr.your-region.amazonaws.com/taskmate:latest
docker push your-account-id.dkr.ecr.your-region.amazonaws.com/taskmate:latest
```

### Step 2: Create ECS Cluster
```bash
aws ecs create-cluster --cluster-name taskmate-cluster
```

### Step 3: Create Task Definition
Create `task-definition.json`:
```json
{
  "family": "taskmate",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::your-account-id:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "taskmate",
      "image": "your-account-id.dkr.ecr.your-region.amazonaws.com/taskmate:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "SPRING_PROFILES_ACTIVE",
          "value": "aws"
        },
        {
          "name": "DATABASE_URL",
          "value": "jdbc:mysql://your-rds-endpoint:3306/taskmate_db"
        },
        {
          "name": "DATABASE_USERNAME",
          "value": "your_username"
        },
        {
          "name": "DATABASE_PASSWORD",
          "value": "your_password"
        },
        {
          "name": "JWT_SECRET",
          "value": "your_256_bit_secret_key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/taskmate",
          "awslogs-region": "your-region",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Step 4: Register Task Definition
```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### Step 5: Create Service
```bash
aws ecs create-service \
  --cluster taskmate-cluster \
  --service-name taskmate-service \
  --task-definition taskmate:1 \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345],securityGroups=[sg-12345],assignPublicIp=ENABLED}"
```

## 🖥️ Option 3: AWS EC2

### Step 1: Launch EC2 Instance
- Choose Amazon Linux 2 AMI
- Instance type: t3.small or larger
- Configure security groups (port 22, 80, 443, 8080)

### Step 2: Install Dependencies
```bash
# Update system
sudo yum update -y

# Install Docker
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Java
sudo yum install -y java-21-amazon-corretto

# Install Git
sudo yum install -y git
```

### Step 3: Deploy Application
```bash
# Clone repository
git clone https://github.com/your-username/taskmate.git
cd taskmate

# Build application
./mvnw clean package -DskipTests

# Build Docker image
docker build -t taskmate .

# Run container
docker run -d \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=aws \
  -e DATABASE_URL=jdbc:mysql://your-rds-endpoint:3306/taskmate_db \
  -e DATABASE_USERNAME=your_username \
  -e DATABASE_PASSWORD=your_password \
  -e JWT_SECRET=your_256_bit_secret_key \
  --name taskmate-app \
  taskmate
```

## 🗄️ Database Setup

### AWS RDS (Recommended)
1. **Create RDS Instance**
   - Engine: MySQL 8.0
   - Instance: db.t3.micro (free tier) or db.t3.small
   - Storage: 20GB (minimum)
   - Multi-AZ: Disabled (for cost)

2. **Configure Security Group**
   - Allow inbound MySQL (3306) from your application

3. **Get Connection Details**
   - Endpoint: your-instance.region.rds.amazonaws.com
   - Port: 3306
   - Database: taskmate_db

### AWS Aurora (Alternative)
- More scalable than RDS
- Better performance for high-traffic applications
- Higher cost

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SPRING_PROFILES_ACTIVE` | Spring profile (use 'aws') | Yes |
| `DATABASE_URL` | RDS connection URL | Yes |
| `DATABASE_USERNAME` | Database username | Yes |
| `DATABASE_PASSWORD` | Database password | Yes |
| `JWT_SECRET` | JWT secret key (256+ bits) | Yes |
| `PORT` | Application port | No (default: 8080) |

## 🔐 Security Considerations

### IAM Roles
- Create specific IAM roles for your application
- Follow principle of least privilege
- Use IAM roles instead of access keys

### Security Groups
- Restrict access to necessary ports only
- Use private subnets for databases
- Enable VPC flow logs

### SSL/TLS
- Use AWS Certificate Manager for SSL certificates
- Configure HTTPS redirects
- Enable HSTS headers

## 📊 Monitoring and Logging

### CloudWatch
- Enable CloudWatch logs
- Set up alarms for CPU, memory, errors
- Create dashboards for monitoring

### Application Monitoring
- Use Spring Boot Actuator endpoints
- Monitor `/actuator/health` endpoint
- Set up custom metrics

## 💰 Cost Optimization

### Free Tier
- EC2: 750 hours/month (t3.micro)
- RDS: 750 hours/month (db.t3.micro)
- EBS: 30GB storage
- Data transfer: 15GB/month

### Cost Optimization Tips
- Use Spot Instances for non-critical workloads
- Enable auto-scaling based on demand
- Use S3 for static assets
- Implement caching strategies

## 🚀 Quick Start Commands

### Elastic Beanstalk
```bash
# Initialize
eb init

# Create environment
eb create taskmate-env

# Deploy
eb deploy

# Open application
eb open
```

### ECS
```bash
# Build and push
docker build -t taskmate .
aws ecr get-login-password | docker login --username AWS --password-stdin your-account.dkr.ecr.region.amazonaws.com
docker tag taskmate:latest your-account.dkr.ecr.region.amazonaws.com/taskmate:latest
docker push your-account.dkr.ecr.region.amazonaws.com/taskmate:latest

# Deploy
aws ecs update-service --cluster taskmate-cluster --service taskmate-service --force-new-deployment
```

## 🔍 Troubleshooting

### Common Issues
1. **Database Connection**: Check security groups and network ACLs
2. **Memory Issues**: Increase heap size in JAVA_OPTS
3. **Port Conflicts**: Ensure port 8080 is open
4. **SSL Issues**: Verify certificate configuration

### Debugging
- Check CloudWatch logs
- Use `eb logs` for Elastic Beanstalk
- Monitor application logs via Docker logs

## 📈 Scaling

### Auto Scaling
- Configure auto-scaling groups
- Set up scaling policies
- Monitor scaling metrics

### Load Balancing
- Use Application Load Balancer
- Configure health checks
- Set up SSL termination

---

**🎉 Your TaskMate application is now ready for AWS deployment!**

Choose your preferred deployment method and follow the steps above. 