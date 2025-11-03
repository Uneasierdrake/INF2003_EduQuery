// ========== Advanced Search Functions ==========

function showAdvancedSearch() {
  document.getElementById('advancedSearchModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function hideAdvancedSearch() {
  document.getElementById('advancedSearchModal').classList.remove('active');
  document.body.style.overflow = '';
}

function clearAdvancedSearch() {
  document.getElementById('advancedSearchForm').reset();
}

function runAdvancedQuery(event) {
  event.preventDefault();
  
  // Collect all form values
  const formData = {
    school_name: document.getElementById('adv_school_name').value.trim(),
    principal_name: document.getElementById('adv_principal_name').value.trim(),
    vp_name: document.getElementById('adv_vp_name').value.trim(),
    email_address: document.getElementById('adv_email').value.trim(),
    address: document.getElementById('adv_address').value.trim(),
    postal_code: document.getElementById('adv_postal_code').value.trim(),
    fax_no: document.getElementById('adv_fax_no').value.trim(),
    zone_code: document.getElementById('adv_zone_code').value,
    mainlevel_code: document.getElementById('adv_mainlevel_code').value,
    type_code: document.getElementById('adv_type_code').value.trim(),
    nature_code: document.getElementById('adv_nature_code').value.trim(),
    school_section: document.getElementById('adv_school_section').value.trim(),
    session_code: document.getElementById('adv_session_code').value.trim(),
    dgp_code: document.getElementById('adv_dgp_code').value.trim(),
    mothertongue_code: document.getElementById('adv_mothertongue_code').value.trim(),
    autonomous_ind: document.getElementById('adv_autonomous_ind').value,
    gifted_ind: document.getElementById('adv_gifted_ind').value,
    ip_ind: document.getElementById('adv_ip_ind').value,
    sap_ind: document.getElementById('adv_sap_ind').value,
    moe_programme_desc: document.getElementById('adv_moe_programme_desc').value.trim(),
    alp_domain: document.getElementById('adv_alp_domain').value.trim(),
    alp_title: document.getElementById('adv_alp_title').value.trim(),
    llp_domain1: document.getElementById('adv_llp_domain1').value.trim(),
    llp_title: document.getElementById('adv_llp_title').value.trim(),
    subject_desc: document.getElementById('adv_subject_desc').value.trim(),
    cca_generic_name: document.getElementById('adv_cca_generic_name').value.trim(),
    cca_customized_name: document.getElementById('adv_cca_customized_name').value.trim(),
    cca_grouping_desc: document.getElementById('adv_cca_grouping_desc').value.trim(),
    bus_desc: document.getElementById('adv_bus_desc').value.trim(),
    mrt_desc: document.getElementById('adv_mrt_desc').value.trim()
  };
  
  // Filter out empty values
  const searchParams = {};
  Object.keys(formData).forEach(key => {
    if (formData[key]) {
      searchParams[key] = formData[key];
    }
  });
  
  // Check if at least one field is filled
  if (Object.keys(searchParams).length === 0) {
    showToast('Please fill in at least one search field', 'error');
    return;
  }
  
  console.log('Advanced Search Parameters:', searchParams);
  
  // Hide modal
  hideAdvancedSearch();
  
  // Show loading state
  document.getElementById('loadingSpinner').style.display = 'flex';
  document.getElementById('resultsTable').innerHTML = '';
  
  // TODO: Implement the actual API call to backend
  // This is a placeholder - you'll need to connect to your backend API
  
  // Example: Make API call to your backend
  // fetch('/api/advanced-search', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(searchParams)
  // })
  // .then(response => response.json())
  // .then(data => {
  //   displayResults(data);
  // })
  // .catch(error => {
  //   console.error('Error:', error);
  //   showToast('Search failed. Please try again.', 'error');
  // });
  
  // Placeholder response handling
  setTimeout(() => {
    document.getElementById('loadingSpinner').style.display = 'none';
    
    // Placeholder message
    document.getElementById('resultsTable').innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="#3B82F6" stroke-width="4"/>
          <path d="M32 20v24M20 32h24" stroke="#3B82F6" stroke-width="4" stroke-linecap="round"/>
        </svg>
        <h3>Advanced Search Executed</h3>
        <p>Searching with ${Object.keys(searchParams).length} criteria</p>
        <p style="margin-top: 12px; font-size: 14px; color: var(--gray-600);">
          Connect this to your backend API to see results
        </p>
      </div>
    `;
    
    document.getElementById('resultsMeta').textContent = 
      `Searched with ${Object.keys(searchParams).length} filters`;
    
    showToast('Advanced search executed successfully', 'success');
  }, 1000);
}

// Helper function to show toast notifications
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  
  toastMessage.textContent = message;
  toast.className = 'toast show ' + type;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}