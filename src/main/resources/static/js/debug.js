// Debug script to check if CSS is loading properly
console.log('🔍 Debug: Checking CSS loading...');

// Check if CSS is loaded
function checkCssLoading() {
    const styleSheets = document.styleSheets;
    console.log('📋 Total stylesheets:', styleSheets.length);
    
    for (let i = 0; i < styleSheets.length; i++) {
        try {
            const sheet = styleSheets[i];
            console.log(`📋 Stylesheet ${i}:`, sheet.href || 'inline');
            
            if (sheet.href && sheet.href.includes('style.css')) {
                console.log('✅ TaskMate CSS found!');
                return true;
            }
        } catch (e) {
            console.log(`❌ Error accessing stylesheet ${i}:`, e.message);
        }
    }
    
    console.log('❌ TaskMate CSS not found!');
    return false;
}

// Check if gradient background is applied
function checkGradientBackground() {
    const body = document.body;
    const computedStyle = window.getComputedStyle(body);
    const background = computedStyle.background;
    
    console.log('🎨 Body background:', background);
    
    if (background.includes('gradient') || background.includes('667eea')) {
        console.log('✅ Gradient background detected!');
        return true;
    } else {
        console.log('❌ No gradient background detected');
        return false;
    }
}

// Check if Font Awesome is loaded
function checkFontAwesome() {
    const testIcon = document.createElement('i');
    testIcon.className = 'fas fa-tasks';
    document.body.appendChild(testIcon);
    
    const computedStyle = window.getComputedStyle(testIcon, '::before');
    const content = computedStyle.content;
    
    document.body.removeChild(testIcon);
    
    console.log('🔤 Font Awesome content:', content);
    
    if (content && content !== 'none') {
        console.log('✅ Font Awesome loaded!');
        return true;
    } else {
        console.log('❌ Font Awesome not loaded');
        return false;
    }
}

// Run all checks
function runDebugChecks() {
    console.log('🚀 Starting TaskMate CSS Debug...');
    
    const cssLoaded = checkCssLoading();
    const gradientApplied = checkGradientBackground();
    const fontAwesomeLoaded = checkFontAwesome();
    
    console.log('📊 Debug Summary:');
    console.log('- CSS Loaded:', cssLoaded);
    console.log('- Gradient Applied:', gradientApplied);
    console.log('- Font Awesome Loaded:', fontAwesomeLoaded);
    
    if (!cssLoaded) {
        console.log('💡 Suggestion: Check if /css/style.css is accessible');
        console.log('💡 Try visiting: https://your-app-name.onrender.com/css/style.css');
    }
    
    if (!gradientApplied) {
        console.log('💡 Suggestion: CSS might not be loading properly');
    }
}

// Run checks when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runDebugChecks);
} else {
    runDebugChecks();
}

// Also run after a delay to catch any late loading
setTimeout(runDebugChecks, 2000);
