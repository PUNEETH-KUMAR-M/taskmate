# 🚀 TaskMate - Task Management System

<div align="center">

![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.4-green?style=for-the-badge&logo=spring-boot)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)
![JWT](https://img.shields.io/badge/JWT-Authentication-yellow?style=for-the-badge)

*A modern task management application built with Spring Boot*

**Made with ❤️ by Puneeth Kumar M (Aspiring Backend Developer)**

</div>

---

## ✨ Features

- **Task Management**: Create, update, delete, and track tasks
- **User Authentication**: JWT-based secure authentication
- **Role-based Access**: Admin and User roles with different permissions
- **Real-time Updates**: WebSocket support for live task updates
- **Task Prioritization**: High, Medium, Low priority levels
- **Status Tracking**: Pending, In Progress, Completed statuses
- **Deadline Management**: Set and track task deadlines

---

## 🛠️ Technology Stack

**Backend**: Java 21, Spring Boot 3.5.4, Spring Security, Spring Data JPA, MySQL 8.0, JWT, Lombok
**Frontend**: Thymeleaf, HTML5/CSS3, JavaScript, WebSocket
**Tools**: Maven, Spring Boot DevTools, Postman for testing

---

## 🚀 Quick Start

### Prerequisites
- Java 21 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

### Setup
```bash
# Clone and navigate
git clone https://github.com/PUNEETH-KUMAR-M/taskmate.git
cd taskmate

# Configure database in application.properties
# Update MySQL credentials

# Run the application
./mvnw spring-boot:run
```

Access at: `http://localhost:8080`

---

## ⚙️ Configuration

Update `src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/taskmate_db
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT
jwt.secret=your_256_bit_secret_key_here
jwt.expiration=86400000

# Server
server.port=8080
```

---

## 🔧 API Endpoints

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
```

### Tasks
```http
GET    /api/tasks          # Get all tasks
POST   /api/tasks          # Create task
PUT    /api/tasks/{id}     # Update task
DELETE /api/tasks/{id}     # Delete task
```

### Users
```http
GET /api/users/profile     # Get profile
PUT /api/users/profile     # Update profile
```

### Admin (Admin Only)
```http
GET /api/admin/users       # Get all users
POST /api/admin/tasks/{taskId}/assign/{userId}  # Assign task
```

---

## 👥 User Roles

**User**: Create/manage personal tasks, update status, view assigned tasks
**Admin**: All user permissions + manage all users, assign tasks, admin dashboard

---

## 📊 Database Schema

### Users
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER'
);
```

### Tasks
```sql
CREATE TABLE tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deadline DATE,
    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'PENDING',
    priority ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🧪 Testing

```bash
# Run all tests
mvn test

# Run specific test
mvn test -Dtest=TaskServiceTest
```

---

## 📝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes and commit: `git commit -m "feat: add feature"`
4. Push and create Pull Request

---

## 🤝 Support

- **Issues**: Create an issue on GitHub
- **Contact**: pkmppn@gmail.com
- **GitHub**: [TaskMate Repository](https://github.com/PUNEETH-KUMAR-M/taskmate)

---

<div align="center">

**Empowering productivity through intelligent task management**

[![GitHub stars](https://img.shields.io/github/stars/PUNEETH-KUMAR-M/taskmate?style=social)](https://github.com/PUNEETH-KUMAR-M/taskmate)
[![GitHub forks](https://img.shields.io/github/forks/PUNEETH-KUMAR-M/taskmate?style=social)](https://github.com/PUNEETH-KUMAR-M/taskmate)

</div> 