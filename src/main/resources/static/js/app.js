// Global variables
let currentUser = null;
let stompClient = null;
let authToken = null;

// API Base URL
const API_BASE = 'http://localhost:8080/api';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    
    // Test modal elements
    setTimeout(() => {
        testCreateTaskModal();
    }, 1000);
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
            
            // Force logout button visibility
            document.getElementById('userSection').style.display = 'flex';
            document.getElementById('loginSection').style.display = 'none';
            
            showNotification('Login successful!', 'success');
            
            // Connect to WebSocket
            connectWebSocket();
        } else {
            const errorData = await response.text();
            console.error('Login failed:', errorData);
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
    
    console.log('🔐 Attempting registration for:', email, 'with role:', role);
    
    try {
        const endpoint = role === 'ADMIN' ? 'register-admin' : 'register-user';
        const response = await fetch(`${API_BASE}/auth/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        console.log('📤 Registration response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            
            console.log('✅ Registration successful, getting user info...');
            
            // Get user info
            await getUserInfo(email);
            
            closeModal('registerModal');
            showDashboard();
            
            // Force logout button visibility
            document.getElementById('userSection').style.display = 'flex';
            document.getElementById('loginSection').style.display = 'none';
            
            showNotification('Registration successful!', 'success');
            
            // Connect to WebSocket
            connectWebSocket();
        } else {
            const errorData = await response.text();
            console.error('❌ Registration failed:', response.status, errorData);
            
            // Handle specific error cases
            if (errorData.includes("Admin already exists")) {
                showNotification('Admin already exists. Only one admin is allowed.', 'error');
            } else if (errorData.includes("User already exists")) {
                showNotification('User already exists with this email.', 'error');
            } else {
                showNotification(`Registration failed: ${errorData}`, 'error');
            }
        }
    } catch (error) {
        console.error('❌ Registration error:', error);
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
    document.getElementById('landingPage').style.display = 'none';
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
            console.log('📋 Tasks loaded:', tasks.length, 'tasks');
            tasks.forEach((task, index) => {
                console.log(`📋 Task ${index + 1}: ${task.title} (ID: ${task.id}) - Assigned to: ${task.assignedTo?.name || 'Unknown'}`);
            });
            displayTasks(tasks, 'allTasksList');
            await updateStats(tasks);
        } else {
            console.error('❌ Failed to load tasks:', tasksResponse.status, tasksResponse.statusText);
            const errorText = await tasksResponse.text();
            console.error('❌ Error details:', errorText);
            // Show empty state
            displayTasks([], 'allTasksList');
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
            console.log('👤 Users loaded:', users.length, 'users');
            users.forEach(user => {
                console.log(`👤 User: ${user.name} (ID: ${user.id}) - ${user.email}`);
            });
            populateUserSelect(users);
        } else {
            console.error('❌ Failed to load users:', usersResponse.status, usersResponse.statusText);
            const errorText = await usersResponse.text();
            console.error('❌ Error details:', errorText);
        }
    } catch (error) {
        console.error('❌ Error loading admin dashboard:', error);
        // Show empty state on error
        displayTasks([], 'allTasksList');
    }
}

async function loadUserDashboard() {
    document.getElementById('adminSection').style.display = 'none';
    document.getElementById('userSection').style.display = 'block';
    
    try {
        console.log('🔍 Loading user dashboard for:', currentUser.email);
        
        const response = await fetch(`${API_BASE}/user/tasks?email=${currentUser.email}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        console.log('📊 User tasks response status:', response.status);
        
        if (response.ok) {
            const tasks = await response.json();
            console.log('📋 User tasks loaded:', tasks.length, 'tasks');
            tasks.forEach((task, index) => {
                console.log(`📋 Task ${index + 1}: ${task.title} (ID: ${task.id}) - Status: ${task.status}`);
            });
            displayTasks(tasks, 'userTasksList');
        } else {
            console.error('❌ Failed to load user tasks:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('❌ Error details:', errorText);
            // Show empty state
            displayTasks([], 'userTasksList');
        }
    } catch (error) {
        console.error('❌ Error loading user dashboard:', error);
        // Show empty state on error
        displayTasks([], 'userTasksList');
    }
}

// Task Management Functions
async function handleCreateTask(event) {
    event.preventDefault();
    
    console.log('🔧 Creating task...');
    
    const taskData = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        deadline: document.getElementById('taskDeadline').value,
        priority: document.getElementById('taskPriority').value,
        comments: document.getElementById('taskComments').value
    };
    
    const userId = document.getElementById('taskAssignee').value;
    
    console.log('📝 Task data:', taskData);
    console.log('👤 User ID:', userId);
    
    if (!userId) {
        showNotification('Please select a user to assign the task to.', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/task/create-task?userId=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(taskData)
        });
        
        console.log('📤 Create task response status:', response.status);
        
        if (response.ok) {
            const task = await response.json();
            console.log('✅ Task created successfully:', task);
            showNotification('Task created successfully!', 'success');
            closeModal('createTaskModal');
            
            // Clear form
            document.getElementById('createTaskForm').reset();
            
            // Force reload dashboard with delay to ensure backend processing
            setTimeout(async () => {
                console.log('🔄 Reloading dashboard after task creation...');
                await loadDashboardData();
            }, 500);
        } else {
            const errorText = await response.text();
            console.error('❌ Failed to create task:', response.status, errorText);
            showNotification(`Failed to create task: ${errorText}`, 'error');
        }
    } catch (error) {
        console.error('❌ Error creating task:', error);
        showNotification('Failed to create task. Please try again.', 'error');
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

async function updateStats(tasks) {
    console.log('📊 Updating stats with tasks:', tasks);
    
    // Update task counts
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(t => t.status === 'PENDING').length;
    
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('pendingTasks').textContent = pendingTasks;
    
    console.log('📈 Task stats - Total:', totalTasks, 'Pending:', pendingTasks);
    
    // Update total users count by making a separate API call
    try {
        const usersResponse = await fetch(`${API_BASE}/profile/users`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (usersResponse.ok) {
            const users = await usersResponse.json();
            document.getElementById('totalUsers').textContent = users.length;
            console.log('👥 Users count:', users.length);
        } else {
            console.error('❌ Failed to load users count:', usersResponse.status);
            document.getElementById('totalUsers').textContent = '0';
        }
    } catch (error) {
        console.error('❌ Error loading users count:', error);
        document.getElementById('totalUsers').textContent = '0';
    }
}

function populateUserSelect(users) {
    const select = document.getElementById('taskAssignee');
    select.innerHTML = '<option value="">Select User</option>';
    
    console.log('🔧 Populating user select with:', users.length, 'users');
    
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        select.appendChild(option);
        console.log('👤 Added user option:', user.name, '(ID:', user.id, ')');
    });
    
    console.log('✅ User select populated with', users.length, 'users');
    
    // Debug: Check if form elements are visible
    const formElements = document.querySelectorAll('#createTaskModal .form-group');
    console.log('🔍 Form elements found:', formElements.length);
    formElements.forEach((el, index) => {
        console.log(`📋 Form element ${index + 1}:`, el.querySelector('label')?.textContent || 'No label');
    });
    
    // Debug: Check if submit button exists
    const submitBtn = document.querySelector('#createTaskForm button[type="submit"]');
    console.log('🔘 Submit button found:', !!submitBtn);
    if (submitBtn) {
        console.log('🔘 Submit button text:', submitBtn.textContent);
    }
}

function updateUI() {
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('dashboardUserName').textContent = currentUser.name;
        
        const roleBadge = document.getElementById('roleBadge');
        roleBadge.textContent = currentUser.role;
        roleBadge.className = `role-badge ${currentUser.role.toLowerCase()}`;
        
        // Ensure logout button is visible
        document.getElementById('userSection').style.display = 'flex';
        document.getElementById('loginSection').style.display = 'none';
        
        console.log('🔧 Updated UI - User:', currentUser.name, 'Role:', currentUser.role);
        console.log('🔧 Logout button should be visible now');
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
    console.log('🔧 Opening create task modal...');
    
    // Load users for the dropdown when modal opens
    if (currentUser && currentUser.role === 'ADMIN') {
        loadUsersForTaskAssignment();
    }
    
    // Show the modal
    document.getElementById('createTaskModal').style.display = 'block';
    
    // Scroll to top of modal to ensure all elements are visible
    setTimeout(() => {
        const modal = document.getElementById('createTaskModal');
        modal.scrollTop = 0;
    }, 100);
    
    console.log('✅ Create task modal opened');
}

async function loadUsersForTaskAssignment() {
    console.log('👥 Loading users for task assignment...');
    
    try {
        const response = await fetch(`${API_BASE}/profile/users`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const users = await response.json();
            console.log('👤 Users loaded for assignment:', users);
            populateUserSelect(users);
        } else {
            console.error('❌ Failed to load users for assignment:', response.status);
            const errorText = await response.text();
            console.error('❌ Error details:', errorText);
        }
    } catch (error) {
        console.error('❌ Error loading users for task assignment:', error);
    }
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
    document.getElementById('landingPage').style.display = 'block';
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

// Test function to verify modal elements
function testCreateTaskModal() {
    console.log('🧪 Testing create task modal...');
    
    // Check if modal exists
    const modal = document.getElementById('createTaskModal');
    console.log('📋 Modal exists:', !!modal);
    
    // Check if form exists
    const form = document.getElementById('createTaskForm');
    console.log('📝 Form exists:', !!form);
    
    // Check all form elements
    const formElements = [
        'taskTitle',
        'taskDescription', 
        'taskDeadline',
        'taskPriority',
        'taskComments',
        'taskAssignee'
    ];
    
    formElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        console.log(`🔍 ${elementId}:`, !!element, element?.tagName || 'N/A');
    });
    
    // Check submit button
    const submitBtn = form?.querySelector('button[type="submit"]');
    console.log('🔘 Submit button:', !!submitBtn, submitBtn?.textContent || 'N/A');
    
    // Check cancel button
    const cancelBtn = form?.querySelector('button[type="button"]');
    console.log('❌ Cancel button:', !!cancelBtn, cancelBtn?.textContent || 'N/A');
} 