# 🚀 TaskMate - Real-time Task Management System

<div align="center">

![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.4-green?style=for-the-badge&logo=spring-boot)
![H2 Database](https://img.shields.io/badge/H2-Database-blue?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-Authentication-yellow?style=for-the-badge)
![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-purple?style=for-the-badge)

**Live Demo: [https://taskmate-1-kryj.onrender.com](https://taskmate-1-kryj.onrender.com)**

*A modern, full-stack task management application built with Spring Boot, featuring real-time updates, role-based access control, and beautiful UI.*

</div>

---

## 🎯 **Live Demo Features**

### **🎮 Try It Now!**
- **Live Demo**: [https://taskmate-1-kryj.onrender.com](https://taskmate-1-kryj.onrender.com)
- **Demo Credentials**:
  - **Admin**: `admin@demo.com` / `demo123`
  - **User**: `user@demo.com` / `demo123`
- **Data resets on page refresh** for fresh demo experience

### **✨ What You Can Experience**
- 🔐 **User Authentication** with JWT tokens
- 👥 **Role-based Access Control** (Admin/User)
- 📋 **Task Management** with CRUD operations
- 🎨 **Beautiful UI** with gradients and animations
- ⚡ **Real-time Updates** via WebSocket
- 📱 **Responsive Design** for all devices
- 🚀 **Auto-demo Mode** with sample data

---

## 🛠️ **Technology Stack**

### **Backend**
- **Java 21** - Latest LTS version
- **Spring Boot 3.5.4** - Modern framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database operations
- **H2 Database** - In-memory database
- **JWT** - Stateless authentication
- **WebSocket** - Real-time communication
- **Maven** - Dependency management

### **Frontend**
- **HTML5/CSS3** - Modern responsive design
- **JavaScript (ES6+)** - Dynamic interactions
- **Thymeleaf** - Server-side templating
- **Font Awesome** - Beautiful icons
- **WebSocket Client** - Real-time updates

### **Deployment**
- **Render** - Cloud hosting platform
- **Docker** - Containerization
- **H2 Database** - File-based storage

---

## 🎨 **UI/UX Features**

### **Design Highlights**
- 🌈 **Gradient Backgrounds** - Purple to blue gradients
- ✨ **Glassmorphism Effects** - Modern glass-like UI
- 🎭 **Smooth Animations** - Floating cards and hover effects
- 📱 **Mobile Responsive** - Works on all devices
- 🎯 **Intuitive Navigation** - Easy-to-use interface

### **Interactive Elements**
- 🔄 **Real-time Updates** - Live task status changes
- 📊 **Dashboard Statistics** - Task and user counts
- 🏷️ **Priority Badges** - Color-coded task priorities
- 📅 **Deadline Tracking** - Visual date indicators
- 👤 **User Assignment** - Drag-and-drop task assignment

---

## 🚀 **Key Features**

### **1. Authentication & Authorization**
```java
// JWT-based authentication
@PostMapping("/auth/login")
public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request)

// Role-based access control
@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/task")
public ResponseEntity<List<Task>> getAllTasks()
```

### **2. Task Management**
```java
// Create tasks with assignment
@PostMapping("/task/create-task")
public ResponseEntity<Task> createTask(@RequestBody TaskRequest request, @RequestParam Long userId)

// Update task status
@PutMapping("/user/task/{taskId}")
public ResponseEntity<Task> updateTaskStatus(@PathVariable Long taskId, @RequestParam String status)
```

### **3. Real-time Updates**
```java
// WebSocket configuration
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").withSockJS();
    }
}
```

### **4. Database Design**
```sql
-- User entity with roles
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role ENUM('ADMIN', 'USER')
);

-- Task entity with relationships
CREATE TABLE tasks (
    id BIGINT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    deadline DATE,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED'),
    assigned_to_id BIGINT REFERENCES users(id)
);
```

---

## 📊 **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (HTML/CSS/JS) │◄──►│   Spring Boot   │◄──►│   H2 Database   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐             │
         └──────────────►│   WebSocket     │◄────────────┘
                        │   (Real-time)   │
                        └─────────────────┘
```

---

## 🎯 **Demo Instructions**

### **For LinkedIn Viewers**

1. **Visit the Live Demo**: [https://taskmate-1-kryj.onrender.com](https://taskmate-1-kryj.onrender.com)

2. **Auto-Demo Mode**:
   - Page automatically logs in as admin
   - Demo data is created automatically
   - Data resets on page refresh

3. **Try These Features**:
   - ✅ **Login/Register** with demo credentials
   - ✅ **Create Tasks** and assign to users
   - ✅ **Update Task Status** (Pending → In Progress → Completed)
   - ✅ **View Dashboard** with statistics
   - ✅ **Switch Between Roles** (Admin/User)
   - ✅ **Real-time Updates** via WebSocket

4. **Demo Credentials**:
   ```
   Admin: admin@demo.com / demo123
   User:  user@demo.com / demo123
   ```

---

## 🔧 **Technical Implementation**

### **Security Implementation**
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/task/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
```

### **WebSocket Real-time Updates**
```javascript
// Connect to WebSocket
const socket = new SockJS('/ws');
const stompClient = Stomp.over(socket);

stompClient.subscribe('/topic/tasks', function(message) {
    const task = JSON.parse(message.body);
    showNotification(`Task updated: ${task.title}`, 'info');
    loadDashboardData();
});
```

### **Responsive CSS Design**
```css
/* Gradient background */
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

/* Glassmorphism navigation */
.navbar {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}
```

---

## 🚀 **Deployment on Render**

### **Free Tier Features**
- ✅ **750 hours/month** - Continuous uptime
- ✅ **512MB RAM** - Optimized for the application
- ✅ **SSL Certificate** - Secure HTTPS connection
- ✅ **Global CDN** - Fast loading worldwide
- ✅ **Auto-deploy** - Updates on git push

### **Deployment Configuration**
```yaml
# render.yaml
services:
  - type: web
    name: taskmate-app
    env: docker
    plan: free
    dockerfilePath: ./Dockerfile.render.simple
    healthCheckPath: /api/health
    autoDeploy: true
```

---

## 📈 **Performance Optimizations**

### **Memory Management**
- **JVM Settings**: `-Xmx512m -Xms256m` for free tier
- **Database**: H2 file-based for persistence
- **Caching**: Static resource caching (1 hour)

### **Frontend Optimizations**
- **Minified CSS/JS** for faster loading
- **Font Awesome CDN** for icons
- **Responsive images** and lazy loading

---

## 🎉 **Project Highlights**

### **What Makes This Special**
- 🎯 **Production Ready** - Deployed and working
- 🔐 **Secure** - JWT authentication with role-based access
- ⚡ **Real-time** - WebSocket for live updates
- 🎨 **Beautiful UI** - Modern design with animations
- 📱 **Responsive** - Works on all devices
- 🚀 **Scalable** - Clean architecture for growth

### **Learning Outcomes**
- **Full-stack Development** - Frontend to backend
- **Spring Boot Ecosystem** - Security, Data, WebSocket
- **Modern JavaScript** - ES6+, async/await, WebSocket
- **CSS3 Features** - Gradients, animations, responsive design
- **Cloud Deployment** - Render platform configuration
- **Database Design** - JPA relationships and queries

---

## 🔗 **Links**

- **Live Demo**: [https://taskmate-1-kryj.onrender.com](https://taskmate-1-kryj.onrender.com)
- **GitHub Repository**: [Your GitHub Link]
- **LinkedIn Profile**: [Your LinkedIn]

---

**Built with ❤️ by Puneeth Kumar M**

*Backend Developer | Spring Boot | Java | Full-Stack Development*

---

<div align="center">

**🎯 Ready to explore? Visit the live demo and experience the full functionality!**

[**Try TaskMate Now**](https://taskmate-1-kryj.onrender.com)

</div>
