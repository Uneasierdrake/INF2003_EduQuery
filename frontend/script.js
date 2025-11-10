// ========== Debug Mode ==========
console.log('EduQuery Script Loaded');

// ========== AUTHENTICATION & ROLE MANAGEMENT ==========

// Function to get token from URL or localStorage
function getAuthToken() {
    // First, try to get token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
        console.log('🔑 Token found in URL');
        // Store token from URL in localStorage
        localStorage.setItem('authToken', tokenFromUrl);
        // Clean URL by removing token parameter
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        return tokenFromUrl;
    }
    
    // Fall back to localStorage
    const tokenFromStorage = localStorage.getItem('authToken');
    if (tokenFromStorage) {
        console.log('🔑 Token found in localStorage');
        return tokenFromStorage;
    }
    
    console.log('❌ No token found');
    return null;
}

// Function to validate token and redirect if invalid
function validateAuth() {
    const token = getAuthToken();
    
    if (!token) {
        console.log('No authentication token found, redirecting to login...');
        showToast('Please login to access the dashboard', 'error');
        setTimeout(() => {
            window.location.href = '/login?error=Authentication required';
        }, 1000);
        return false;
    }
    
    // Verify token is valid JWT format
    try {
        // Decode the token payload (without verification)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp * 1000; // Convert to milliseconds
        const now = Date.now();
        
        console.log('🔍 Token payload:', payload);
        console.log('⏰ Token expires:', new Date(expiry).toLocaleString());
        
        if (now > expiry) {
            console.log('Token expired, redirecting to login...');
            localStorage.removeItem('authToken');
            showToast('Session expired, please login again', 'error');
            setTimeout(() => {
                window.location.href = '/login?error=Session expired';
            }, 1000);
            return false;
        }
        
        console.log('✅ Token is valid');
        return true;
    } catch (error) {
        console.log('Invalid token format, redirecting to login...');
        localStorage.removeItem('authToken');
        showToast('Invalid session, please login again', 'error');
        setTimeout(() => {
            window.location.href = '/login?error=Invalid session';
        }, 1000);
        return false;
    }
}

// Function to get auth headers for API calls
function getAuthHeaders() {
    const token = getAuthToken();
    
    if (!token) {
        console.error('No token available for API call');
        return {};
    }
    
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

// Check if current user is admin
function isUserAdmin() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return userData.is_admin === true;
}

// Update UI based on user role
function updateUIForUserRole() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const isAdmin = userData.is_admin === true;
    
    console.log('👤 User role update:', { username: userData.username, isAdmin: isAdmin });
    
    // Update welcome message
    const welcomeElement = document.getElementById('userWelcome');
    if (welcomeElement) {
        if (isAdmin) {
            welcomeElement.textContent = `Welcome, Administrator ${userData.username}!`;
            welcomeElement.className = 'admin-welcome';
        } else {
            welcomeElement.textContent = `Welcome, ${userData.username}!`;
            welcomeElement.className = 'user-welcome';
        }
    }
    
    // Show/hide admin features
    const adminFeatures = document.querySelectorAll('.admin-only');
    adminFeatures.forEach(feature => {
        if (feature) {
            feature.style.display = isAdmin ? 'block' : 'none';
        }
    });
    
    // Show/hide admin buttons in manage view
    const addSchoolBtn = document.querySelector('button[onclick="showAddModal()"]');
    if (addSchoolBtn) {
        addSchoolBtn.style.display = isAdmin ? 'inline-block' : 'none';
    }
}

// ========== MAKE FUNCTIONS GLOBAL ==========

window.switchView = function(viewName) {
  console.log('Switching to view:', viewName);
  
  const views = document.querySelectorAll('.view');
  const navBtns = document.querySelectorAll('.nav-btn');
  
  views.forEach(view => view.classList.remove('active'));
  navBtns.forEach(btn => btn.classList.remove('active'));
  
  const targetView = document.getElementById(`${viewName}View`);
  const targetBtn = document.querySelector(`[data-view="${viewName}"]`);
  
  if (targetView) {
    targetView.classList.add('active');
    console.log('View activated:', viewName);
  } else {
    console.error('View not found:', `${viewName}View`);
  }
  
  if (targetBtn) {
    targetBtn.classList.add('active');
  }
  
  if (viewName === 'manage') {
    loadSchoolStats();
  }
};

// Add event listeners to nav buttons
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Loaded - Attaching event listeners');
  
  // Check authentication first
  if (!validateAuth()) {
    return; // Redirect will happen in validateAuth
  }
  
  // Authentication successful, continue loading
  console.log('✅ Authentication valid, loading dashboard...');
  
  // Update UI for user role
  updateUIForUserRole();
  
  const navBtns = document.querySelectorAll('.nav-btn');
  console.log('Found nav buttons:', navBtns.length);
  
  navBtns.forEach((btn, index) => {
    console.log(`Nav button ${index}:`, btn.dataset.view);
    btn.addEventListener('click', () => {
      console.log('Button clicked:', btn.dataset.view);
      switchView(btn.dataset.view);
    });
  });
  
  // Allow Enter key to trigger search
  const searchBox = document.getElementById('searchBox');
  if (searchBox) {
    searchBox.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        runQuery();
      }
    });
  }
  
  // Load initial stats
  loadSchoolStats();
});

// ========== Search Functionality ==========
window.runQuery = async function() {
  const school = document.getElementById("searchBox").value.trim();
  const queryType = document.getElementById("queryType").value;

  if (!school) {
    showToast('Please enter a school name', 'error');
    return;
  }

  let url = "";
  if (queryType === "all") url = `/api/schools?name=${encodeURIComponent(school)}`;
  if (queryType === "subjects") url = `/api/schools/subjects?name=${encodeURIComponent(school)}`;
  if (queryType === "ccas") url = `/api/schools/ccas?name=${encodeURIComponent(school)}`;
  if (queryType === "programmes") url = `/api/schools/programmes?name=${encodeURIComponent(school)}`;
  if (queryType === "distinctives") url = `/api/schools/distinctives?name=${encodeURIComponent(school)}`;

  // Show loading spinner
  showLoading(true);

  try {
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    console.log('🔍 API Response status:', response.status);
    
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      showToast('Session expired, please login again', 'error');
      setTimeout(() => {
        window.location.href = '/login?error=Session expired';
      }, 1500);
      return;
    }
    
    const data = await response.json();
    hideLoading();
    
    if (data.error) {
      showToast(data.error, 'error');
      renderEmpty('Error loading data');
      return;
    }
    
    renderTable(data, queryType);
    updateResultsMeta(data.length, school);
  } catch (err) {
    hideLoading();
    console.error('API call failed:', err);
    showToast('Failed to fetch data: ' + err.message, 'error');
    renderEmpty('Connection error');
  }
};

function showLoading(show) {
  const spinner = document.getElementById('loadingSpinner');
  const resultsTable = document.getElementById('resultsTable');
  
  if (show) {
    spinner.style.display = 'flex';
    resultsTable.innerHTML = '';
  } else {
    spinner.style.display = 'none';
  }
}

function hideLoading() {
  showLoading(false);
}

function updateResultsMeta(count, query) {
  const meta = document.getElementById('resultsMeta');
  if (count === 0) {
    meta.textContent = `No results found for "${query}"`;
  } else {
    meta.textContent = `Found ${count} result${count !== 1 ? 's' : ''} for "${query}"`;
  }
}

function renderEmpty(message) {
  document.getElementById("resultsTable").innerHTML = `
    <div class="empty-state">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" stroke="#E5E7EB" stroke-width="4"/>
        <path d="M32 20v24M20 32h24" stroke="#E5E7EB" stroke-width="4" stroke-linecap="round"/>
      </svg>
      <h3>${message}</h3>
      <p>Try adjusting your search query</p>
    </div>
  `;
}

// ========== Table Rendering ==========
function renderTable(data, queryType) {
  const container = document.getElementById("resultsTable");
  
  if (!data || data.length === 0) {
    renderEmpty('No results found');
    return;
  }

  if (!Array.isArray(data)) {
    data = [data];
  }

  const keys = Object.keys(data[0]);
  let html = '<table class="data-table"><thead><tr>';
  
  keys.forEach(k => {
    const formattedKey = k.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    html += `<th>${formattedKey}</th>`;
  });
  
  // Add actions column only for "all" query type and if user is admin
  if (queryType === 'all' && isUserAdmin()) {
    html += '<th>Actions</th>';
  }
  
  html += '</tr></thead><tbody>';

  data.forEach(row => {
    html += '<tr>';
    keys.forEach(k => {
      const value = row[k] !== null && row[k] !== undefined ? row[k] : '-';
      html += `<td>${value}</td>`;
    });
    
    // Add action buttons only for "all" query type and if user is admin
    if (queryType === 'all' && row.school_id && isUserAdmin()) {
      html += `
        <td>
          <div class="action-buttons">
            <button class="btn-edit" onclick='editSchool(${JSON.stringify(row)})'>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
              </svg>
              Edit
            </button>
            <button class="btn-danger" onclick='deleteSchool(${row.school_id}, "${row.school_name}")'>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              Delete
            </button>
          </div>
        </td>
      `;
    }
    
    html += '</tr>';
  });

  html += '</tbody></table>';
  container.innerHTML = html;
}

// ========== CRUD Operations (GLOBAL) ==========

// Modal Management
window.showAddModal = function() {
  // Check if user is admin before showing modal
  if (!isUserAdmin()) {
    showToast('Admin privileges required to add schools', 'error');
    return;
  }
  
  console.log('Opening add modal');
  const modal = document.getElementById('addModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    console.error('Modal not found');
  }
};

window.hideAddModal = function() {
  console.log('Closing add modal');
  const modal = document.getElementById('addModal');
  if (modal) {
    modal.classList.remove('active');
    document.getElementById('addSchoolForm').reset();
    document.body.style.overflow = 'auto';
  }
};

// Create Operation
window.addSchool = async function(event) {
  event.preventDefault();
  
  // Check if user is admin
  if (!isUserAdmin()) {
    showToast('Admin privileges required to add schools', 'error');
    return;
  }
  
  console.log('Adding school...');
  
  const schoolData = {
    school_name: document.getElementById('schoolName').value,
    address: document.getElementById('address').value,
    postal_code: document.getElementById('postalCode').value,
    zone_code: document.getElementById('zoneCode').value,
    mainlevel_code: document.getElementById('mainlevelCode').value,
    principal_name: document.getElementById('principalName').value
  };
  
  console.log('School data:', schoolData);
  
  try {
    const res = await fetch('/api/schools', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(schoolData)
    });
    
    if (res.status === 403) {
      showToast('Admin privileges required to add schools', 'error');
      return;
    }
    
    const result = await res.json();
    console.log('Server response:', result);
    
    if (result.success || res.ok) {
      showToast('✓ School added successfully!', 'success');
      hideAddModal();
      loadSchoolStats();
      
      // If user is on search view with results, refresh
      const searchBox = document.getElementById('searchBox');
      if (searchBox.value.trim()) {
        setTimeout(() => runQuery(), 500);
      }
    } else {
      showToast('Error: ' + (result.error || 'Failed to add school'), 'error');
    }
  } catch (err) {
    console.error('Add school error:', err);
    showToast('Error: ' + err.message, 'error');
  }
};

// Update Operation
window.editSchool = async function(school) {
  // Check if user is admin
  if (!isUserAdmin()) {
    showToast('Admin privileges required to edit schools', 'error');
    return;
  }
  
  console.log('Editing school:', school);
  
  // Create a simple inline editing dialog
  const newName = prompt('School Name:', school.school_name);
  if (!newName) return; // User cancelled
  
  const newAddress = prompt('Address:', school.address);
  if (newAddress === null) return;
  
  const newPostal = prompt('Postal Code:', school.postal_code);
  if (newPostal === null) return;
  
  const newZone = prompt('Zone Code (NORTH/SOUTH/EAST/WEST/CENTRAL):', school.zone_code);
  if (newZone === null) return;
  
  const newMainLevel = prompt('Main Level Code:', school.mainlevel_code);
  if (newMainLevel === null) return;
  
  const newPrincipal = prompt('Principal Name:', school.principal_name);
  if (newPrincipal === null) return;
  
  const updatedData = {
    school_name: newName,
    address: newAddress,
    postal_code: newPostal,
    zone_code: newZone,
    mainlevel_code: newMainLevel,
    principal_name: newPrincipal
  };
  
  try {
    const res = await fetch(`/api/schools/${school.school_id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedData)
    });
    
    if (res.status === 403) {
      showToast('Admin privileges required to edit schools', 'error');
      return;
    }
    
    const result = await res.json();
    
    if (result.success || res.ok) {
      showToast('✓ School updated successfully!', 'success');
      runQuery(); // Refresh results
    } else {
      showToast('Error: ' + (result.error || 'Failed to update school'), 'error');
    }
  } catch (err) {
    console.error('Update school error:', err);
    showToast('Error: ' + err.message, 'error');
  }
};

// Delete Operation
window.deleteSchool = async function(schoolId, schoolName) {
  // Check if user is admin
  if (!isUserAdmin()) {
    showToast('Admin privileges required to delete schools', 'error');
    return;
  }
  
  console.log('Deleting school:', schoolId, schoolName);
  
  // Use custom confirmation dialog
  const confirmed = confirm(
    `⚠️ Delete School?\n\n` +
    `Are you sure you want to delete "${schoolName}"?\n\n` +
    `This will also remove all associated:\n` +
    `• Subjects\n` +
    `• CCAs\n` +
    `• Programmes\n` +
    `• Distinctive programmes\n\n` +
    `This action cannot be undone.`
  );
  
  if (!confirmed) return;
  
  try {
    const res = await fetch(`/api/schools/${schoolId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (res.status === 403) {
      showToast('Admin privileges required to delete schools', 'error');
      return;
    }
    
    const result = await res.json();
    
    if (result.success || res.ok) {
      showToast('✓ School deleted successfully!', 'success');
      runQuery(); // Refresh results
      loadSchoolStats();
    } else {
      showToast('Error: ' + (result.error || 'Failed to delete school'), 'error');
    }
  } catch (err) {
    console.error('Delete school error:', err);
    showToast('Error: ' + err.message, 'error');
  }
};

// ========== Statistics ==========
function loadSchoolStats() {
  console.log('Loading school stats...');
  
  fetch('/api/schools?name=', {
    headers: getAuthHeaders()
  })
    .then(res => res.json())
    .then(data => {
      const totalSchools = document.getElementById('totalSchools');
      if (totalSchools) {
        totalSchools.textContent = data.length || '0';
      }
      console.log('Total schools:', data.length);
    })
    .catch(err => {
      console.error('Failed to load stats:', err);
      const totalSchools = document.getElementById('totalSchools');
      if (totalSchools) {
        totalSchools.textContent = '-';
      }
    });
}

// ========== Toast Notifications ==========
function showToast(message, type = 'info') {
  console.log('Toast:', type, message);
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  
  if (!toast || !toastMessage) {
    console.error('Toast elements not found');
    return;
  }
  
  toastMessage.textContent = message;
  toast.className = 'toast show ' + type;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ========== Utility Functions (GLOBAL) ==========
window.showAbout = function() {
  alert(
    'EduQuery SG\n\n' +
    'A comprehensive database management system for Singapore schools.\n\n' +
    'Features:\n' +
    '• Search schools by name\n' +
    '• View subjects, CCAs, programmes & distinctives\n' +
    '• Add, edit, and delete school records\n' +
    '• Real-time data synchronization\n\n' +
    'Built with PostgreSQL (Supabase) + MongoDB Atlas\n' +
    'INF2003 Database Systems Project'
  );
};

window.showHelp = function() {
  alert(
    'How to Use EduQuery\n\n' +
    'SEARCH:\n' +
    '1. Enter a school name (partial match works)\n' +
    '2. Select what you want to view\n' +
    '3. Click Search or press Enter\n\n' +
    'MANAGE:\n' +
    '1. Click "Add New School" button\n' +
    '2. Fill in all required fields\n' +
    '3. Click Save to add to database\n\n' +
    'EDIT/DELETE:\n' +
    '1. Search for schools (General Info)\n' +
    '2. Use Edit or Delete buttons in the results table\n\n' +
    'Need more help? Contact your database administrator.'
  );
};

// ========== User related Functions =============

// Global logout function
window.logout = function() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const username = userData.username || 'Unknown';
    
    console.log('Logout initiated:', {
        timestamp: new Date().toISOString(),
        username: username,
        user_id: userData.user_id
    });

    const confirmed = confirm(
        `Are you sure you want to log out?\n\n` +
        `User: ${username}\n` +
        `Role: ${userData.is_admin ? 'Administrator' : 'User'}`
    );
    
    if (!confirmed) {
        console.log('Logout cancelled by user');
        return;
    }

    // Clear all stored authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userData');
    localStorage.removeItem('is_admin');

    showToast(`Goodbye, ${username}! You have been logged out successfully.`, 'info');

    console.log('User logged out successfully:', {
        timestamp: new Date().toISOString(),
        username: username
    });

    // Redirect to login page after a brief delay
    setTimeout(() => {
        window.location.href = '/login';
    }, 1000);
};

console.log('✓ All functions loaded and registered globally');
