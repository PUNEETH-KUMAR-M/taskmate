# ☁️ TaskMate AWS Elastic Beanstalk Deployment Guide

This guide will walk you through deploying TaskMate on AWS Elastic Beanstalk using the free tier.

## 📋 Prerequisites

### **Required Software**
1. **AWS Account** - [Create here](https://aws.amazon.com/)
2. **AWS CLI** - [Install here](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
3. **Python 3.7+** - [Download here](https://www.python.org/downloads/)
4. **Git** - [Download here](https://git-scm.com/)

### **AWS Free Tier Limits**
- **EC2**: 750 hours/month (t3.micro)
- **RDS**: 750 hours/month (db.t3.micro)
- **EBS**: 30GB storage
- **Data Transfer**: 15GB/month

## 🚀 Step-by-Step Deployment

### **Step 1: AWS Account Setup**

1. **Create AWS Account**
   - Go to [AWS Console](https://aws.amazon.com/)
   - Click "Create an AWS Account"
   - Follow the registration process
   - Add payment method (required for free tier)

2. **Install AWS CLI**
   ```bash
   # Windows (using installer)
   # Download from: https://awscli.amazonaws.com/AWSCLIV2.msi
   
   # macOS
   brew install awscli
   
   # Linux
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   ```

3. **Configure AWS Credentials**
   ```bash
   aws configure
   # Enter your AWS Access Key ID
   # Enter your AWS Secret Access Key
   # Enter your default region (e.g., us-east-1)
   # Enter your output format (json)
   ```

### **Step 2: Install EB CLI**

```bash
# Install Elastic Beanstalk CLI
pip install awsebcli

# Verify installation
eb --version
```

### **Step 3: Prepare Your Project**

```bash
# Navigate to your project
cd taskmate

# Make sure all files are committed
git add .
git commit -m "Prepare for AWS Elastic Beanstalk deployment"
git push origin main
```

### **Step 4: Initialize Elastic Beanstalk**

```bash
# Initialize EB in your project directory
eb init

# Follow the prompts:
# 1. Select your region (e.g., us-east-1)
# 2. Enter application name: taskmate
# 3. Select platform: Java
# 4. Select platform branch: Java 21
# 5. Select platform version: Latest
# 6. Set up SSH: No (for now)
# 7. Select keypair: Skip (for now)
```

### **Step 5: Create Database (RDS)**

**Option A: Using the provided script**
```bash
# Make script executable (Linux/Mac)
chmod +x setup-rds.sh
./setup-rds.sh

# Or on Windows
setup-rds.bat
```

**Option B: Manual creation**
```bash
# Create RDS database
aws rds create-db-instance \
  --db-instance-identifier taskmate-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --engine-version 8.0.35 \
  --master-username admin \
  --master-user-password TaskMateSecure123! \
  --allocated-storage 20 \
  --storage-type gp2 \
  --region us-east-1 \
  --vpc-security-group-ids default \
  --db-name taskmate_db

# Wait for database to be available
aws rds wait db-instance-available --db-instance-identifier taskmate-db

# Get database endpoint
aws rds describe-db-instances \
  --db-instance-identifier taskmate-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text
```

### **Step 6: Create Elastic Beanstalk Environment**

```bash
# Create environment (free tier compatible)
eb create taskmate-env \
  --instance-type t3.micro \
  --single-instance \
  --region us-east-1

# This will take 5-10 minutes to complete
```

### **Step 7: Configure Environment Variables**

```bash
# Get your database endpoint
DB_ENDPOINT=$(aws rds describe-db-instances \
  --db-instance-identifier taskmate-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text)

# Set environment variables
eb setenv SPRING_PROFILES_ACTIVE=aws
eb setenv DATABASE_URL=jdbc:mysql://$DB_ENDPOINT:3306/taskmate_db
eb setenv DATABASE_USERNAME=admin
eb setenv DATABASE_PASSWORD=TaskMateSecure123!
eb setenv JWT_SECRET=your_very_long_secret_key_at_least_256_bits_long_for_security_xyz123456789012345678901234567890
```

### **Step 8: Deploy Application**

```bash
# Deploy to Elastic Beanstalk
eb deploy

# This will build and deploy your application
# Wait for deployment to complete (3-5 minutes)
```

### **Step 9: Open Your Application**

```bash
# Open your application in browser
eb open

# Or get the URL
eb status
```

## 🔧 Configuration Files

### **Elastic Beanstalk Configuration**
The following files are already configured in your project:

- `.ebextensions/01_environment.config` - Environment settings
- `.ebextensions/02_nginx.config` - Nginx proxy configuration
- `Procfile` - Process definition
- `application-aws.properties` - AWS-specific configuration

### **Environment Variables**

| Variable | Description | Value |
|----------|-------------|-------|
| `SPRING_PROFILES_ACTIVE` | Spring profile | `aws` |
| `DATABASE_URL` | RDS connection URL | `jdbc:mysql://your-endpoint:3306/taskmate_db` |
| `DATABASE_USERNAME` | Database username | `admin` |
| `DATABASE_PASSWORD` | Database password | `TaskMateSecure123!` |
| `JWT_SECRET` | JWT secret key | `your_256_bit_secret_key` |

## 🗄️ Database Security

### **Security Group Configuration**
```bash
# Get your EB environment security group
EB_SG=$(aws elasticbeanstalk describe-environments \
  --environment-names taskmate-env \
  --query 'Environments[0].Resources.LoadBalancer.SecurityGroups[0]' \
  --output text)

# Allow RDS access from EB
aws ec2 authorize-security-group-ingress \
  --group-id $EB_SG \
  --protocol tcp \
  --port 3306 \
  --source-group $EB_SG
```

## 📊 Monitoring and Health Checks

### **Health Check Endpoints**
- `/api/health` - Application health
- `/api/tasks` - Tasks endpoint health check

### **CloudWatch Monitoring**
- Logs are automatically sent to CloudWatch
- View logs: `eb logs`
- Monitor metrics in AWS Console

## 🔍 Troubleshooting

### **Common Issues**

1. **Database Connection Failed**
   ```bash
   # Check security groups
   aws ec2 describe-security-groups --group-ids $EB_SG
   
   # Check RDS status
   aws rds describe-db-instances --db-instance-identifier taskmate-db
   ```

2. **Application Won't Start**
   ```bash
   # Check logs
   eb logs
   
   # Check environment health
   eb health
   ```

3. **Memory Issues**
   ```bash
   # Check instance type
   eb status
   
   # Consider upgrading to t3.small if needed
   eb config
   ```

### **Useful Commands**

```bash
# View environment status
eb status

# View logs
eb logs

# SSH into instance (if configured)
eb ssh

# Open application
eb open

# Terminate environment
eb terminate taskmate-env
```

## 💰 Cost Management

### **Free Tier Limits**
- **EC2**: 750 hours/month (t3.micro)
- **RDS**: 750 hours/month (db.t3.micro)
- **EBS**: 30GB storage
- **Data Transfer**: 15GB/month

### **Cost Optimization**
- Use single-instance deployment for free tier
- Monitor usage in AWS Billing Dashboard
- Set up billing alerts
- Terminate resources when not needed

## 🚀 Quick Commands Summary

```bash
# 1. Setup
pip install awsebcli
aws configure

# 2. Initialize
eb init

# 3. Create database
./setup-rds.sh  # or setup-rds.bat on Windows

# 4. Create environment
eb create taskmate-env --instance-type t3.micro --single-instance

# 5. Configure environment variables
eb setenv SPRING_PROFILES_ACTIVE=aws
eb setenv DATABASE_URL=jdbc:mysql://your-endpoint:3306/taskmate_db
eb setenv DATABASE_USERNAME=admin
eb setenv DATABASE_PASSWORD=TaskMateSecure123!
eb setenv JWT_SECRET=your_secret_key

# 6. Deploy
eb deploy

# 7. Open application
eb open
```

## 🌐 Your Application URL

After deployment, your application will be available at:
`http://taskmate-env.elasticbeanstalk.com`

## 📝 Next Steps

1. **Test your application** - Verify all features work
2. **Set up monitoring** - Configure CloudWatch alarms
3. **Configure SSL** - Add HTTPS certificate
4. **Set up CI/CD** - Automate deployments
5. **Scale up** - Upgrade to paid tier when needed

---

**🎉 Congratulations! Your TaskMate application is now deployed on AWS Elastic Beanstalk!** 