// TaskMate Demo Tour - Comprehensive Workflow Demonstration
// This script creates an automated tour showing the complete TaskMate workflow

console.log('🎬 Demo Tour: Starting comprehensive TaskMate workflow demonstration...');

// Demo tour configuration
const demoTour = {
    currentStep: 0,
    isRunning: false,
    steps: [
        {
            title: "🎯 Welcome to TaskMate Demo",
            description: "Let's walk through a complete task management workflow!",
            action: "showWelcome",
            duration: 3000
        },
        {
            title: "👥 Creating Demo Users",
            description: "Setting up admin and team members...",
            action: "createUsers",
            duration: 4000
        },
        {
            title: "🔐 Admin Login",
            description: "Logging in as administrator...",
            action: "adminLogin",
            duration: 2000
        },
        {
            title: "📋 Creating Sample Tasks",
            description: "Admin is creating and assigning tasks to team members...",
            action: "createTasks",
            duration: 5000
        },
        {
            title: "👤 User Login",
            description: "Switching to user view to see assigned tasks...",
            action: "userLogin",
            duration: 3000
        },
        {
            title: "✅ Updating Task Status",
            description: "User is updating task status from Pending to In Progress...",
            action: "updateTaskStatus",
            duration: 4000
        },
        {
            title: "🔄 Real-time Updates",
            description: "Watch how changes appear instantly in admin dashboard!",
            action: "showRealTime",
            duration: 5000
        },
        {
            title: "🎉 Demo Complete!",
            description: "You've seen the complete TaskMate workflow!",
            action: "completeTour",
            duration: 3000
        }
    ]
};

// Demo data for the tour
const tourData = {
    users: [
        { name: "John Admin", email: "admin@demo.com", password: "demo123", role: "ADMIN" },
        { name: "Sarah Developer", email: "sarah@demo.com", password: "demo123", role: "USER" },
        { name: "Mike Designer", email: "mike@demo.com", password: "demo123", role: "USER" },
        { name: "Lisa Tester", email: "lisa@demo.com", password: "demo123", role: "USER" }
    ],
    tasks: [
        {
            title: "Design User Interface",
            description: "Create modern, responsive UI designs for the mobile app",
            deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            priority: "HIGH",
            status: "PENDING",
            comments: "Focus on user experience and accessibility",
            assignedTo: "sarah@demo.com"
        },
        {
            title: "Implement Backend API",
            description: "Develop RESTful APIs for user authentication and data management",
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            priority: "URGENT",
            status: "PENDING",
            comments: "Use Spring Boot with JWT authentication",
            assignedTo: "mike@demo.com"
        },
        {
            title: "Write Unit Tests",
            description: "Create comprehensive test coverage for all modules",
            deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            priority: "MEDIUM",
            status: "PENDING",
            comments: "Aim for 90% code coverage",
            assignedTo: "lisa@demo.com"
        }
    ]
};

// Create tour overlay
function createTourOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'demoTourOverlay';
    overlay.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
        ">
            <div style="
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 500px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                animation: fadeIn 0.5s ease-in;
            ">
                <div id="tourIcon" style="font-size: 48px; margin-bottom: 20px;">🎯</div>
                <h2 id="tourTitle" style="color: #667eea; margin: 0 0 15px 0;">Welcome to TaskMate Demo</h2>
                <p id="tourDescription" style="color: #666; margin: 0 0 25px 0; line-height: 1.5;">
                    Let's walk through a complete task management workflow!
                </p>
                <div style="
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                    font-size: 14px;
                    color: #555;
                ">
                    <strong>Demo Credentials:</strong><br>
                    Admin: admin@demo.com / demo123<br>
                    Users: sarah@demo.com, mike@demo.com, lisa@demo.com / demo123
                </div>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="startTourBtn" onclick="startDemoTour()" style="
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: bold;
                    ">🚀 Start Demo Tour</button>
                    <button onclick="skipDemoTour()" style="
                        background: #6c757d;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                    ">Skip Tour</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

// Update tour overlay content
function updateTourOverlay(step) {
    const icon = document.getElementById('tourIcon');
    const title = document.getElementById('tourTitle');
    const description = document.getElementById('tourDescription');
    
    if (icon && title && description) {
        icon.textContent = getStepIcon(step.action);
        title.textContent = step.title;
        description.textContent = step.description;
    }
}

// Get icon for each step
function getStepIcon(action) {
    const icons = {
        'showWelcome': '🎯',
        'createUsers': '👥',
        'adminLogin': '🔐',
        'createTasks': '📋',
        'userLogin': '👤',
        'updateTaskStatus': '✅',
        'showRealTime': '🔄',
        'completeTour': '🎉'
    };
    return icons[action] || '🎯';
}

// Start the demo tour
async function startDemoTour() {
    console.log('🎬 Starting demo tour...');
    demoTour.isRunning = true;
    demoTour.currentStep = 0;
    
    // Remove overlay
    const overlay = document.getElementById('demoTourOverlay');
    if (overlay) overlay.remove();
    
    // Create progress indicator
    createProgressIndicator();
    
    // Start the tour steps
    await executeTourStep();
}

// Execute current tour step
async function executeTourStep() {
    if (!demoTour.isRunning || demoTour.currentStep >= demoTour.steps.length) {
        completeDemoTour();
        return;
    }
    
    const step = demoTour.steps[demoTour.currentStep];
    console.log(`🎬 Tour Step ${demoTour.currentStep + 1}: ${step.title}`);
    
    // Update progress
    updateProgressIndicator(demoTour.currentStep + 1, demoTour.steps.length);
    
    // Show step notification
    showTourNotification(step.title, step.description);
    
    // Execute step action
    await executeStepAction(step.action);
    
    // Wait for step duration
    setTimeout(() => {
        demoTour.currentStep++;
        executeTourStep();
    }, step.duration);
}

// Execute specific step actions
async function executeStepAction(action) {
    switch (action) {
        case 'showWelcome':
            // Already handled by overlay
            break;
            
        case 'createUsers':
            await createDemoUsers();
            break;
            
        case 'adminLogin':
            await loginAsAdmin();
            break;
            
        case 'createTasks':
            await createDemoTasks();
            break;
            
        case 'userLogin':
            await loginAsUser();
            break;
            
        case 'updateTaskStatus':
            await updateTaskStatusDemo();
            break;
            
        case 'showRealTime':
            await demonstrateRealTime();
            break;
            
        case 'completeTour':
            // Handled by completeDemoTour()
            break;
    }
}

// Create demo users
async function createDemoUsers() {
    console.log('👥 Creating demo users...');
    
    for (const user of tourData.users) {
        try {
            const endpoint = user.role === 'ADMIN' ? 'register-admin' : 'register-user';
            await fetch(`${API_BASE}/auth/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    name: user.name, 
                    email: user.email, 
                    password: user.password 
                })
            });
        } catch (error) {
            console.error(`Error creating user ${user.email}:`, error);
        }
    }
    
    showTourNotification('✅ Users Created', 'Admin and 3 team members are ready!');
}

// Login as admin
async function loginAsAdmin() {
    console.log('🔐 Logging in as admin...');
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: 'admin@demo.com', 
                password: 'demo123' 
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('userEmail', 'admin@demo.com');
            
            await getUserInfo('admin@demo.com');
            showDashboard();
            showTourNotification('🔐 Admin Logged In', 'Welcome to the admin dashboard!');
        }
    } catch (error) {
        console.error('Admin login error:', error);
    }
}

// Create demo tasks
async function createDemoTasks() {
    console.log('📋 Creating demo tasks...');
    
    try {
        // Get users for assignment
        const usersResponse = await fetch(`${API_BASE}/profile/users`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (usersResponse.ok) {
            const users = await usersResponse.json();
            
            for (const task of tourData.tasks) {
                const assignedUser = users.find(u => u.email === task.assignedTo);
                if (assignedUser) {
                    await fetch(`${API_BASE}/task/create-task?userId=${assignedUser.id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`
                        },
                        body: JSON.stringify(task)
                    });
                }
            }
            
            // Reload dashboard
            setTimeout(() => {
                loadDashboardData();
                showTourNotification('📋 Tasks Created', '3 tasks assigned to team members!');
            }, 1000);
        }
    } catch (error) {
        console.error('Task creation error:', error);
    }
}

// Login as user
async function loginAsUser() {
    console.log('👤 Switching to user view...');
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: 'sarah@demo.com', 
                password: 'demo123' 
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('userEmail', 'sarah@demo.com');
            
            await getUserInfo('sarah@demo.com');
            showDashboard();
            showTourNotification('👤 User View', 'Sarah can see her assigned tasks!');
        }
    } catch (error) {
        console.error('User login error:', error);
    }
}

// Update task status demo
async function updateTaskStatusDemo() {
    console.log('✅ Updating task status...');
    
    try {
        // Get user's tasks
        const tasksResponse = await fetch(`${API_BASE}/user/tasks`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (tasksResponse.ok) {
            const tasks = await tasksResponse.json();
            if (tasks.length > 0) {
                const task = tasks[0];
                
                // Update status to IN_PROGRESS
                await fetch(`${API_BASE}/user/task/${task.id}?status=IN_PROGRESS`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                
                showTourNotification('✅ Status Updated', 'Task status changed to "In Progress"!');
            }
        }
    } catch (error) {
        console.error('Status update error:', error);
    }
}

// Demonstrate real-time updates
async function demonstrateRealTime() {
    console.log('🔄 Demonstrating real-time updates...');
    
    // Switch back to admin view
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: 'admin@demo.com', 
                password: 'demo123' 
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('userEmail', 'admin@demo.com');
            
            await getUserInfo('admin@demo.com');
            showDashboard();
            
            // Show real-time notification
            setTimeout(() => {
                showTourNotification('🔄 Real-time Update', 'Admin dashboard shows updated task status instantly!');
            }, 1000);
        }
    } catch (error) {
        console.error('Admin login error:', error);
    }
}

// Create progress indicator
function createProgressIndicator() {
    const progress = document.createElement('div');
    progress.id = 'tourProgress';
    progress.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255,255,255,0.95);
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            font-family: Arial, sans-serif;
            min-width: 200px;
        ">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span style="font-size: 20px;">🎬</span>
                <span style="font-weight: bold; color: #667eea;">Demo Tour</span>
            </div>
            <div style="
                background: #f0f0f0;
                border-radius: 5px;
                height: 8px;
                margin-bottom: 8px;
            ">
                <div id="progressBar" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    height: 100%;
                    border-radius: 5px;
                    width: 0%;
                    transition: width 0.3s ease;
                "></div>
            </div>
            <div id="progressText" style="font-size: 12px; color: #666;">
                Step 1 of 8
            </div>
        </div>
    `;
    document.body.appendChild(progress);
}

// Update progress indicator
function updateProgressIndicator(current, total) {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    if (progressBar && progressText) {
        const percentage = (current / total) * 100;
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `Step ${current} of ${total}`;
    }
}

// Show tour notification
function showTourNotification(title, message) {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10001;
            font-family: Arial, sans-serif;
            text-align: center;
            animation: slideDown 0.5s ease-out;
        ">
            <div style="font-weight: bold; margin-bottom: 5px;">${title}</div>
            <div style="font-size: 14px; opacity: 0.9;">${message}</div>
        </div>
    `;
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Complete demo tour
function completeDemoTour() {
    console.log('🎉 Demo tour completed!');
    
    // Remove progress indicator
    const progress = document.getElementById('tourProgress');
    if (progress) progress.remove();
    
    // Show completion message
    showTourNotification('🎉 Demo Complete!', 'You\'ve seen the complete TaskMate workflow!');
    
    // Add restart button
    setTimeout(() => {
        const restartBtn = document.createElement('div');
        restartBtn.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 20px;
                border-radius: 25px;
                cursor: pointer;
                font-family: Arial, sans-serif;
                font-weight: bold;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 9999;
            " onclick="restartDemoTour()">
                🔄 Restart Demo
            </div>
        `;
        document.body.appendChild(restartBtn);
    }, 2000);
}

// Restart demo tour
function restartDemoTour() {
    // Remove restart button
    const restartBtn = document.querySelector('[onclick="restartDemoTour()"]');
    if (restartBtn) restartBtn.remove();
    
    // Reset and start again
    demoTour.currentStep = 0;
    demoTour.isRunning = false;
    
    // Clear any existing data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    
    // Show landing page
    showLandingPage();
    
    // Start tour again
    setTimeout(() => {
        startDemoTour();
    }, 1000);
}

// Skip demo tour
function skipDemoTour() {
    const overlay = document.getElementById('demoTourOverlay');
    if (overlay) overlay.remove();
    
    // Just show the normal demo mode
    initDemoMode();
}

// Initialize demo tour
function initDemoTour() {
    console.log('🎬 Initializing demo tour...');
    
    // Wait a bit for page to load
    setTimeout(() => {
        createTourOverlay();
    }, 1000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes slideDown {
        from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
`;
document.head.appendChild(style);

// Start demo tour when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDemoTour);
} else {
    initDemoTour();
}
