// Demo Mode for LinkedIn Viewers
// This script adds demo features and resets data on page refresh

console.log('🎯 Demo Mode: Enabling LinkedIn-friendly features...');

// Demo data that will be created on page load
const demoData = {
    users: [
        { name: "John Admin", email: "admin@demo.com", password: "demo123", role: "ADMIN" },
        { name: "Sarah User", email: "user@demo.com", password: "demo123", role: "USER" },
        { name: "Mike Developer", email: "dev@demo.com", password: "demo123", role: "USER" }
    ],
    tasks: [
        {
            title: "Complete Project Documentation",
            description: "Write comprehensive documentation for the TaskMate project including API endpoints, database schema, and deployment guide.",
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            priority: "HIGH",
            status: "IN_PROGRESS",
            comments: "Need to include screenshots and code examples"
        },
        {
            title: "Implement Real-time Notifications",
            description: "Add WebSocket-based real-time notifications for task updates and status changes.",
            deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            priority: "MEDIUM",
            status: "PENDING",
            comments: "Use STOMP protocol for better performance"
        },
        {
            title: "Design Mobile Responsive UI",
            description: "Optimize the user interface for mobile devices with responsive design principles.",
            deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            priority: "URGENT",
            status: "COMPLETED",
            comments: "Mobile-first approach implemented successfully"
        }
    ]
};

// Demo mode banner
function createDemoBanner() {
    const banner = document.createElement('div');
    banner.innerHTML = `
        <div style="
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 10px;
            text-align: center;
            font-weight: bold;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        ">
            🎯 <strong>DEMO MODE</strong> - Data resets on refresh | 
            <strong>Admin:</strong> admin@demo.com / demo123 | 
            <strong>User:</strong> user@demo.com / demo123
        </div>
    `;
    document.body.appendChild(banner);
}

// Reset data on page load for demo
async function resetDemoData() {
    console.log('🔄 Demo Mode: Resetting data for fresh demo...');
    
    try {
        // Clear any existing data by logging out
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        
        // Show demo banner
        createDemoBanner();
        
        // Auto-login as admin after 2 seconds for demo
        setTimeout(async () => {
            console.log('🎯 Demo Mode: Auto-login as admin...');
            await demoAutoLogin();
        }, 2000);
        
    } catch (error) {
        console.error('❌ Demo Mode Error:', error);
    }
}

// Auto-login for demo
async function demoAutoLogin() {
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
            
            // Get user info and show dashboard
            await getUserInfo('admin@demo.com');
            showDashboard();
            showNotification('🎯 Demo Mode: Logged in as Admin!', 'success');
            
            // Create some demo tasks
            setTimeout(() => {
                createDemoTasks();
            }, 1000);
            
        } else {
            // If admin doesn't exist, register them
            await registerDemoUsers();
        }
    } catch (error) {
        console.error('Demo auto-login error:', error);
    }
}

// Register demo users
async function registerDemoUsers() {
    console.log('👥 Demo Mode: Creating demo users...');
    
    for (const user of demoData.users) {
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
            console.error(`Error creating demo user ${user.email}:`, error);
        }
    }
    
    // Try auto-login again
    setTimeout(demoAutoLogin, 1000);
}

// Create demo tasks
async function createDemoTasks() {
    console.log('📋 Demo Mode: Creating demo tasks...');
    
    try {
        // Get users for task assignment
        const usersResponse = await fetch(`${API_BASE}/profile/users`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (usersResponse.ok) {
            const users = await usersResponse.json();
            
            for (let i = 0; i < demoData.tasks.length; i++) {
                const task = demoData.tasks[i];
                const userId = users[i % users.length].id; // Distribute tasks among users
                
                try {
                    await fetch(`${API_BASE}/task/create-task?userId=${userId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`
                        },
                        body: JSON.stringify(task)
                    });
                } catch (error) {
                    console.error(`Error creating demo task ${i}:`, error);
                }
            }
            
            // Reload dashboard to show new tasks
            setTimeout(() => {
                loadDashboardData();
                showNotification('📋 Demo Mode: Demo tasks created!', 'success');
            }, 500);
        }
    } catch (error) {
        console.error('Demo tasks creation error:', error);
    }
}

// Add demo instructions to the page
function addDemoInstructions() {
    const instructions = document.createElement('div');
    instructions.innerHTML = `
        <div style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(255,255,255,0.95);
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            max-width: 300px;
            z-index: 9999;
            font-size: 14px;
        ">
            <h4 style="margin: 0 0 10px 0; color: #667eea;">🎯 Demo Instructions</h4>
            <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Admin:</strong> admin@demo.com / demo123</li>
                <li><strong>User:</strong> user@demo.com / demo123</li>
                <li>Create tasks, assign to users</li>
                <li>Update task status</li>
                <li>Data resets on refresh</li>
            </ul>
            <button onclick="this.parentElement.remove()" style="
                position: absolute;
                top: 5px;
                right: 10px;
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #999;
            ">&times;</button>
        </div>
    `;
    document.body.appendChild(instructions);
}

// Initialize demo mode
function initDemoMode() {
    console.log('🎯 Demo Mode: Initializing...');
    
    // Reset data on page load
    resetDemoData();
    
    // Add demo instructions
    setTimeout(addDemoInstructions, 3000);
    
    // Add demo mode indicator to page title
    document.title = "🎯 TaskMate Demo - " + document.title;
}

// Function to show landing page (for tour restart)
function showLandingPage() {
    document.getElementById('landingPage').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('userSection').style.display = 'none';
}

// Start demo mode when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDemoMode);
} else {
    initDemoMode();
}
