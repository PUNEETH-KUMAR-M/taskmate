#!/bin/bash

# TaskMate RDS Database Setup Script
echo "🗄️ TaskMate RDS Database Setup"
echo "================================"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install AWS CLI first:"
    echo "   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run:"
    echo "   aws configure"
    exit 1
fi

# Set variables
DB_INSTANCE_ID="taskmate-db"
DB_NAME="taskmate_db"
DB_USERNAME="admin"
DB_PASSWORD="TaskMateSecure123!"
REGION="us-east-1"

echo "📋 Creating RDS MySQL database..."
echo "Instance ID: $DB_INSTANCE_ID"
echo "Database: $DB_NAME"
echo "Username: $DB_USERNAME"
echo "Region: $REGION"
echo ""

# Create RDS instance
echo "🚀 Creating RDS instance (this may take 5-10 minutes)..."
aws rds create-db-instance \
  --db-instance-identifier $DB_INSTANCE_ID \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --engine-version 8.0.35 \
  --master-username $DB_USERNAME \
  --master-user-password $DB_PASSWORD \
  --allocated-storage 20 \
  --storage-type gp2 \
  --region $REGION \
  --vpc-security-group-ids default \
  --db-name $DB_NAME \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "sun:04:00-sun:05:00" \
  --deletion-protection

if [ $? -eq 0 ]; then
    echo "✅ RDS instance creation initiated successfully!"
    echo ""
    echo "⏳ Waiting for database to be available (this may take 5-10 minutes)..."
    
    # Wait for database to be available
    aws rds wait db-instance-available --db-instance-identifier $DB_INSTANCE_ID --region $REGION
    
    if [ $? -eq 0 ]; then
        echo "✅ Database is now available!"
        
        # Get database endpoint
        DB_ENDPOINT=$(aws rds describe-db-instances \
          --db-instance-identifier $DB_INSTANCE_ID \
          --region $REGION \
          --query 'DBInstances[0].Endpoint.Address' \
          --output text)
        
        echo ""
        echo "🗄️ Database Details:"
        echo "Endpoint: $DB_ENDPOINT"
        echo "Port: 3306"
        echo "Database: $DB_NAME"
        echo "Username: $DB_USERNAME"
        echo "Password: $DB_PASSWORD"
        echo ""
        echo "🔗 Connection URL:"
        echo "jdbc:mysql://$DB_ENDPOINT:3306/$DB_NAME"
        echo ""
        echo "📝 Next steps:"
        echo "1. Update your Elastic Beanstalk environment variables:"
        echo "   eb setenv DATABASE_URL=jdbc:mysql://$DB_ENDPOINT:3306/$DB_NAME"
        echo "   eb setenv DATABASE_USERNAME=$DB_USERNAME"
        echo "   eb setenv DATABASE_PASSWORD=$DB_PASSWORD"
        echo "2. Deploy your application: eb deploy"
        echo ""
        echo "⚠️  Security Note:"
        echo "- Change the default password in production"
        echo "- Configure security groups to restrict access"
        echo "- Enable encryption at rest"
    else
        echo "❌ Error waiting for database to be available"
        exit 1
    fi
else
    echo "❌ Error creating RDS instance"
    exit 1
fi 