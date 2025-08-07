# TaskMate Deployment Guide for Render

This guide will help you deploy your TaskMate application on Render using H2 database.

## 🚀 Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Java 21**: Ensure your application uses Java 21

## 📋 Changes Made for Render Deployment

### 1. Database Migration (MySQL → H2)
- ✅ Replaced MySQL dependency with H2 in `pom.xml`
- ✅ Updated `application.properties` for H2 configuration
- ✅ Created `application-render.properties` for Render-specific settings
- ✅ H2 database will be file-based and stored in the `/data` directory

### 2. Frontend Updates
- ✅ Updated `app.js` to dynamically detect deployment environment
- ✅ API calls will work both locally and on Render

### 3. Docker Configuration
- ✅ Created `Dockerfile.render` optimized for Render
- ✅ Added data directory creation for H2 database
- ✅ Set proper environment variables

## 🛠️ Deployment Steps

### Step 1: Push Code to GitHub
```bash
# Ensure all changes are committed and pushed
git add .
git commit -m "Configure for Render deployment with H2 database"
git push origin main
```

### Step 2: Deploy on Render

#### Option A: Using render.yaml (Recommended)
1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Click "Apply" to deploy

#### Option B: Manual Deployment
1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `taskmate-app`
   - **Environment**: `Docker`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Dockerfile Path**: `Dockerfile.render`
   - **Health Check Path**: `/api/health`
5. Click "Create Web Service"

### Step 3: Environment Variables (Optional)
If you need to customize settings, add these environment variables in Render dashboard:

| Variable | Value | Description |
|----------|-------|-------------|
| `SPRING_PROFILES_ACTIVE` | `render` | Activates Render profile |
| `JAVA_OPTS` | `-Xmx1024m -Xms512m -XX:+UseG1GC` | JVM memory settings |
| `JWT_SECRET` | `your_custom_secret_key` | Custom JWT secret |

### Step 4: Wait for Deployment
- Render will build and deploy your application
- First deployment may take 5-10 minutes
- Subsequent deployments will be faster

## 🔍 Verification

### 1. Health Check
Visit: `https://your-app-name.onrender.com/api/health`
Expected response: `{"status":"UP"}`

### 2. H2 Console (Development Only)
Visit: `https://your-app-name.onrender.com/h2-console`
- JDBC URL: `jdbc:h2:file:./data/taskmate_db`
- Username: `sa`
- Password: `password`

### 3. Application
Visit: `https://your-app-name.onrender.com`
- Register a new user
- Create and manage tasks
- Test all functionality

## 📊 Monitoring

### Render Dashboard
- Monitor logs in real-time
- Check resource usage
- View deployment history
- Set up alerts

### Application Logs
- Access logs via Render dashboard
- Monitor for errors and performance issues

## 🔧 Troubleshooting

### Common Issues

#### 1. Build Failures
- Check if Java 21 is specified in `pom.xml`
- Verify all dependencies are correct
- Check Dockerfile syntax

#### 2. Database Issues
- H2 database is file-based and persistent
- Data will be lost on service restart (free tier limitation)
- Consider upgrading to paid plan for persistent storage

#### 3. Port Issues
- Render automatically sets the `PORT` environment variable
- Application uses `${PORT:8080}` to handle this

#### 4. Memory Issues
- Free tier has memory limitations
- Adjust `JAVA_OPTS` if needed
- Monitor memory usage in dashboard

### Debug Commands
```bash
# Check application logs
# Use Render dashboard → Logs tab

# Test health endpoint
curl https://your-app-name.onrender.com/api/health

# Test API endpoints
curl https://your-app-name.onrender.com/api/auth/register-user
```

## 🔄 Updates and Maintenance

### Automatic Deployments
- Render automatically deploys on `main` branch pushes
- No manual intervention required

### Manual Deployments
1. Go to Render dashboard
2. Select your service
3. Click "Manual Deploy"
4. Choose branch/commit

### Database Management
- H2 console available at `/h2-console`
- Export data if needed
- Consider migration to external database for production

## 💰 Cost Considerations

### Free Tier Limitations
- 750 hours/month
- 512MB RAM
- Shared CPU
- No persistent storage (data lost on restart)

### Paid Plans
- $7/month for persistent storage
- Better performance and reliability
- Custom domains
- SSL certificates

## 🎉 Success!

Your TaskMate application is now deployed on Render with:
- ✅ H2 database (file-based)
- ✅ Automatic deployments
- ✅ Health monitoring
- ✅ SSL certificates
- ✅ Global CDN

## 📞 Support

- **Render Documentation**: [docs.render.com](https://docs.render.com)
- **Render Community**: [community.render.com](https://community.render.com)
- **GitHub Issues**: For application-specific issues

---

**Note**: This deployment uses H2 database which is suitable for development and small applications. For production use with multiple users, consider migrating to a managed database service like PostgreSQL on Render or AWS RDS.
