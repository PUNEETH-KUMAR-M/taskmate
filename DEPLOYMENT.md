# 🚀 TaskMate Deployment Guide for Render

This guide will help you deploy your TaskMate application on Render using Docker.

## 📋 Prerequisites

- [Git](https://git-scm.com/) installed
- [GitHub](https://github.com/) account
- [Render](https://render.com/) account
- Your TaskMate application code

## 🛠️ Files Created for Deployment

The following files have been added to your project:

- `Dockerfile` - Multi-stage Docker build for the Spring Boot application
- `.dockerignore` - Excludes unnecessary files from Docker build
- `render.yaml` - Render deployment configuration
- `src/main/resources/application-prod.properties` - Production configuration
- `src/main/java/com/taskmate/controller/HealthController.java` - Health check endpoints
- `deploy.sh` / `deploy.bat` - Deployment scripts

## 🚀 Quick Deployment

### Option 1: Using Blueprint (Recommended)

1. **Push your code to GitHub**
   ```bash
   # Run the deployment script
   ./deploy.sh  # On Linux/Mac
   # OR
   deploy.bat   # On Windows
   ```

2. **Deploy on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file
   - Click "Apply" to deploy

### Option 2: Manual Deployment

1. **Create Database**
   - Go to Render Dashboard → "New +" → "PostgreSQL"
   - Choose plan and region
   - Note down connection details

2. **Create Web Service**
   - Go to "New +" → "Web Service"
   - Connect your GitHub repository
   - Set Environment: `Docker`
   - Set Build Command: `docker build -t taskmate .`
   - Set Start Command: `docker run -p $PORT:8080 taskmate`

3. **Configure Environment Variables**
   ```
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=jdbc:postgresql://your-db-host:5432/taskmate_db
   DATABASE_USERNAME=your_username
   DATABASE_PASSWORD=your_password
   JWT_SECRET=your_256_bit_secret_key
   PORT=8080
   ```

## 🔧 Configuration Details

### Dockerfile
- Uses OpenJDK 21 for building and running
- Multi-stage build for smaller final image
- Optimized for production deployment

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `SPRING_PROFILES_ACTIVE` | Spring profile | Yes | `prod` |
| `DATABASE_URL` | Database connection URL | Yes | - |
| `DATABASE_USERNAME` | Database username | Yes | - |
| `DATABASE_PASSWORD` | Database password | Yes | - |
| `JWT_SECRET` | JWT secret key (256+ bits) | Yes | Generated |
| `PORT` | Application port | No | `8080` |

### Health Check Endpoints

- `/api/health` - General health check
- `/api/tasks` - Tasks endpoint health check (used by Render)

## 🗄️ Database Setup

### Using Render PostgreSQL (Recommended)

1. Create PostgreSQL database in Render
2. Environment variables will be automatically configured
3. Database schema will be created automatically by Hibernate

### Using External Database

1. Update `DATABASE_URL` with your database connection string
2. Ensure database is accessible from Render
3. Create database schema manually if needed

## 🔍 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Dockerfile syntax
   - Ensure all dependencies are in pom.xml
   - Verify Java version compatibility

2. **Application Won't Start**
   - Check environment variables
   - Verify database connectivity
   - Check application logs in Render dashboard

3. **Database Connection Issues**
   - Verify database credentials
   - Check database accessibility
   - Ensure database schema exists

### Logs and Monitoring

- View logs in Render dashboard
- Monitor application health at `/api/health`
- Check database connectivity

## 📊 Performance Optimization

### Render Configuration
- **Plan**: Starter (free) or higher for production
- **Region**: Choose closest to your users
- **Auto-scaling**: Enable for high traffic

### Application Optimization
- JVM memory settings in Dockerfile
- Database connection pooling
- Caching strategies

## 🔐 Security Considerations

1. **Environment Variables**
   - Never commit secrets to repository
   - Use Render's environment variable management
   - Rotate JWT secrets regularly

2. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Restrict database access

3. **Application Security**
   - Keep dependencies updated
   - Use HTTPS in production
   - Implement proper CORS policies

## 📈 Scaling

### Vertical Scaling
- Upgrade Render plan for more resources
- Increase JVM memory settings

### Horizontal Scaling
- Enable auto-scaling in Render
- Use load balancers for multiple instances
- Implement session management

## 🆘 Support

- **Render Documentation**: [docs.render.com](https://docs.render.com)
- **Spring Boot Documentation**: [spring.io](https://spring.io)
- **Docker Documentation**: [docker.com](https://docker.com)

## 📝 Notes

- Render provides free tier with limitations
- Database connections may have timeouts
- Cold starts may occur on free tier
- Consider upgrading for production use

---

**Happy Deploying! 🎉** 