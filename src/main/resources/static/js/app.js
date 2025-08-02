// Global variables
let currentUser = null;
let stompClient = null;
let authToken = null;

// API Base URL
const API_BASE = 'http://localhost:8080/api';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
        authToken = token;
        // TODO: Validate token and get user info
        showDashboard();
    }
    
    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Register form
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    
    // Create task form
    document.getElementById('createTaskForm').addEventListener('submit', handleCreateTask);
}

// Authentication Functions
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            
            // Get user info
            await getUserInfo(email);
            
            closeModal('loginModal');
            showDashboard();
            showNotification('Login successful!', 'success');
            
            // Connect to WebSocket
            connectWebSocket();
        } else {
            showNotification('Login failed. Please check your credentials.', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed. Please try again.', 'error');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;
    
    try {
        const endpoint = role === 'ADMIN' ? 'register-admin' : 'register-user';
        const response = await fetch(`${API_BASE}/auth/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            
            // Get user info
            await getUserInfo(email);
            
            closeModal('registerModal');
            showDashboard();
            showNotification('Registration successful!', 'success');
            
            // Connect to WebSocket
            connectWebSocket();
        } else {
            showNotification('Registration failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Registration failed. Please try again.', 'error');
    }
}

async function getUserInfo(email) {
    try {
        const response = await fetch(`${API_BASE}/profile/${email}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            currentUser = await response.json();
            updateUI();
        }
    } catch (error) {
        console.error('Error getting user info:', error);
    }
}

// Dashboard Functions
function showDashboard() {
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('userSection').style.display = 'flex';
    
    if (currentUser) {
        loadDashboardData();
    }
}

async function loadDashboardData() {
    if (currentUser.role === 'ADMIN') {
        await loadAdminDashboard();
    } else {
        await loadUserDashboard();
    }
}

async function loadAdminDashboard() {
    document.getElementById('adminSection').style.display = 'block';
    document.getElementById('userSection').style.display = 'none';
    
    try {
        console.log('🔍 Loading admin dashboard...');
        
        // Load all tasks
        const tasksResponse = await fetch(`${API_BASE}/task`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        console.log('📊 Tasks response status:', tasksResponse.status);
        
        if (tasksResponse.ok) {
            const tasks = await tasksResponse.json();
            console.log('📋 Tasks loaded:', tasks);
            displayTasks(tasks, 'allTasksList');
            updateStats(tasks);
        } else {
            console.error('❌ Failed to load tasks:', tasksResponse.status, tasksResponse.statusText);
        }
        
        // Load all users
        const usersResponse = await fetch(`${API_BASE}/profile/users`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        console.log('👥 Users response status:', usersResponse.status);
        
        if (usersResponse.ok) {
            const users = await usersResponse.json();
            console.log('👤 Users loaded:', users);
            populateUserSelect(users);
        } else {
            console.error('❌ Failed to load users:', usersResponse.status, usersResponse.statusText);
        }
    } catch (error) {
        console.error('❌ Error loading admin dashboard:', error);
    }
}

async function loadUserDashboard() {
    document.getElementById('adminSection').style.display = 'none';
    document.getElementById('userSection').style.display = 'block';
    
    try {
        const response = await fetch(`${API_BASE}/user/tasks?email=${currentUser.email}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const tasks = await response.json();
            displayTasks(tasks, 'userTasksList');
        }
    } catch (error) {
        console.error('Error loading user dashboard:', error);
    }
}

// Task Management Functions
async function handleCreateTask(event) {
    event.preventDefault();
    
    const taskData = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        deadline: document.getElementById('taskDeadline').value,
        priority: document.getElementById('taskPriority').value,
        comments: document.getElementById('taskComments').value
    };
    
    const userId = document.getElementById('taskAssignee').value;
    
    try {
        const response = await fetch(`${API_BASE}/task/create-task?userId=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(taskData)
        });
        
        if (response.ok) {
            const task = await response.json();
            showNotification('Task created successfully!', 'success');
            closeModal('createTaskModal');
            
            // Reload dashboard
            await loadDashboardData();
        } else {
            showNotification('Failed to create task.', 'error');
        }
    } catch (error) {
        console.error('Error creating task:', error);
        showNotification('Failed to create task.', 'error');
    }
}

async function updateTaskStatus(taskId, status) {
    try {
        const response = await fetch(`${API_BASE}/user/task/${taskId}?status=${status}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            showNotification('Task status updated!', 'success');
            await loadDashboardData();
        } else {
            showNotification('Failed to update task status.', 'error');
        }
    } catch (error) {
        console.error('Error updating task status:', error);
        showNotification('Failed to update task status.', 'error');
    }
}

// UI Functions
function displayTasks(tasks, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    if (tasks.length === 0) {
        container.innerHTML = '<p class="no-tasks">No tasks found.</p>';
        return;
    }
    
    tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        container.appendChild(taskCard);
    });
}

function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    
    const priorityClass = `priority-${task.priority.toLowerCase()}`;
    const statusClass = `status-${task.status.toLowerCase().replace('_', '-')}`;
    
    card.innerHTML = `
        <div class="task-header">
            <div>
                <div class="task-title">${task.title}</div>
                <div class="task-description">${task.description}</div>
            </div>
            <div class="task-priority ${priorityClass}">${task.priority}</div>
        </div>
        
        <div class="task-meta">
            <div class="task-deadline">
                <i class="fas fa-calendar"></i>
                ${new Date(task.deadline).toLocaleDateString()}
            </div>
            <div class="task-status ${statusClass}">${task.status}</div>
        </div>
        
        ${task.comments ? `<div class="task-comments">${task.comments}</div>` : ''}
        
        ${task.assignedTo ? `<div class="task-assignee">Assigned to: ${task.assignedTo.name}</div>` : ''}
        
        ${currentUser.role === 'USER' ? `
            <div class="task-actions">
                ${task.status !== 'COMPLETED' ? `
                    <button class="btn btn-primary" onclick="updateTaskStatus(${task.id}, 'IN_PROGRESS')">
                        Start
                    </button>
                ` : ''}
                ${task.status === 'IN_PROGRESS' ? `
                    <button class="btn btn-primary" onclick="updateTaskStatus(${task.id}, 'COMPLETED')">
                        Complete
                    </button>
                ` : ''}
            </div>
        ` : ''}
    `;
    
    return card;
}

function updateStats(tasks) {
    document.getElementById('totalTasks').textContent = tasks.length;
    document.getElementById('pendingTasks').textContent = tasks.filter(t => t.status === 'PENDING').length;
    
    // Update total users count by making a separate API call
    fetch(`${API_BASE}/profile/users`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => response.json())
    .then(users => {
        document.getElementById('totalUsers').textContent = users.length;
    })
    .catch(error => {
        console.error('Error loading users count:', error);
        document.getElementById('totalUsers').textContent = '0';
    });
}

function populateUserSelect(users) {
    const select = document.getElementById('taskAssignee');
    select.innerHTML = '<option value="">Select User</option>';
    
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        select.appendChild(option);
    });
}

function updateUI() {
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('dashboardUserName').textContent = currentUser.name;
        
        const roleBadge = document.getElementById('roleBadge');
        roleBadge.textContent = currentUser.role;
        roleBadge.className = `role-badge ${currentUser.role.toLowerCase()}`;
    }
}

// Modal Functions
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function showRegisterModal() {
    document.getElementById('registerModal').style.display = 'block';
}

function showCreateTaskModal() {
    document.getElementById('createTaskModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// WebSocket Functions
function connectWebSocket() {
    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    
    stompClient.connect({}, function(frame) {
        console.log('Connected to WebSocket');
        
        // Subscribe to task updates
        stompClient.subscribe('/topic/tasks', function(message) {
            const task = JSON.parse(message.body);
            showNotification(`Task updated: ${task.title}`, 'info');
            loadDashboardData();
        });
        
        // Subscribe to task status changes
        stompClient.subscribe('/topic/task-status', function(message) {
            const task = JSON.parse(message.body);
            showNotification(`Task status changed: ${task.title} is now ${task.status}`, 'info');
            loadDashboardData();
        });
        
        // Subscribe to user-specific notifications
        if (currentUser) {
            stompClient.subscribe(`/queue/user/${currentUser.id}`, function(message) {
                const task = JSON.parse(message.body);
                showNotification(`New task assigned: ${task.title}`, 'info');
                loadDashboardData();
            });
        }
    });
}

// Utility Functions
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function logout() {
    localStorage.removeItem('authToken');
    authToken = null;
    currentUser = null;
    
    if (stompClient) {
        stompClient.disconnect();
    }
    
    // Reset UI
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('loginSection').style.display = 'flex';
    document.getElementById('userSection').style.display = 'none';
    
    showNotification('Logged out successfully', 'info');
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
} 