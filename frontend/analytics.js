// ========== ANALYTICS FUNCTIONS WITH AUTHENTICATION ==========

// ========== 1. Load Zone Statistics ==========
window.loadZoneStatistics = async function() {
  const container = document.getElementById('zoneStatsContent');
  container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
  
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const res = await fetch('/api/analytics/schools-by-zone', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.status === 401) {
      handleAuthError();
      return;
    }

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    
    if (result.success && result.data.length > 0) {
      let html = '<table class="analytics-table">';
      html += '<thead><tr><th>Zone</th><th>Total Schools</th><th>School Types</th><th>Avg Address Length</th></tr></thead>';
      html += '<tbody>';
      
      result.data.forEach(row => {
        html += `<tr>
          <td><span class="zone-badge zone-${row.zone_code.toLowerCase()}">${row.zone_code}</span></td>
          <td><strong>${row.total_schools}</strong></td>
          <td>${row.school_types}</td>
          <td>${row.avg_address_length} chars</td>
        </tr>`;
      });
      
      html += '</tbody></table>';
      container.innerHTML = html;
    } else {
      container.innerHTML = '<div class="empty-state-small">No data available</div>';
    }
  } catch (err) {
    console.error('Zone statistics error:', err);
    container.innerHTML = '<div class="error-state">Failed to load data: ' + err.message + '</div>';
  }
};

// ========== 2. Load Subject Count ==========
window.loadSubjectCount = async function() {
  const container = document.getElementById('subjectCountContent');
  container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
  
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const res = await fetch('/api/analytics/schools-subject-count', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.status === 401) {
      handleAuthError();
      return;
    }

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    
    if (result.success && result.data.length > 0) {
      let html = `<div class="analytics-summary">
        <div class="summary-item">
          <span class="summary-label">Schools Analyzed:</span>
          <span class="summary-value">${result.summary.total_schools}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Avg Subjects:</span>
          <span class="summary-value">${result.summary.avg_subjects}</span>
        </div>
      </div>`;
      
      html += '<table class="analytics-table compact">';
      html += '<thead><tr><th>School Name</th><th>Zone</th><th>Subjects</th><th>Diversity</th></tr></thead>';
      html += '<tbody>';
      
      result.data.slice(0, 10).forEach(row => {
        const diversityClass = row.subject_diversity.toLowerCase();
        html += `<tr>
          <td>${row.school_name}</td>
          <td><span class="zone-badge zone-${row.zone_code.toLowerCase()}">${row.zone_code}</span></td>
          <td><strong>${row.subject_count}</strong></td>
          <td><span class="diversity-badge diversity-${diversityClass}">${row.subject_diversity}</span></td>
        </tr>`;
      });
      
      html += '</tbody></table>';
      
      if (result.data.length > 10) {
        html += `<div class="table-footer">Showing top 10 of ${result.data.length} schools</div>`;
      }
      
      container.innerHTML = html;
    } else {
      container.innerHTML = '<div class="empty-state-small">No data available</div>';
    }
  } catch (err) {
    console.error('Subject count error:', err);
    container.innerHTML = '<div class="error-state">Failed to load data: ' + err.message + '</div>';
  }
};

// ========== 3. Load Above Average Schools ==========
window.loadAboveAverage = async function() {
  const container = document.getElementById('aboveAverageContent');
  container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
  
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const res = await fetch('/api/analytics/above-average-subjects', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.status === 401) {
      handleAuthError();
      return;
    }

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    
    if (result.success && result.data.length > 0) {
      const avgCount = result.data[0].system_average;
      
      let html = `<div class="analytics-summary">
        <div class="summary-item">
          <span class="summary-label">System Average:</span>
          <span class="summary-value">${avgCount} subjects</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Above Average:</span>
          <span class="summary-value">${result.data.length} schools</span>
        </div>
      </div>`;
      
      html += '<table class="analytics-table compact">';
      html += '<thead><tr><th>School Name</th><th>Zone</th><th>Subjects</th><th>+/- Avg</th></tr></thead>';
      html += '<tbody>';
      
      result.data.slice(0, 10).forEach(row => {
        html += `<tr>
          <td>${row.school_name}</td>
          <td><span class="zone-badge zone-${row.zone_code.toLowerCase()}">${row.zone_code}</span></td>
          <td><strong>${row.subject_count}</strong></td>
          <td><span class="positive-diff">+${row.difference}</span></td>
        </tr>`;
      });
      
      html += '</tbody></table>';
      
      if (result.data.length > 10) {
        html += `<div class="table-footer">Showing top 10 of ${result.data.length} schools</div>`;
      }
      
      container.innerHTML = html;
    } else {
      container.innerHTML = '<div class="empty-state-small">No schools above average</div>';
    }
  } catch (err) {
    console.error('Above average error:', err);
    container.innerHTML = '<div class="error-state">Failed to load data: ' + err.message + '</div>';
  }
};

// ========== 4. Load CCA Participation ==========
window.loadCCAParticipation = async function() {
  const container = document.getElementById('ccaParticipationContent');
  container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
  
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const res = await fetch('/api/analytics/cca-participation', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.status === 401) {
      handleAuthError();
      return;
    }

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    
    if (result.success && result.data.length > 0) {
      let html = '<table class="analytics-table compact">';
      html += '<thead><tr><th>CCA Name</th><th>Schools</th><th>Offerings</th><th>% Schools</th></tr></thead>';
      html += '<tbody>';
      
      result.data.forEach(row => {
        const percentage = parseFloat(row.percentage_of_schools);
        const barWidth = Math.min(percentage, 100);
        
        html += `<tr>
          <td><strong>${row.cca_generic_name}</strong></td>
          <td>${row.school_count}</td>
          <td>${row.total_offerings}</td>
          <td>
            <div class="percentage-bar-container">
              <div class="percentage-bar" style="width: ${barWidth}%"></div>
              <span class="percentage-text">${percentage}%</span>
            </div>
          </td>
        </tr>`;
      });
      
      html += '</tbody></table>';
      container.innerHTML = html;
    } else {
      container.innerHTML = '<div class="empty-state-small">No data available</div>';
    }
  } catch (err) {
    console.error('CCA participation error:', err);
    container.innerHTML = '<div class="error-state">Failed to load data: ' + err.message + '</div>';
  }
};

// ========== 5. Load Data Completeness ==========
window.loadDataCompleteness = async function() {
  const container = document.getElementById('dataCompletenessContent');
  container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
  
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const res = await fetch('/api/analytics/data-completeness', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.status === 401) {
      handleAuthError();
      return;
    }

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    
    if (result.success && result.data.length > 0) {
      let html = `<div class="analytics-summary">
        <div class="summary-item">
          <span class="summary-label">Complete:</span>
          <span class="summary-value">${result.summary.complete_schools}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Good:</span>
          <span class="summary-value">${result.summary.good_schools}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Fair:</span>
          <span class="summary-value">${result.summary.fair_schools}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Incomplete:</span>
          <span class="summary-value">${result.summary.incomplete_schools}</span>
        </div>
      </div>`;
      
      html += '<table class="analytics-table compact">';
      html += '<thead><tr><th>School Name</th><th>Score</th><th>Status</th><th>S/C/P/D</th></tr></thead>';
      html += '<tbody>';
      
      result.data.slice(0, 15).forEach(row => {
        const statusClass = row.completeness_status.toLowerCase();
        html += `<tr>
          <td>${row.school_name}</td>
          <td>
            <div class="score-bar-container">
              <div class="score-bar score-${statusClass}" style="width: ${row.completeness_score}%"></div>
              <span class="score-text">${row.completeness_score}%</span>
            </div>
          </td>
          <td><span class="status-badge status-${statusClass}">${row.completeness_status}</span></td>
          <td class="data-counts">${row.subject_count}/${row.cca_count}/${row.programme_count}/${row.distinctive_count}</td>
        </tr>`;
      });
      
      html += '</tbody></table>';
      
      if (result.data.length > 15) {
        html += `<div class="table-footer">Showing top 15 of ${result.data.length} schools</div>`;
      }
      
      container.innerHTML = html;
    } else {
      container.innerHTML = '<div class="empty-state-small">No data available</div>';
    }
  } catch (err) {
    console.error('Data completeness error:', err);
    container.innerHTML = '<div class="error-state">Failed to load data: ' + err.message + '</div>';
  }
};

// ========== 6. Load Zone Comparison ==========
window.loadZoneComparison = async function() {
  const container = document.getElementById('zoneComparisonContent');
  container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
  
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const res = await fetch('/api/analytics/zone-comparison', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.status === 401) {
      handleAuthError();
      return;
    }

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    
    if (result.success && result.data.length > 0) {
      let html = '<table class="analytics-table">';
      html += `<thead><tr>
        <th>Zone</th>
        <th>Schools</th>
        <th>Types</th>
        <th>Unique Subjects</th>
        <th>Unique CCAs</th>
        <th>Avg Subjects/School</th>
        <th>Avg CCAs/School</th>
      </tr></thead>`;
      html += '<tbody>';
      
      result.data.forEach(row => {
        html += `<tr>
          <td><span class="zone-badge zone-${row.zone_code.toLowerCase()}">${row.zone_code}</span></td>
          <td><strong>${row.total_schools}</strong></td>
          <td>${row.school_types}</td>
          <td>${row.unique_subjects || 0}</td>
          <td>${row.unique_ccas || 0}</td>
          <td>${row.avg_subjects_per_school || '0.00'}</td>
          <td>${row.avg_ccas_per_school || '0.00'}</td>
        </tr>`;
      });
      
      html += '</tbody></table>';
      container.innerHTML = html;
    } else {
      container.innerHTML = '<div class="empty-state-small">No data available</div>';
    }
  } catch (err) {
    console.error('Zone comparison error:', err);
    container.innerHTML = '<div class="error-state">Failed to load data: ' + err.message + '</div>';
  }
};

// ========== 7. Load Popular Searches (Admin Only) ==========
window.loadPopularSearches = async function() {
  const container = document.getElementById('popularSearchesContent');
  if (!container) return;
  
  container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
  
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const res = await fetch('/api/analytics/popular', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.status === 401) {
      handleAuthError();
      return;
    }

    if (res.status === 403) {
      container.innerHTML = '<div class="empty-state-small">Admin access required for search analytics</div>';
      return;
    }

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    
    if (result.length > 0) {
      let html = '<table class="analytics-table compact">';
      html += '<thead><tr><th>Search Term</th><th>Count</th><th>Popularity</th></tr></thead>';
      html += '<tbody>';
      
      result.forEach((item, index) => {
        const maxCount = result[0].count;
        const percentage = (item.count / maxCount) * 100;
        
        html += `<tr>
          <td>${item._id || 'Unknown'}</td>
          <td><strong>${item.count}</strong></td>
          <td>
            <div class="popularity-bar-container">
              <div class="popularity-bar" style="width: ${percentage}%"></div>
              <span class="popularity-text">${Math.round(percentage)}%</span>
            </div>
          </td>
        </tr>`;
      });
      
      html += '</tbody></table>';
      container.innerHTML = html;
    } else {
      container.innerHTML = '<div class="empty-state-small">No search data available</div>';
    }
  } catch (err) {
    console.error('Popular searches error:', err);
    container.innerHTML = '<div class="error-state">Failed to load data: ' + err.message + '</div>';
  }
};

// ========== 8. Load Activity Logs (Admin Only) ==========
window.loadActivityLogs = async function() {
  const container = document.getElementById('activityLogsContent');
  if (!container) return;
  
  container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
  
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const res = await fetch('/api/analytics/logs', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.status === 401) {
      handleAuthError();
      return;
    }

    if (res.status === 403) {
      container.innerHTML = '<div class="empty-state-small">Admin access required for activity logs</div>';
      return;
    }

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const logs = await res.json();
    
    if (logs.length > 0) {
      let html = '<table class="analytics-table compact">';
      html += '<thead><tr><th>Time</th><th>Action</th><th>User</th><th>Details</th></tr></thead>';
      html += '<tbody>';
      
      logs.slice(0, 20).forEach(log => {
        const time = new Date(log.timestamp).toLocaleString();
        const username = log.data?.username || log.data?.admin_username || 'System';
        
        html += `<tr>
          <td class="timestamp">${time}</td>
          <td><span class="action-badge action-${log.action}">${log.action.replace(/_/g, ' ')}</span></td>
          <td>${username}</td>
          <td class="log-details">${formatLogDetails(log.data)}</td>
        </tr>`;
      });
      
      html += '</tbody></table>';
      
      if (logs.length > 20) {
        html += `<div class="table-footer">Showing latest 20 of ${logs.length} activities</div>`;
      }
      
      container.innerHTML = html;
    } else {
      container.innerHTML = '<div class="empty-state-small">No activity logs available</div>';
    }
  } catch (err) {
    console.error('Activity logs error:', err);
    container.innerHTML = '<div class="error-state">Failed to load data: ' + err.message + '</div>';
  }
};

// ========== HELPER FUNCTIONS ==========

function getAuthToken() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error('No authentication token found');
    return null;
  }
  return token;
}

function handleAuthError() {
  localStorage.removeItem('authToken');
  showToast('Session expired. Please login again.', 'error');
  setTimeout(() => {
    window.location.href = '/login?error=Session expired';
  }, 2000);
}

function formatLogDetails(data) {
  if (!data) return '-';
  
  const details = [];
  
  if (data.query) details.push(`Search: "${data.query}"`);
  if (data.results_count !== undefined) details.push(`Results: ${data.results_count}`);
  if (data.school_name) details.push(`School: ${data.school_name}`);
  if (data.criteria_count) details.push(`Criteria: ${data.criteria_count}`);
  
  return details.join(', ') || JSON.stringify(data).substring(0, 100) + '...';
}

// ========== Load All Analytics ==========
window.loadAllAnalytics = function() {
  console.log('Loading all analytics...');
  
  loadZoneStatistics();
  loadSubjectCount();
  loadAboveAverage();
  loadCCAParticipation();
  loadDataCompleteness();
  loadZoneComparison();
  
  // Only load admin analytics if user is admin
  if (isUserAdmin()) {
    loadPopularSearches();
    loadActivityLogs();
  }
  
  showToast('Loading analytics data...', 'info');
};

// ========== Refresh Analytics ==========
window.refreshAnalytics = function() {
  console.log('Refreshing analytics...');
  showToast('Refreshing analytics data...', 'info');
  loadAllAnalytics();
};

// ========== Export Analytics Data ==========
window.exportAnalyticsData = async function() {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    showToast('Preparing data export...', 'info');
    
    // You can implement CSV/Excel export here
    // For now, just show a message
    setTimeout(() => {
      showToast('Export feature coming soon!', 'info');
    }, 1000);
    
  } catch (err) {
    console.error('Export error:', err);
    showToast('Export failed: ' + err.message, 'error');
  }
};

// ========== Initialize Analytics When View is Shown ==========
// Add this to your main JavaScript file's switchView function:
/*
if (viewName === 'analytics') {
  setTimeout(() => {
    loadAllAnalytics();
  }, 300);
}
*/

console.log('✅ Analytics functions loaded with authentication');