/**
 * AppDatMon API Documentation & Interactive Explorer Engine
 * Handles rendering, real-time filtering, live API testing, code generation, and exports.
 */

(function () {
  'use strict';

  // Application State
  const state = {
    currentView: 'overview', // 'overview' | 'auth-guide' | 'models' | 'errors' | 'endpoint' | 'module'
    activeModuleId: null,
    activeEndpointId: null,
    activeTab: 'curl', // 'curl' | 'fetch' | 'axios' | 'python'
    searchQuery: '',
    filterMethod: 'ALL',
    filterRole: 'ALL',
    token: localStorage.getItem('appdatmon_jwt_token') || '',
    baseUrl: localStorage.getItem('appdatmon_base_url') || window.API_DATA.project.defaultBaseUrl,
    theme: localStorage.getItem('appdatmon_theme') || 'dark',
    sidebarCollapsedModules: {}
  };

  // DOM Elements cache
  let el = {};

  function init() {
    applyTheme(state.theme);
    cacheElements();
    bindEvents();
    renderSidebar();
    renderMainContent();
    setupKeyboardShortcuts();
  }

  function cacheElements() {
    el = {
      themeToggleBtn: document.getElementById('theme-toggle-btn'),
      searchInput: document.getElementById('global-search-input'),
      sidebarNav: document.getElementById('sidebar-nav'),
      contentArea: document.getElementById('content-area'),
      playgroundArea: document.getElementById('playground-area'),
      playgroundBody: document.getElementById('playground-body'),
      btnOpenPlayground: document.getElementById('btn-open-playground'),
      btnClosePlayground: document.getElementById('btn-close-playground'),
      btnSidebarToggle: document.getElementById('btn-sidebar-toggle'),
      sidebar: document.getElementById('sidebar'),
      toastContainer: document.getElementById('toast-container'),
      btnExportOpenApi: document.getElementById('btn-export-openapi'),
      btnExportPostman: document.getElementById('btn-export-postman')
    };
  }

  function bindEvents() {
    if (el.themeToggleBtn) {
      el.themeToggleBtn.addEventListener('click', toggleTheme);
    }

    if (el.searchInput) {
      el.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase().trim();
        renderSidebar();
        if (state.searchQuery) {
          // If searching, render search results in main area if in overview
          renderSearchResults();
        }
      });
    }

    if (el.btnOpenPlayground) {
      el.btnOpenPlayground.addEventListener('click', () => {
        el.playgroundArea?.classList.remove('closed');
        el.playgroundArea?.classList.toggle('open');
      });
    }
    if (el.btnClosePlayground) {
      el.btnClosePlayground.addEventListener('click', () => {
        el.playgroundArea?.classList.add('closed');
        el.playgroundArea?.classList.remove('open');
      });
    }

    if (el.btnSidebarToggle) {
      el.btnSidebarToggle.addEventListener('click', () => {
        el.sidebar?.classList.toggle('open');
      });
    }

    if (el.btnExportOpenApi) {
      el.btnExportOpenApi.addEventListener('click', exportOpenApiSpec);
    }
    if (el.btnExportPostman) {
      el.btnExportPostman.addEventListener('click', exportPostmanCollection);
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    state.theme = theme;
    localStorage.setItem('appdatmon_theme', theme);
    const icon = document.getElementById('theme-icon');
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
  }

  function toggleTheme() {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  }

  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl + K or '/' to focus search
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement !== el.searchInput)) {
        e.preventDefault();
        el.searchInput?.focus();
      }
      // Esc to close drawers
      if (e.key === 'Escape') {
        el.playgroundArea?.classList.remove('open');
        el.sidebar?.classList.remove('open');
      }
    });
  }

  // =========================================================================
  // Sidebar Rendering
  // =========================================================================

  function renderSidebar() {
    if (!el.sidebarNav) return;

    let html = `
      <div class="sidebar-filter-bar">
        <div class="filter-row">
          <button class="filter-chip ${state.filterMethod === 'ALL' ? 'active' : ''}" onclick="window.DocApp.setMethodFilter('ALL')">All Methods</button>
          <button class="filter-chip ${state.filterMethod === 'GET' ? 'active' : ''}" onclick="window.DocApp.setMethodFilter('GET')">GET</button>
          <button class="filter-chip ${state.filterMethod === 'POST' ? 'active' : ''}" onclick="window.DocApp.setMethodFilter('POST')">POST</button>
          <button class="filter-chip ${state.filterMethod === 'PUT' ? 'active' : ''}" onclick="window.DocApp.setMethodFilter('PUT')">PUT</button>
          <button class="filter-chip ${state.filterMethod === 'DELETE' ? 'active' : ''}" onclick="window.DocApp.setMethodFilter('DELETE')">DELETE</button>
        </div>
        <div class="filter-row">
          <button class="filter-chip ${state.filterRole === 'ALL' ? 'active' : ''}" onclick="window.DocApp.setRoleFilter('ALL')">All Roles</button>
          <button class="filter-chip ${state.filterRole === 'PUBLIC' ? 'active' : ''}" onclick="window.DocApp.setRoleFilter('PUBLIC')">Public</button>
          <button class="filter-chip ${state.filterRole === 'CUSTOMER' ? 'active' : ''}" onclick="window.DocApp.setRoleFilter('CUSTOMER')">Customer</button>
          <button class="filter-chip ${state.filterRole === 'STAFF' ? 'active' : ''}" onclick="window.DocApp.setRoleFilter('STAFF')">Staff</button>
          <button class="filter-chip ${state.filterRole === 'ADMIN' ? 'active' : ''}" onclick="window.DocApp.setRoleFilter('ADMIN')">Admin</button>
        </div>
      </div>

      <div class="nav-section-title">Tổng quan & Hướng dẫn</div>
      <div class="nav-item ${state.currentView === 'overview' ? 'active' : ''}" onclick="window.DocApp.navigate('overview')">
        <span><i class="fas fa-home nav-item-icon"></i> Tổng quan dự án</span>
        <span class="brand-badge">${window.API_DATA.stats.totalEndpoints} APIs</span>
      </div>
      <div class="nav-item ${state.currentView === 'auth-guide' ? 'active' : ''}" onclick="window.DocApp.navigate('auth-guide')">
        <span><i class="fas fa-key nav-item-icon"></i> Hướng dẫn JWT Auth</span>
      </div>
      <div class="nav-item ${state.currentView === 'errors' ? 'active' : ''}" onclick="window.DocApp.navigate('errors')">
        <span><i class="fas fa-exclamation-triangle nav-item-icon"></i> Chuẩn xử lý lỗi</span>
      </div>
      <div class="nav-item ${state.currentView === 'models' ? 'active' : ''}" onclick="window.DocApp.navigate('models')">
        <span><i class="fas fa-database nav-item-icon"></i> Sequelize Models (${window.API_DATA.dataModels.length})</span>
      </div>

      <div class="nav-section-title" style="margin-top: 1rem;">Danh sách Modules API</div>
    `;

    // Filter modules and endpoints
    window.API_DATA.modules.forEach(mod => {
      const filteredEndpoints = mod.endpoints.filter(ep => {
        const matchMethod = state.filterMethod === 'ALL' || ep.method === state.filterMethod;
        const matchRole = state.filterRole === 'ALL' || ep.allowedRoles.includes(state.filterRole) || (state.filterRole === 'PUBLIC' && !ep.authRequired);
        const matchSearch = !state.searchQuery ||
          ep.name.toLowerCase().includes(state.searchQuery) ||
          ep.path.toLowerCase().includes(state.searchQuery) ||
          ep.summary.toLowerCase().includes(state.searchQuery) ||
          mod.name.toLowerCase().includes(state.searchQuery);
        return matchMethod && matchRole && matchSearch;
      });

      if (filteredEndpoints.length === 0 && (state.filterMethod !== 'ALL' || state.filterRole !== 'ALL' || state.searchQuery)) {
        return; // Skip empty module on filter
      }

      const isCollapsed = !!state.sidebarCollapsedModules[mod.id];

      html += `
        <div class="module-group ${isCollapsed ? 'collapsed' : ''}" id="mod-group-${mod.id}">
          <div class="module-header" onclick="window.DocApp.toggleModule('${mod.id}')">
            <span style="display:flex; align-items:center; gap:0.5rem;">
              <i class="fas ${mod.icon}" style="color: var(--accent-primary); width:16px;"></i>
              <span>${mod.name}</span>
            </span>
            <span style="display:flex; align-items:center; gap:0.4rem;">
              <span style="font-size:0.7rem; color:var(--text-muted); font-family:var(--font-mono);">${filteredEndpoints.length}</span>
              <i class="fas fa-chevron-down module-chevron"></i>
            </span>
          </div>
          <div class="module-endpoints">
            ${filteredEndpoints.map(ep => `
              <div class="endpoint-nav-item ${state.activeEndpointId === ep.id ? 'active' : ''}" 
                   onclick="window.DocApp.selectEndpoint('${mod.id}', '${ep.id}')"
                   title="${ep.name}">
                <span class="badge-method ${ep.method.toLowerCase()}">${ep.method}</span>
                <span class="ep-path">${ep.path}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });

    el.sidebarNav.innerHTML = html;
  }

  // =========================================================================
  // Main Content Rendering
  // =========================================================================

  function renderMainContent() {
    if (!el.contentArea) return;

    if (state.currentView === 'overview') {
      renderOverviewView();
    } else if (state.currentView === 'auth-guide') {
      renderAuthGuideView();
    } else if (state.currentView === 'errors') {
      renderErrorGuideView();
    } else if (state.currentView === 'models') {
      renderModelsView();
    } else if (state.currentView === 'endpoint' && state.activeEndpointId) {
      renderEndpointView();
    } else if (state.currentView === 'module' && state.activeModuleId) {
      renderModuleView();
    }
  }

  function renderOverviewView() {
    const data = window.API_DATA;
    el.contentArea.innerHTML = `
      <div class="doc-container">
        <div class="page-header">
          <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.5rem;">
            <span class="brand-badge" style="font-size:0.8rem; padding:0.3rem 0.7rem;">v${data.project.version}</span>
            <span style="font-family:var(--font-mono); font-size:0.85rem; color:var(--text-muted);">${data.project.environment}</span>
          </div>
          <h1 class="page-title">${data.project.name}</h1>
          <p class="page-desc">${data.project.description}</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">Tổng số Endpoint</span>
            <span class="stat-value" style="color:var(--accent-primary);">${data.stats.totalEndpoints}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Tổng số Module</span>
            <span class="stat-value">${data.stats.totalModules}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Public APIs</span>
            <span class="stat-value" style="color:var(--accent-success);">${data.stats.publicApis}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Protected (JWT)</span>
            <span class="stat-value" style="color:var(--accent-warning);">${data.stats.protectedApis}</span>
          </div>
        </div>

        <!-- System Information Card -->
        <div class="endpoint-card" style="margin-bottom: 2rem;">
          <div class="endpoint-header">
            <h3 style="font-size:1.1rem; display:flex; align-items:center; gap:0.5rem;">
              <i class="fas fa-server" style="color:var(--accent-primary);"></i> Thông tin Cấu hình Backend
            </h3>
          </div>
          <div class="endpoint-content">
            <div class="params-table-wrapper">
              <table class="params-table">
                <thead>
                  <tr>
                    <th>Thông số</th>
                    <th>Giá trị</th>
                    <th>Mô tả</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Base API URL</strong></td>
                    <td><code style="color:var(--accent-primary);">${state.baseUrl}</code></td>
                    <td>Địa chỉ gốc đang chạy của Express Server</td>
                  </tr>
                  <tr>
                    <td><strong>Database</strong></td>
                    <td><code>MySQL (InnoDB) via Sequelize 6</code></td>
                    <td>Tự động đồng bộ Models & Seeders khi khởi động</td>
                  </tr>
                  <tr>
                    <td><strong>Authentication</strong></td>
                    <td><code>Bearer Token (JSON Web Token)</code></td>
                    <td>Thời hạn 7 ngày, mã hóa ID & Role</td>
                  </tr>
                  <tr>
                    <td><strong>Payment Gateway</strong></td>
                    <td><code>PayOS VietQR Integration</code></td>
                    <td>Hỗ trợ quét QR thanh toán tự động & IPN Webhook</td>
                  </tr>
                  <tr>
                    <td><strong>QR Ordering</strong></td>
                    <td><code>QRCode library (Static PNG / Direct Lookup)</code></td>
                    <td>Quét QR bàn ăn tra cứu bàn và gắn vào đơn đặt món</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Role Access Matrix -->
        <div class="endpoint-card" style="margin-bottom: 2rem;">
          <div class="endpoint-header">
            <h3 style="font-size:1.1rem; display:flex; align-items:center; gap:0.5rem;">
              <i class="fas fa-user-shield" style="color:var(--accent-purple);"></i> Phân quyền theo Vai trò (Role Matrix)
            </h3>
          </div>
          <div class="endpoint-content">
            <div class="params-table-wrapper">
              <table class="params-table">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Tên vai trò</th>
                    <th>Phạm vi quyền hạn</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.roles.map(r => `
                    <tr>
                      <td><span class="badge-role ${r.badge}">${r.code}</span></td>
                      <td><strong>${r.name}</strong></td>
                      <td>${r.description}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Quick Module Directory Grid -->
        <div class="section-label" style="font-size:1rem; margin-top:2rem;">
          <i class="fas fa-layer-group"></i> Khám phá Danh mục API Modules
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1rem; margin-top:1rem;">
          ${data.modules.map(mod => `
            <div class="stat-card" style="cursor:pointer;" onclick="window.DocApp.selectModule('${mod.id}')">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.35rem;">
                <span style="font-size:1.1rem; color:var(--accent-primary);"><i class="fas ${mod.icon}"></i></span>
                <span class="badge-role public">${mod.endpoints.length} APIs</span>
              </div>
              <strong style="font-size:1rem; color:var(--text-primary);">${mod.name}</strong>
              <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.25rem;">${mod.title}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderAuthGuideView() {
    const auth = window.API_DATA.authWorkflows;
    el.contentArea.innerHTML = `
      <div class="doc-container">
        <div class="page-header">
          <h1 class="page-title"><i class="fas fa-key" style="color:var(--accent-warning);"></i> ${auth.title}</h1>
          <p class="page-desc">${auth.description}</p>
        </div>

        <!-- Step by Step Workflow -->
        <div style="display:flex; flex-direction:column; gap:1.5rem; margin-bottom:2.5rem;">
          ${auth.steps.map(s => `
            <div class="endpoint-card" style="margin-bottom:0;">
              <div class="endpoint-header" style="flex-direction:row; align-items:center; justify-content:space-between;">
                <div style="display:flex; align-items:center; gap:0.75rem;">
                  <span class="brand-badge" style="background:var(--accent-primary); font-size:0.85rem; border-radius:50%; width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; padding:0;">
                    ${s.step}
                  </span>
                  <h3 style="font-size:1.1rem;">${s.title}</h3>
                </div>
              </div>
              <div class="endpoint-content">
                <p style="color:var(--text-secondary); font-size:0.9rem;">${s.description}</p>
                ${s.code ? `
                  <div class="code-block-wrapper" style="margin-top:0.75rem;">
                    <div class="code-block-header">
                      <span>HTTP Request Header</span>
                      <button class="btn-copy" onclick="window.DocApp.copyText('${s.code}')"><i class="fas fa-copy"></i> Copy</button>
                    </div>
                    <div class="code-content">${escapeHtml(s.code)}</div>
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Middleware Technical Details -->
        <div class="endpoint-card">
          <div class="endpoint-header">
            <h3 style="font-size:1.1rem; display:flex; align-items:center; gap:0.5rem;">
              <i class="fas fa-microchip" style="color:var(--accent-primary);"></i> Chi tiết Middleware trong Source Code
            </h3>
          </div>
          <div class="endpoint-content">
            <div class="params-table-wrapper">
              <table class="params-table">
                <thead>
                  <tr>
                    <th>Middleware Function</th>
                    <th>Cơ chế & Hành vi</th>
                  </tr>
                </thead>
                <tbody>
                  ${auth.middlewareDetails.map(m => `
                    <tr>
                      <td><code style="color:var(--accent-primary); font-weight:700;">${m.name}</code></td>
                      <td>${m.desc}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderErrorGuideView() {
    const error = window.API_DATA.errorGuide;
    el.contentArea.innerHTML = `
      <div class="doc-container">
        <div class="page-header">
          <h1 class="page-title"><i class="fas fa-exclamation-triangle" style="color:var(--accent-danger);"></i> ${error.title}</h1>
          <p class="page-desc">${error.description}</p>
        </div>

        <div class="endpoint-card" style="margin-bottom:2rem;">
          <div class="endpoint-header">
            <h3 style="font-size:1.1rem;">Cấu trúc JSON phản hồi lỗi chung</h3>
          </div>
          <div class="endpoint-content">
            <div class="code-block-wrapper">
              <div class="code-block-header">
                <span>JSON Error Structure</span>
                <button class="btn-copy" onclick="window.DocApp.copyText('${JSON.stringify(error.standardFormat, null, 2)}')"><i class="fas fa-copy"></i> Copy</button>
              </div>
              <div class="code-content">${formatJson(error.standardFormat)}</div>
            </div>
          </div>
        </div>

        <div class="endpoint-card">
          <div class="endpoint-header">
            <h3 style="font-size:1.1rem;">Bảng mã HTTP Status Codes</h3>
          </div>
          <div class="endpoint-content">
            <div class="params-table-wrapper">
              <table class="params-table">
                <thead>
                  <tr>
                    <th>Mã Status</th>
                    <th>Tên gọi</th>
                    <th>Ý nghĩa & Trường hợp phát sinh</th>
                  </tr>
                </thead>
                <tbody>
                  ${error.statusCodes.map(c => {
                    const badgeClass = c.code < 300 ? 's2xx' : c.code < 500 ? 's4xx' : 's5xx';
                    return `
                      <tr>
                        <td><span class="status-code-badge ${badgeClass}">${c.code}</span></td>
                        <td><strong>${c.name}</strong></td>
                        <td>${c.desc}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderModelsView() {
    const models = window.API_DATA.dataModels;
    el.contentArea.innerHTML = `
      <div class="doc-container">
        <div class="page-header">
          <h1 class="page-title"><i class="fas fa-database" style="color:var(--accent-primary);"></i> Cấu trúc Data Models (Sequelize ORM)</h1>
          <p class="page-desc">Tất cả bảng cơ sở dữ liệu MySQL, thuộc tính cột, kiểu dữ liệu, khóa chính/ngoại và quan hệ quan trọng.</p>
        </div>

        ${models.map(m => `
          <div class="model-card" id="model-${m.name.toLowerCase()}">
            <div class="model-header">
              <div class="model-name">
                <i class="fas fa-table" style="color:var(--accent-primary);"></i>
                <span>${m.name}</span>
                <span class="model-table-tag">table: ${m.table}</span>
              </div>
            </div>
            <div class="endpoint-content">
              <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:1rem;">${m.description}</p>
              
              <div class="section-label"><i class="fas fa-columns"></i> Thuộc tính các trường (Attributes)</div>
              <div class="params-table-wrapper" style="margin-bottom:1.25rem;">
                <table class="params-table">
                  <thead>
                    <tr>
                      <th>Tên trường</th>
                      <th>Kiểu dữ liệu</th>
                      <th>Thuộc tính</th>
                      <th>Mô tả</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${m.attributes.map(a => `
                      <tr>
                        <td>
                          <span class="param-name">${a.field}</span>
                          ${a.pk ? '<span class="badge-role admin" style="font-size:0.6rem; padding:0 0.3rem; margin-left:0.3rem;">PK</span>' : ''}
                          ${a.fk ? '<span class="badge-role customer" style="font-size:0.6rem; padding:0 0.3rem; margin-left:0.3rem;">FK</span>' : ''}
                        </td>
                        <td><span class="param-type">${a.type}</span></td>
                        <td>
                          <span style="font-size:0.75rem; color:var(--text-muted);">
                            ${a.null === false ? 'NOT NULL' : 'NULLABLE'}
                            ${a.default !== undefined ? ` • Default: ${a.default}` : ''}
                            ${a.unique ? ' • UNIQUE' : ''}
                          </span>
                        </td>
                        <td>${a.desc}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              ${m.relations && m.relations.length > 0 ? `
                <div class="section-label"><i class="fas fa-project-diagram"></i> Mối quan hệ (Associations)</div>
                <ul style="list-style:none; padding-left:0; display:flex; flex-direction:column; gap:0.35rem;">
                  ${m.relations.map(r => `
                    <li style="font-family:var(--font-mono); font-size:0.8rem; background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:0.4rem 0.65rem; border-radius:4px; color:var(--text-secondary);">
                      <i class="fas fa-link" style="color:var(--accent-primary); margin-right:0.4rem;"></i> ${r}
                    </li>
                  `).join('')}
                </ul>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderModuleView() {
    const mod = window.API_DATA.modules.find(m => m.id === state.activeModuleId);
    if (!mod) return;

    el.contentArea.innerHTML = `
      <div class="doc-container">
        <div class="page-header">
          <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.5rem;">
            <i class="fas ${mod.icon}" style="font-size:1.75rem; color:var(--accent-primary);"></i>
            <h1 class="page-title" style="margin-bottom:0;">Module ${mod.name}</h1>
          </div>
          <p class="page-desc">${mod.description}</p>
        </div>

        <div style="display:flex; flex-direction:column; gap:2rem;">
          ${mod.endpoints.map(ep => renderEndpointCardHtml(mod, ep)).join('')}
        </div>
      </div>
    `;
  }

  function renderEndpointView() {
    let targetEndpoint = null;
    let targetModule = null;

    for (const mod of window.API_DATA.modules) {
      const found = mod.endpoints.find(e => e.id === state.activeEndpointId);
      if (found) {
        targetEndpoint = found;
        targetModule = mod;
        break;
      }
    }

    if (!targetEndpoint || !targetModule) return;

    el.contentArea.innerHTML = `
      <div class="doc-container">
        <div style="margin-bottom:1.5rem; display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; color:var(--text-muted);">
          <span style="cursor:pointer;" onclick="window.DocApp.selectModule('${targetModule.id}')">
            <i class="fas ${targetModule.icon}"></i> ${targetModule.name}
          </span>
          <i class="fas fa-chevron-right" style="font-size:0.65rem;"></i>
          <span style="color:var(--text-primary); font-weight:600;">${targetEndpoint.name}</span>
        </div>

        ${renderEndpointCardHtml(targetModule, targetEndpoint)}
      </div>
    `;

    // Automatically load this endpoint in playground
    populatePlayground(targetEndpoint);
  }

  function renderEndpointCardHtml(mod, ep) {
    const fullUrl = `${state.baseUrl}${ep.path}`;
    const curlCommand = generateCurl(ep);
    const fetchCode = generateFetch(ep);
    const axiosCode = generateAxios(ep);
    const pythonCode = generatePython(ep);

    return `
      <div class="endpoint-card" id="card-${ep.id}">
        <div class="endpoint-header">
          <div class="endpoint-header-top">
            <h2 class="endpoint-name">${ep.name}</h2>
            <div class="endpoint-badges">
              <span class="badge-method ${ep.method.toLowerCase()}">${ep.method}</span>
              ${ep.authRequired ? `
                <span class="badge-role admin"><i class="fas fa-lock"></i> Requires Token</span>
              ` : `
                <span class="badge-role public"><i class="fas fa-globe"></i> Public API</span>
              `}
              ${ep.allowedRoles.map(r => `<span class="badge-role ${r.toLowerCase()}">${r}</span>`).join('')}
            </div>
          </div>

          <div class="endpoint-path-row">
            <span class="endpoint-path-text">${ep.method} ${ep.path}</span>
            <button class="btn-copy" onclick="window.DocApp.copyText('${ep.path}')" title="Copy Endpoint Path">
              <i class="fas fa-copy"></i> Copy Path
            </button>
            <button class="nav-btn primary" style="height:28px; font-size:0.75rem; padding:0 0.6rem;" onclick="window.DocApp.openInPlayground('${ep.id}')">
              <i class="fas fa-play"></i> Try It Out
            </button>
          </div>
        </div>

        <div class="endpoint-content">
          <div>
            <div class="section-label"><i class="fas fa-info-circle"></i> Mô tả nghiệp vụ</div>
            <p style="color:var(--text-secondary); font-size:0.92rem; line-height:1.6; white-space:pre-line;">${ep.description}</p>
          </div>

          ${ep.parameters && ep.parameters.length > 0 ? `
            <div>
              <div class="section-label"><i class="fas fa-sliders-h"></i> Tham số Request Parameters</div>
              <div class="params-table-wrapper">
                <table class="params-table">
                  <thead>
                    <tr>
                      <th>Tên tham số</th>
                      <th>Vị trí (In)</th>
                      <th>Kiểu dữ liệu</th>
                      <th>Bắt buộc</th>
                      <th>Mô tả chi tiết</th>
                      <th>Ví dụ</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${ep.parameters.map(p => `
                      <tr>
                        <td><span class="param-name">${p.name}</span></td>
                        <td><span class="badge-role public" style="font-size:0.65rem;">${p.in}</span></td>
                        <td><span class="param-type">${p.type}</span></td>
                        <td>${p.required ? '<span class="param-required">Required</span>' : '<span style="color:var(--text-muted); font-size:0.75rem;">Optional</span>'}</td>
                        <td>
                          ${p.desc}
                          ${p.enum ? `<div style="font-size:0.72rem; color:var(--text-muted); margin-top:0.2rem;">Allowed: [${p.enum.join(', ')}]</div>` : ''}
                        </td>
                        <td><code>${p.example !== undefined ? p.example : ''}</code></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ''}

          ${ep.requestBody ? `
            <div>
              <div class="section-label"><i class="fas fa-code"></i> Request Body (${ep.requestBody.contentType})</div>
              
              <div class="params-table-wrapper" style="margin-bottom:1rem;">
                <table class="params-table">
                  <thead>
                    <tr>
                      <th>Field Name</th>
                      <th>Type</th>
                      <th>Required</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${ep.requestBody.fields.map(f => `
                      <tr>
                        <td><span class="param-name">${f.name}</span></td>
                        <td><span class="param-type">${f.type}</span></td>
                        <td>${f.required ? '<span class="param-required">Required</span>' : '<span style="color:var(--text-muted); font-size:0.75rem;">Optional</span>'}</td>
                        <td>${f.desc}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              <div class="code-block-wrapper">
                <div class="code-block-header">
                  <span>Sample Payload (JSON)</span>
                  <button class="btn-copy" onclick="window.DocApp.copyText('${escapeJsString(JSON.stringify(ep.requestBody.example, null, 2))}')"><i class="fas fa-copy"></i> Copy JSON</button>
                </div>
                <div class="code-content">${formatJson(ep.requestBody.example)}</div>
              </div>
            </div>
          ` : ''}

          <!-- Code Snippets Generator Tabs -->
          <div>
            <div class="section-label"><i class="fas fa-terminal"></i> Ví dụ Gọi API (Code Snippets)</div>
            <div class="tabs-nav" id="tabs-${ep.id}">
              <button class="tab-btn active" onclick="window.DocApp.switchSnippetTab('${ep.id}', 'curl')">cURL</button>
              <button class="tab-btn" onclick="window.DocApp.switchSnippetTab('${ep.id}', 'fetch')">JavaScript (Fetch)</button>
              <button class="tab-btn" onclick="window.DocApp.switchSnippetTab('${ep.id}', 'axios')">Axios</button>
              <button class="tab-btn" onclick="window.DocApp.switchSnippetTab('${ep.id}', 'python')">Python</button>
            </div>

            <div class="code-block-wrapper">
              <div class="code-block-header">
                <span id="tab-label-${ep.id}">cURL Command</span>
                <button class="btn-copy" id="btn-copy-snippet-${ep.id}" onclick="window.DocApp.copySnippet('${ep.id}')"><i class="fas fa-copy"></i> Copy Code</button>
              </div>
              <div class="code-content" id="snippet-content-${ep.id}">${escapeHtml(curlCommand)}</div>
            </div>
          </div>

          <!-- Responses -->
          <div>
            <div class="section-label"><i class="fas fa-reply-all"></i> Danh sách Responses (${ep.responses.length})</div>
            <div class="response-group">
              ${ep.responses.map(res => {
                const badgeClass = res.statusCode < 300 ? 's2xx' : res.statusCode < 500 ? 's4xx' : 's5xx';
                return `
                  <div class="response-item">
                    <div class="response-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'">
                      <div>
                        <span class="status-code-badge ${badgeClass}">${res.statusCode}</span>
                        <strong style="color:var(--text-primary);">${res.description}</strong>
                      </div>
                      <i class="fas fa-chevron-down" style="font-size:0.75rem; color:var(--text-muted);"></i>
                    </div>
                    <div class="code-block-wrapper" style="border-top:1px solid var(--border-color); border-radius:0;">
                      <div class="code-block-header">
                        <span>Response Body JSON</span>
                        <button class="btn-copy" onclick="window.DocApp.copyText('${escapeJsString(JSON.stringify(res.example, null, 2))}')"><i class="fas fa-copy"></i> Copy Response</button>
                      </div>
                      <div class="code-content">${formatJson(res.example)}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderSearchResults() {
    const results = [];
    window.API_DATA.modules.forEach(mod => {
      mod.endpoints.forEach(ep => {
        if (
          ep.name.toLowerCase().includes(state.searchQuery) ||
          ep.path.toLowerCase().includes(state.searchQuery) ||
          ep.summary.toLowerCase().includes(state.searchQuery) ||
          mod.name.toLowerCase().includes(state.searchQuery)
        ) {
          results.push({ mod, ep });
        }
      });
    });

    el.contentArea.innerHTML = `
      <div class="doc-container">
        <div class="page-header">
          <h1 class="page-title"><i class="fas fa-search" style="color:var(--accent-primary);"></i> Kết quả tìm kiếm</h1>
          <p class="page-desc">Tìm thấy <strong>${results.length}</strong> API phù hợp với từ khóa "<code>${state.searchQuery}</code>"</p>
        </div>

        <div style="display:flex; flex-direction:column; gap:1rem;">
          ${results.map(({ mod, ep }) => `
            <div class="stat-card" style="cursor:pointer;" onclick="window.DocApp.selectEndpoint('${mod.id}', '${ep.id}')">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.4rem;">
                <div style="display:flex; align-items:center; gap:0.6rem;">
                  <span class="badge-method ${ep.method.toLowerCase()}">${ep.method}</span>
                  <span style="font-family:var(--font-mono); font-weight:700; font-size:0.95rem; color:var(--text-primary);">${ep.path}</span>
                </div>
                <span class="badge-role public">${mod.name}</span>
              </div>
              <strong style="color:var(--text-primary); font-size:0.95rem;">${ep.name}</strong>
              <p style="color:var(--text-secondary); font-size:0.85rem; margin-top:0.25rem;">${ep.summary}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // Interactive Try-It-Out & Live Playground
  // =========================================================================

  function populatePlayground(ep) {
    if (!el.playgroundBody) return;

    let pathParams = (ep.parameters || []).filter(p => p.in === 'path');
    let queryParams = (ep.parameters || []).filter(p => p.in === 'query');

    let html = `
      <div class="pg-section">
        <span class="pg-label">Endpoint Mục Tiêu</span>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <span class="badge-method ${ep.method.toLowerCase()}">${ep.method}</span>
          <span style="font-family:var(--font-mono); font-weight:700; font-size:0.85rem; word-break:break-all;">${ep.path}</span>
        </div>
      </div>

      <!-- Base URL Config -->
      <div class="pg-section">
        <span class="pg-label">Base URL</span>
        <input type="text" class="pg-input" id="pg-base-url" value="${state.baseUrl}" onchange="window.DocApp.updateBaseUrl(this.value)">
      </div>

      <!-- Token Management -->
      <div class="pg-section">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <span class="pg-label"><i class="fas fa-lock"></i> Authorization (Bearer Token)</span>
          ${state.token ? '<span style="font-size:0.7rem; color:var(--accent-success); font-weight:700;">✓ Active</span>' : '<span style="font-size:0.7rem; color:var(--text-muted);">No token</span>'}
        </div>
        <input type="text" class="pg-input" id="pg-token-input" placeholder="Dán JWT token vào đây..." value="${state.token}" oninput="window.DocApp.saveToken(this.value)">
        <div style="display:flex; gap:0.4rem; margin-top:0.35rem;">
          <button class="nav-btn" style="flex:1; height:28px; font-size:0.72rem;" onclick="window.DocApp.quickLogin('admin')">🔑 Login Admin</button>
          <button class="nav-btn" style="flex:1; height:28px; font-size:0.72rem;" onclick="window.DocApp.quickLogin('staff')">👤 Login Staff</button>
          <button class="nav-btn" style="height:28px; font-size:0.72rem; color:var(--accent-danger);" onclick="window.DocApp.clearToken()">Clear</button>
        </div>
      </div>

      <!-- Path Params Inputs -->
      ${pathParams.length > 0 ? `
        <div class="pg-section">
          <span class="pg-label">Path Parameters</span>
          ${pathParams.map(p => `
            <div style="margin-bottom:0.4rem;">
              <div style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono); margin-bottom:0.2rem;">:${p.name} (${p.type})</div>
              <input type="text" class="pg-input pg-param-path" data-name="${p.name}" placeholder="Nhập ${p.name}..." value="${p.example || ''}">
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Query Params Inputs -->
      ${queryParams.length > 0 ? `
        <div class="pg-section">
          <span class="pg-label">Query Parameters</span>
          ${queryParams.map(p => `
            <div style="margin-bottom:0.4rem;">
              <div style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono); margin-bottom:0.2rem;">${p.name} (${p.type})</div>
              ${p.enum ? `
                <select class="pg-select pg-param-query" data-name="${p.name}">
                  <option value="">-- Không lọc --</option>
                  ${p.enum.map(opt => `<option value="${opt}" ${p.example === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                </select>
              ` : `
                <input type="text" class="pg-input pg-param-query" data-name="${p.name}" placeholder="Nhập ${p.name}..." value="${p.example || ''}">
              `}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Request Body Input -->
      ${ep.requestBody ? `
        <div class="pg-section">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <span class="pg-label">Request Body (JSON)</span>
            <button class="btn-copy" style="font-size:0.7rem;" onclick="window.DocApp.formatPlaygroundJson()"><i class="fas fa-magic"></i> Format JSON</button>
          </div>
          <textarea class="pg-textarea" id="pg-body-json" rows="8">${JSON.stringify(ep.requestBody.example, null, 2)}</textarea>
        </div>
      ` : ''}

      <!-- Execute Button -->
      <button class="btn-send" id="btn-execute-request" onclick="window.DocApp.executeRequest('${ep.id}')">
        <i class="fas fa-paper-plane"></i> Gửi Request Thực Tế
      </button>

      <!-- Response Viewer -->
      <div class="pg-section" id="pg-response-section" style="display:none;">
        <span class="pg-label">Kết quả Phản hồi (Response)</span>
        <div class="pg-response-box">
          <div class="pg-response-meta">
            <span id="pg-res-status">Status: ---</span>
            <span id="pg-res-time"><i class="fas fa-clock"></i> 0 ms</span>
          </div>
          <div class="code-content" id="pg-res-body" style="max-height:280px;"></div>
        </div>
      </div>
    `;

    el.playgroundBody.innerHTML = html;
  }

  async function executeRequest(endpointId) {
    let ep = null;
    for (const mod of window.API_DATA.modules) {
      ep = mod.endpoints.find(e => e.id === endpointId);
      if (ep) break;
    }
    if (!ep) return;

    const btn = document.getElementById('btn-execute-request');
    const resSection = document.getElementById('pg-response-section');
    const resStatus = document.getElementById('pg-res-status');
    const resTime = document.getElementById('pg-res-time');
    const resBody = document.getElementById('pg-res-body');

    if (btn) {
      btn.classList.add('loading');
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi request...';
    }

    // Build URL with path and query parameters
    let path = ep.path;
    document.querySelectorAll('.pg-param-path').forEach(input => {
      const name = input.getAttribute('data-name');
      const val = input.value.trim();
      path = path.replace(`:${name}`, encodeURIComponent(val || '1'));
      path = path.replace(`{${name}}`, encodeURIComponent(val || '1'));
    });

    const url = new URL(`${state.baseUrl}${path}`);
    document.querySelectorAll('.pg-param-query').forEach(input => {
      const name = input.getAttribute('data-name');
      const val = input.value.trim();
      if (val) {
        url.searchParams.append(name, val);
      }
    });

    // Headers
    const headers = {};
    if (state.token) {
      headers['Authorization'] = `Bearer ${state.token.trim()}`;
    }

    let body = null;
    if (ep.method !== 'GET' && ep.method !== 'HEAD' && ep.requestBody) {
      const bodyText = document.getElementById('pg-body-json')?.value;
      if (bodyText) {
        try {
          body = JSON.stringify(JSON.parse(bodyText));
          headers['Content-Type'] = 'application/json';
        } catch (err) {
          showToast('JSON Request Body không hợp lệ!', 'error');
          if (btn) {
            btn.classList.remove('loading');
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Gửi Request Thực Tế';
          }
          return;
        }
      }
    }

    const startTime = performance.now();

    try {
      const response = await fetch(url.toString(), {
        method: ep.method,
        headers: headers,
        body: body
      });

      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (resSection) resSection.style.display = 'block';
      if (resStatus) {
        const badgeClass = response.status < 300 ? 's2xx' : response.status < 500 ? 's4xx' : 's5xx';
        resStatus.innerHTML = `<span class="status-code-badge ${badgeClass}">${response.status} ${response.statusText}</span>`;
      }
      if (resTime) {
        resTime.innerHTML = `<i class="fas fa-bolt"></i> ${duration} ms`;
      }
      if (resBody) {
        resBody.innerHTML = formatJson(responseData);
      }

      showToast(`Request hoàn tất (${response.status} ${response.statusText} - ${duration}ms)`, response.ok ? 'success' : 'warning');

    } catch (error) {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      if (resSection) resSection.style.display = 'block';
      if (resStatus) {
        resStatus.innerHTML = `<span class="status-code-badge s5xx">Network / CORS Error</span>`;
      }
      if (resTime) {
        resTime.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${duration} ms`;
      }
      if (resBody) {
        resBody.innerHTML = escapeHtml(`Lỗi kết nối tới Server: ${error.message}\n\nHãy đảm bảo Backend đang chạy tại ${state.baseUrl}`);
      }

      showToast(`Lỗi kết nối: ${error.message}`, 'error');
    } finally {
      if (btn) {
        btn.classList.remove('loading');
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Gửi Request Thực Tế';
      }
    }
  }

  // =========================================================================
  // Quick Login Helper (Auto Test Token)
  // =========================================================================

  async function quickLogin(role) {
    const credentials = role === 'admin'
      ? { account: 'admin', password: 'adminpassword' }
      : { account: 'staff', password: 'staffpassword' };

    showToast(`Đang lấy token thử nghiệm cho vai trò ${role.toUpperCase()}...`, 'info');

    try {
      const res = await fetch(`${state.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await res.json();
      if (res.ok && data.token) {
        saveToken(data.token);
        const tokenInput = document.getElementById('pg-token-input');
        if (tokenInput) tokenInput.value = data.token;
        showToast(`Đã nhận và lưu token ${role.toUpperCase()} thành công!`, 'success');
      } else {
        // If demo credentials don't match, ask user
        showToast(data.message || 'Không thể đăng nhập tự động. Hãy nhập token thủ công.', 'warning');
      }
    } catch (err) {
      showToast(`Lỗi khi gọi API login: ${err.message}`, 'error');
    }
  }

  // =========================================================================
  // Code Snippet Generators
  // =========================================================================

  function generateCurl(ep) {
    let cmd = `curl -X ${ep.method} "${state.baseUrl}${ep.path}"`;
    if (ep.authRequired) {
      cmd += ` \\\n  -H "Authorization: Bearer ${state.token || 'YOUR_JWT_TOKEN'}"`;
    }
    if (ep.requestBody) {
      cmd += ` \\\n  -H "Content-Type: ${ep.requestBody.contentType}"`;
      cmd += ` \\\n  -d '${JSON.stringify(ep.requestBody.example)}'`;
    }
    return cmd;
  }

  function generateFetch(ep) {
    const headers = {};
    if (ep.authRequired) {
      headers['Authorization'] = `Bearer ${state.token || 'YOUR_JWT_TOKEN'}`;
    }
    if (ep.requestBody) {
      headers['Content-Type'] = ep.requestBody.contentType;
    }

    let code = `fetch("${state.baseUrl}${ep.path}", {\n`;
    code += `  method: "${ep.method}",\n`;
    code += `  headers: ${JSON.stringify(headers, null, 4)},\n`;
    if (ep.requestBody) {
      code += `  body: JSON.stringify(${JSON.stringify(ep.requestBody.example, null, 4)})\n`;
    }
    code += `})\n`;
    code += `  .then(res => res.json())\n`;
    code += `  .then(data => console.log(data))\n`;
    code += `  .catch(err => console.error(err));`;
    return code;
  }

  function generateAxios(ep) {
    const headers = {};
    if (ep.authRequired) {
      headers['Authorization'] = `Bearer ${state.token || 'YOUR_JWT_TOKEN'}`;
    }

    let code = `import axios from 'axios';\n\n`;
    code += `const response = await axios({\n`;
    code += `  method: '${ep.method.toLowerCase()}',\n`;
    code += `  url: '${state.baseUrl}${ep.path}',\n`;
    if (Object.keys(headers).length > 0) {
      code += `  headers: ${JSON.stringify(headers, null, 4)},\n`;
    }
    if (ep.requestBody) {
      code += `  data: ${JSON.stringify(ep.requestBody.example, null, 4)}\n`;
    }
    code += `});\n`;
    code += `console.log(response.data);`;
    return code;
  }

  function generatePython(ep) {
    let code = `import requests\n\n`;
    code += `url = "${state.baseUrl}${ep.path}"\n`;
    const headers = {};
    if (ep.authRequired) {
      headers['Authorization'] = `Bearer ${state.token || 'YOUR_JWT_TOKEN'}`;
    }
    code += `headers = ${JSON.stringify(headers, null, 4)}\n`;
    if (ep.requestBody) {
      code += `payload = ${JSON.stringify(ep.requestBody.example, null, 4)}\n\n`;
      code += `response = requests.${ep.method.toLowerCase()}(url, headers=headers, json=payload)\n`;
    } else {
      code += `\nresponse = requests.${ep.method.toLowerCase()}(url, headers=headers)\n`;
    }
    code += `print(response.status_code)\n`;
    code += `print(response.json())`;
    return code;
  }

  function switchSnippetTab(epId, tabName) {
    let ep = null;
    for (const mod of window.API_DATA.modules) {
      ep = mod.endpoints.find(e => e.id === epId);
      if (ep) break;
    }
    if (!ep) return;

    const nav = document.getElementById(`tabs-${epId}`);
    if (nav) {
      nav.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      const activeBtn = Array.from(nav.querySelectorAll('.tab-btn')).find(b => b.textContent.toLowerCase().includes(tabName));
      if (activeBtn) activeBtn.classList.add('active');
    }

    const snippetEl = document.getElementById(`snippet-content-${epId}`);
    const labelEl = document.getElementById(`tab-label-${epId}`);

    let content = '';
    if (tabName === 'curl') {
      content = generateCurl(ep);
      if (labelEl) labelEl.textContent = 'cURL Command';
    } else if (tabName === 'fetch') {
      content = generateFetch(ep);
      if (labelEl) labelEl.textContent = 'JavaScript Fetch API';
    } else if (tabName === 'axios') {
      content = generateAxios(ep);
      if (labelEl) labelEl.textContent = 'Axios Client';
    } else if (tabName === 'python') {
      content = generatePython(ep);
      if (labelEl) labelEl.textContent = 'Python Requests';
    }

    if (snippetEl) snippetEl.innerHTML = escapeHtml(content);
  }

  function copySnippet(epId) {
    const snippetEl = document.getElementById(`snippet-content-${epId}`);
    if (snippetEl) {
      copyText(snippetEl.textContent);
    }
  }

  // =========================================================================
  // Export Capabilities
  // =========================================================================

  function exportOpenApiSpec() {
    window.open(`${state.baseUrl}/api-docs.json`, '_blank');
    showToast('Đang mở OpenAPI 3.0 JSON Specification...', 'info');
  }

  function exportPostmanCollection() {
    const postman = {
      info: {
        name: "AppDatMon API Collection",
        description: "Postman collection for AppDatMon Restaurant Management Backend",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      item: window.API_DATA.modules.map(mod => ({
        name: mod.name,
        item: mod.endpoints.map(ep => ({
          name: ep.name,
          request: {
            method: ep.method,
            header: ep.authRequired ? [
              { key: "Authorization", value: "Bearer {{JWT_TOKEN}}", type: "text" }
            ] : [],
            body: ep.requestBody ? {
              mode: "raw",
              raw: JSON.stringify(ep.requestBody.example, null, 2),
              options: { raw: { language: "json" } }
            } : undefined,
            url: {
              raw: `{{BASE_URL}}${ep.path}`,
              host: ["{{BASE_URL}}"],
              path: ep.path.split('/').filter(Boolean)
            },
            description: ep.description
          }
        }))
      }))
    };

    const blob = new Blob([JSON.stringify(postman, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AppDatMon_Postman_Collection.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã tải xuống Postman Collection!', 'success');
  }

  // =========================================================================
  // Helpers & Utility Functions
  // =========================================================================

  function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Đã sao chép vào bộ nhớ tạm (Clipboard)!', 'success');
    }).catch(err => {
      showToast('Không thể sao chép: ' + err, 'error');
    });
  }

  function showToast(message, type = 'info') {
    if (!el.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
    const iconColor = type === 'success' ? 'var(--accent-success)' : type === 'error' ? 'var(--accent-danger)' : type === 'warning' ? 'var(--accent-warning)' : 'var(--accent-primary)';
    
    toast.innerHTML = `<i class="fas ${icon}" style="color:${iconColor}"></i> <span>${message}</span>`;
    el.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
  }

  function escapeJsString(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n');
  }

  function formatJson(obj) {
    if (obj === null || obj === undefined) return '<span style="color:var(--text-muted);">null</span>';
    if (typeof obj === 'string') {
      try {
        obj = JSON.parse(obj);
      } catch (e) {
        return escapeHtml(obj);
      }
    }
    const jsonString = JSON.stringify(obj, null, 2);
    // Basic syntax highlighting for keys, strings, numbers, booleans
    return jsonString.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'color: #93c5fd;'; // number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'color: #38bdf8; font-weight: 600;'; // key
        } else {
          cls = 'color: #86efac;'; // string
        }
      } else if (/true|false/.test(match)) {
        cls = 'color: #fca5a5;'; // boolean
      } else if (/null/.test(match)) {
        cls = 'color: #94a3b8;'; // null
      }
      return `<span style="${cls}">${escapeHtml(match)}</span>`;
    });
  }

  function saveToken(token) {
    state.token = token.trim();
    localStorage.setItem('appdatmon_jwt_token', state.token);
  }

  function clearToken() {
    state.token = '';
    localStorage.removeItem('appdatmon_jwt_token');
    const input = document.getElementById('pg-token-input');
    if (input) input.value = '';
    showToast('Đã xóa Bearer Token!', 'info');
  }

  function updateBaseUrl(newUrl) {
    state.baseUrl = newUrl.trim();
    localStorage.setItem('appdatmon_base_url', state.baseUrl);
    showToast('Đã cập nhật Base URL!', 'success');
  }

  function formatPlaygroundJson() {
    const textarea = document.getElementById('pg-body-json');
    if (!textarea) return;
    try {
      const parsed = JSON.parse(textarea.value);
      textarea.value = JSON.stringify(parsed, null, 2);
      showToast('Đã định dạng JSON!', 'success');
    } catch (err) {
      showToast('JSON không hợp lệ: ' + err.message, 'error');
    }
  }

  // =========================================================================
  // Public Controller Interface
  // =========================================================================

  window.DocApp = {
    navigate: (viewName) => {
      state.currentView = viewName;
      state.activeEndpointId = null;
      renderSidebar();
      renderMainContent();
      el.sidebar?.classList.remove('open');
    },
    selectModule: (moduleId) => {
      state.currentView = 'module';
      state.activeModuleId = moduleId;
      state.activeEndpointId = null;
      renderSidebar();
      renderMainContent();
      el.sidebar?.classList.remove('open');
    },
    selectEndpoint: (moduleId, endpointId) => {
      state.currentView = 'endpoint';
      state.activeModuleId = moduleId;
      state.activeEndpointId = endpointId;
      renderSidebar();
      renderMainContent();
      el.sidebar?.classList.remove('open');
    },
    toggleModule: (moduleId) => {
      state.sidebarCollapsedModules[moduleId] = !state.sidebarCollapsedModules[moduleId];
      const grp = document.getElementById(`mod-group-${moduleId}`);
      if (grp) grp.classList.toggle('collapsed', state.sidebarCollapsedModules[moduleId]);
    },
    setMethodFilter: (method) => {
      state.filterMethod = method;
      renderSidebar();
    },
    setRoleFilter: (role) => {
      state.filterRole = role;
      renderSidebar();
    },
    openInPlayground: (endpointId) => {
      window.DocApp.selectEndpoint(null, endpointId);
      el.playgroundArea?.classList.remove('closed');
      el.playgroundArea?.classList.add('open');
    },
    copyText,
    copySnippet,
    switchSnippetTab,
    saveToken,
    clearToken,
    updateBaseUrl,
    quickLogin,
    executeRequest,
    formatPlaygroundJson
  };

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
