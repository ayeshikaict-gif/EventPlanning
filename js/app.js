/**
 * PlanVibe Lanka - Event Planner Studio Application
 * Tailored for Sri Lankan Events & Weddings (Currency: LKR / Rs.)
 * Features Personal Planner Profile, Auto-Save, and Full Data Portability
 */

class EventPlannerApp {
  constructor() {
    this.STORAGE_KEY = 'planvibe_events_lk_v2';
    this.THEME_KEY = 'planvibe_theme';
    this.PROFILE_KEY = 'planvibe_planner_profile_v2';

    this.defaultProfile = {
      name: "Kasun Perera",
      company: "Ceylon Vibe Events & Weddings",
      phone: "+94 77 123 4567",
      email: "kasun@ceylonvibe.lk",
      district: "Colombo",
      currency: "Rs.",
      tagline: "Specialist in Sri Lankan Poruwa Weddings & Luxury Galas"
    };

    this.userProfile = { ...this.defaultProfile };
    this.events = [];
    this.currentEventId = null;
    this.activeTab = 'tabTasks';
    this.currentView = 'viewDashboard';
    this.selectedCategory = 'all';
    this.calendarDate = new Date(); // Tracks calendar month
    this.countdownInterval = null;

    this.init();
  }

  init() {
    this.loadTheme();
    this.loadProfile();
    this.loadEvents();
    this.renderCategoryPills();
    this.renderCategorySelectOptions();
    this.renderDistrictSelectOptions();
    this.renderProfile();
    this.showDashboard();
    this.initConfetti();

    // Start tick for countdown
    setInterval(() => {
      if (this.currentView === 'viewPlanner' && this.currentEventId) {
        this.updateCountdownWidget();
      }
      this.updateNextEventBanner();
    }, 1000);
  }

  /* ================= Planner Profile & User Personalization ================= */
  loadProfile() {
    const saved = localStorage.getItem(this.PROFILE_KEY);
    if (saved) {
      try {
        this.userProfile = { ...this.defaultProfile, ...JSON.parse(saved) };
      } catch (e) {
        this.userProfile = { ...this.defaultProfile };
      }
    } else {
      this.userProfile = { ...this.defaultProfile };
      this.saveProfileToStorage();
    }
  }

  saveProfileToStorage() {
    localStorage.setItem(this.PROFILE_KEY, JSON.stringify(this.userProfile));
  }

  renderProfile() {
    const name = this.userProfile.name || "Planner";
    const company = this.userProfile.company || name;
    
    // Get initials
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "LK";

    // Header profile pill
    const avatarEl = document.getElementById('headerProfileAvatar');
    if (avatarEl) avatarEl.textContent = initials;

    const nameEl = document.getElementById('headerProfileName');
    if (nameEl) nameEl.textContent = company;

    // Welcome title on dashboard
    const welcomeEl = document.getElementById('welcomePlannerName');
    if (welcomeEl) welcomeEl.textContent = name;

    // Modal large avatar
    const largeAvatar = document.getElementById('profileLargeAvatar');
    if (largeAvatar) largeAvatar.textContent = initials;
  }

  openProfileModal() {
    // Fill profile district options
    const distSelect = document.getElementById('profileFormDistrict');
    if (distSelect && distSelect.children.length === 0) {
      let html = '';
      SRI_LANKA_DISTRICTS.forEach(d => {
        html += `<option value="${d}">${d}</option>`;
      });
      distSelect.innerHTML = html;
    }

    document.getElementById('profileFormName').value = this.userProfile.name || '';
    document.getElementById('profileFormCompany').value = this.userProfile.company || '';
    document.getElementById('profileFormPhone').value = this.userProfile.phone || '';
    document.getElementById('profileFormEmail').value = this.userProfile.email || '';
    document.getElementById('profileFormDistrict').value = this.userProfile.district || 'Colombo';
    document.getElementById('profileFormTagline').value = this.userProfile.tagline || '';

    this.openModal('modalProfile');
  }

  saveProfile(e) {
    e.preventDefault();
    this.userProfile.name = document.getElementById('profileFormName').value.trim();
    this.userProfile.company = document.getElementById('profileFormCompany').value.trim();
    this.userProfile.phone = document.getElementById('profileFormPhone').value.trim();
    this.userProfile.email = document.getElementById('profileFormEmail').value.trim();
    this.userProfile.district = document.getElementById('profileFormDistrict').value;
    this.userProfile.tagline = document.getElementById('profileFormTagline').value.trim();

    this.saveProfileToStorage();
    this.renderProfile();
    this.closeModal('modalProfile');
    this.showToast('✨ Your planner profile has been saved!');
  }

  /* ================= Data Portability: Backup, Restore, Clear ================= */
  exportAllData() {
    const backupData = {
      app: "PlanVibe Lanka",
      version: "2.0",
      exportDate: new Date().toISOString(),
      profile: this.userProfile,
      events: this.events
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    const filename = `PlanVibe_Backup_${this.userProfile.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    this.showToast('📥 Backup file downloaded to your computer!');
  }

  importAllData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.events && Array.isArray(imported.events)) {
          this.events = imported.events;
          this.saveEvents();

          if (imported.profile) {
            this.userProfile = { ...this.defaultProfile, ...imported.profile };
            this.saveProfileToStorage();
            this.renderProfile();
          }

          this.renderDashboard();
          this.closeModal('modalProfile');
          this.triggerConfetti();
          this.showToast(`🎉 Restored ${this.events.length} events successfully!`);
        } else {
          alert("Invalid backup file format. Expected a valid PlanVibe JSON file.");
        }
      } catch (err) {
        alert("Could not parse file. Please upload a valid JSON backup.");
      }
    };
    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
  }

  clearWorkspaceToBlank() {
    if (confirm("Start with a clean blank slate? This will remove current events from the screen so you can add your own real events. (You can restore demo templates anytime).")) {
      this.events = [];
      this.saveEvents();
      this.renderDashboard();
      this.closeModal('modalProfile');
      this.showToast('🧹 Clean blank workspace ready for your events!');
    }
  }

  /* ================= Theme Toggle ================= */
  loadTheme() {
    const saved = localStorage.getItem(this.THEME_KEY) || 'light';
    document.documentElement.setAttribute('data-theme', saved);
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(this.THEME_KEY, next);
    this.showToast(next === 'dark' ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
  }

  /* ================= Data Persistence ================= */
  loadEvents() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.events = JSON.parse(saved);
      } catch (e) {
        this.events = JSON.parse(JSON.stringify(DEFAULT_EVENTS));
      }
    } else {
      this.events = JSON.parse(JSON.stringify(DEFAULT_EVENTS));
      this.saveEvents();
    }
  }

  saveEvents() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.events));
  }

  resetSampleData() {
    if (confirm("Restore original Sri Lankan sample events? This will reload the Poruwa Wedding, Corporate Gala, and Beach Party.")) {
      this.events = JSON.parse(JSON.stringify(DEFAULT_EVENTS));
      this.saveEvents();
      this.renderDashboard();
      this.showToast("🪷 Sri Lankan sample events restored successfully!");
    }
  }

  /* ================= Navigation & View Switching ================= */
  switchView(viewId) {
    this.currentView = viewId;
    document.querySelectorAll('.app-view').forEach(view => {
      view.classList.remove('active');
    });
    const target = document.getElementById(viewId);
    if (target) target.classList.add('active');

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    if (viewId === 'viewDashboard') document.getElementById('navDashboard')?.classList.add('active');
    if (viewId === 'viewCalendar') document.getElementById('navCalendar')?.classList.add('active');
    if (viewId === 'viewBudgetGlobal') document.getElementById('navBudget')?.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showDashboard() {
    this.switchView('viewDashboard');
    this.renderDashboard();
  }

  showCalendarView() {
    this.switchView('viewCalendar');
    this.renderCalendar();
  }

  showGlobalBudgetView() {
    this.switchView('viewBudgetGlobal');
    this.renderGlobalBudget();
  }

  openEventWorkspace(eventId) {
    this.currentEventId = eventId;
    const evt = this.getCurrentEvent();
    if (!evt) return;

    this.switchView('viewPlanner');
    this.renderEventWorkspace();
    this.switchTab('tabTasks');
  }

  getCurrentEvent() {
    return this.events.find(e => e.id === this.currentEventId);
  }

  /* ================= Selects & Filters ================= */
  renderCategoryPills() {
    const container = document.getElementById('categoryPillContainer');
    if (!container) return;

    let html = `<button class="cat-pill ${this.selectedCategory === 'all' ? 'active' : ''}" onclick="app.setCategoryFilter('all')">All Events</button>`;

    CATEGORIES.forEach(cat => {
      const active = this.selectedCategory === cat.name ? 'active' : '';
      html += `<button class="cat-pill ${active}" onclick="app.setCategoryFilter('${cat.name}')">${cat.emoji} ${cat.name}</button>`;
    });

    container.innerHTML = html;
  }

  renderCategorySelectOptions() {
    const select = document.getElementById('eventFormCategory');
    if (!select) return;

    let html = '';
    CATEGORIES.forEach(cat => {
      html += `<option value="${cat.name}">${cat.emoji} ${cat.name}</option>`;
    });
    select.innerHTML = html;
  }

  renderDistrictSelectOptions() {
    const select = document.getElementById('eventFormDistrict');
    if (!select) return;

    let html = '';
    SRI_LANKA_DISTRICTS.forEach(d => {
      html += `<option value="${d}">${d}</option>`;
    });
    select.innerHTML = html;
  }

  setCategoryFilter(category) {
    this.selectedCategory = category;
    this.renderCategoryPills();
    this.filterEvents();
  }

  clearSearch() {
    const input = document.getElementById('eventSearchInput');
    if (input) {
      input.value = '';
      this.filterEvents();
    }
  }

  /* ================= Dashboard Rendering ================= */
  renderDashboard() {
    this.renderMetrics();
    this.updateNextEventBanner();
    this.filterEvents();
  }

  renderMetrics() {
    const totalEvents = this.events.length;
    let totalTasks = 0;
    let completedTasks = 0;
    let confirmedGuests = 0;
    let totalSpent = 0;

    this.events.forEach(evt => {
      if (evt.tasks) {
        totalTasks += evt.tasks.length;
        completedTasks += evt.tasks.filter(t => t.completed).length;
      }
      if (evt.guests) {
        evt.guests.forEach(g => {
          if (g.status === 'Attending') {
            confirmedGuests += 1 + (Number(g.plusOnes) || 0);
          }
        });
      }
      if (evt.expenses) {
        evt.expenses.forEach(exp => {
          if (exp.status === 'Paid') {
            totalSpent += Number(exp.amount) || 0;
          }
        });
      }
    });

    document.getElementById('statTotalEvents').textContent = totalEvents;
    document.getElementById('statCompletedTasks').textContent = `${completedTasks} / ${totalTasks}`;
    document.getElementById('statConfirmedGuests').textContent = confirmedGuests;
    document.getElementById('statBudgetSpent').textContent = `Rs. ${totalSpent.toLocaleString()}`;
  }

  updateNextEventBanner() {
    const banner = document.getElementById('nextEventBanner');
    if (!banner) return;

    if (this.events.length === 0) {
      banner.innerHTML = `<span class="pill-head">No Events</span><span class="pill-main">Click "+ Add New Event" to get started!</span>`;
      return;
    }

    // Find closest future event
    const now = new Date();
    const sorted = [...this.events].sort((a, b) => new Date(a.date + 'T' + (a.time || '00:00')) - new Date(b.date + 'T' + (b.time || '00:00')));
    const upcoming = sorted.find(e => new Date(e.date + 'T' + (e.time || '23:59')) >= now) || sorted[0];

    if (!upcoming) return;

    const diffMs = new Date(upcoming.date + 'T' + (upcoming.time || '00:00')) - now;
    let timeText = '';
    if (diffMs < 0) {
      timeText = 'Concluded';
    } else {
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      timeText = `${days}d ${hours}h to go`;
    }

    banner.innerHTML = `
      <div class="pill-glow-dot"></div>
      <div class="pill-text-col" style="cursor: pointer;" onclick="app.openEventWorkspace('${upcoming.id}')">
        <span class="pill-head">Next Upcoming Event in LK</span>
        <span class="pill-main">${upcoming.coverEmoji || '🪷'} ${upcoming.title} (${timeText})</span>
      </div>
    `;
  }

  filterEvents() {
    const search = (document.getElementById('eventSearchInput')?.value || '').toLowerCase().trim();
    const status = document.getElementById('statusFilterSelect')?.value || 'all';

    const filtered = this.events.filter(evt => {
      const matchCategory = this.selectedCategory === 'all' || evt.category === this.selectedCategory;
      const matchStatus = status === 'all' || evt.status === status;
      const matchSearch = !search || 
        evt.title.toLowerCase().includes(search) || 
        evt.venue.toLowerCase().includes(search) ||
        (evt.district && evt.district.toLowerCase().includes(search)) ||
        (evt.clientName && evt.clientName.toLowerCase().includes(search)) ||
        (evt.description && evt.description.toLowerCase().includes(search));

      return matchCategory && matchStatus && matchSearch;
    });

    document.getElementById('eventsCount').textContent = filtered.length;
    this.renderEventsGrid(filtered);
  }

  renderEventsGrid(eventsToRender) {
    const grid = document.getElementById('eventsGrid');
    const emptyState = document.getElementById('eventsEmptyState');
    if (!grid) return;

    if (eventsToRender.length === 0) {
      grid.innerHTML = '';
      emptyState?.classList.remove('hidden');
      return;
    }

    emptyState?.classList.add('hidden');

    grid.innerHTML = eventsToRender.map(evt => {
      const totalTasks = evt.tasks?.length || 0;
      const completedTasks = evt.tasks?.filter(t => t.completed).length || 0;
      const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      const statusClass = evt.status === 'Confirmed' ? 'confirmed' : (evt.status === 'Completed' ? 'completed' : 'in-progress');
      const themeColor = evt.themeColor || 'indigo';

      return `
        <div class="event-card" onclick="app.openEventWorkspace('${evt.id}')">
          <div class="card-cover ${themeColor}">
            <div class="card-emoji-box">${evt.coverEmoji || '🪷'}</div>
            <div class="card-badges">
              <span class="category-badge">${evt.category}</span>
              ${evt.district ? `<span class="district-badge">${evt.district}</span>` : ''}
              <span class="status-badge ${statusClass}">${evt.status}</span>
            </div>
          </div>

          <div class="card-body">
            <h3 class="card-title">${evt.title}</h3>
            <p class="card-desc">${evt.description || 'No description provided.'}</p>

            <div class="card-meta-list">
              <div class="meta-row">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span>${this.formatDate(evt.date)} • ${evt.time || 'Nekatha TBD'}</span>
              </div>
              <div class="meta-row">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>${evt.venue}</span>
              </div>
              ${evt.clientName ? `
              <div class="meta-row">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>Client: <b>${evt.clientName}</b> ${evt.clientPhone ? `(${evt.clientPhone})` : ''}</span>
              </div>
              ` : ''}
            </div>

            <div class="card-progress-section">
              <div class="card-prog-labels">
                <span>Rituals & Tasks Progress</span>
                <span>${completedTasks}/${totalTasks} (${percent}%)</span>
              </div>
              <div class="card-prog-bar">
                <div class="card-prog-fill" style="width: ${percent}%;"></div>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <span class="card-budget-tag">Budget: Rs. ${(Number(evt.budget) || 0).toLocaleString()}</span>
            <span class="card-action-link">
              Open Planner →
            </span>
          </div>
        </div>
      `;
    }).join('');
  }

  /* ================= Event Workspace (Detail View) ================= */
  renderEventWorkspace() {
    const evt = this.getCurrentEvent();
    if (!evt) return;

    // Header info
    document.getElementById('plannerTitle').textContent = `${evt.coverEmoji || '🪷'} ${evt.title}`;
    document.getElementById('plannerDescription').textContent = evt.description || 'No description provided.';
    document.getElementById('plannerCategoryBadge').textContent = evt.category;
    document.getElementById('plannerDistrictBadge').textContent = evt.district || 'Sri Lanka';
    document.getElementById('plannerDate').textContent = this.formatDate(evt.date);
    document.getElementById('plannerTime').textContent = evt.time ? `Nekatha / Time: ${evt.time}` : 'Time TBD';
    document.getElementById('plannerVenue').textContent = evt.venue;

    const clientRow = document.getElementById('plannerClientRow');
    if (evt.clientName) {
      clientRow.style.display = 'flex';
      document.getElementById('plannerClient').textContent = `Client: ${evt.clientName} ${evt.clientPhone ? `• ${evt.clientPhone}` : ''}`;
    } else {
      clientRow.style.display = 'none';
    }

    const statusBadge = document.getElementById('plannerStatusBadge');
    statusBadge.textContent = evt.status;
    statusBadge.className = 'status-badge ' + (evt.status === 'Confirmed' ? 'confirmed' : (evt.status === 'Completed' ? 'completed' : 'in-progress'));

    // Tab badges count
    document.getElementById('tabCountTasks').textContent = evt.tasks?.length || 0;
    document.getElementById('tabCountGuests').textContent = evt.guests?.length || 0;
    document.getElementById('tabCountTimeline').textContent = evt.timeline?.length || 0;
    document.getElementById('tabCountVendors').textContent = evt.vendors?.length || 0;

    this.updateCountdownWidget();

    // Render Sub-components
    this.renderTasks();
    this.renderGuests();
    this.renderBudget();
    this.renderTimeline();
    this.renderVendors();
  }

  updateCountdownWidget() {
    const evt = this.getCurrentEvent();
    const container = document.getElementById('plannerCountdown');
    if (!evt || !container) return;

    const eventDate = new Date(evt.date + 'T' + (evt.time || '00:00'));
    const now = new Date();
    const diffMs = eventDate - now;

    if (diffMs <= 0) {
      container.innerHTML = `<span style="font-weight: 700; color: #10b981;">🪷 Event is currently underway or concluded!</span>`;
      return;
    }

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diffMs / (1000 * 60)) % 60);
    const secs = Math.floor((diffMs / 1000) % 60);

    container.innerHTML = `
      <div class="countdown-unit"><span class="c-val">${days}</span><span class="c-tag">Days</span></div>
      <div class="countdown-unit"><span class="c-val">${hours}</span><span class="c-tag">Hours</span></div>
      <div class="countdown-unit"><span class="c-val">${mins}</span><span class="c-tag">Mins</span></div>
      <div class="countdown-unit"><span class="c-val">${secs}</span><span class="c-tag">Secs</span></div>
    `;
  }

  switchTab(tabId) {
    this.activeTab = tabId;
    document.querySelectorAll('.planner-tabs-bar .tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.remove('active');
    });

    document.getElementById(tabId)?.classList.add('active');
  }

  /* ================= Tab 1: Checklist & Tasks ================= */
  renderTasks() {
    const evt = this.getCurrentEvent();
    if (!evt) return;

    const tasks = evt.tasks || [];
    const container = document.getElementById('taskListContainer');
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Progress bar
    document.getElementById('taskProgressRatio').textContent = `${completed} of ${total} completed (${percent}%)`;
    document.getElementById('taskProgressBar').style.width = `${percent}%`;

    if (tasks.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">📝</div><p>No tasks yet. Click "+ Add Task" to organize Poruwa rituals, catering, decor, or music.</p></div>`;
      return;
    }

    container.innerHTML = tasks.map(task => {
      const priorityClass = (task.priority || 'medium').toLowerCase();
      return `
        <div class="task-item ${task.completed ? 'completed' : ''}">
          <div class="task-left">
            <div class="custom-checkbox" onclick="app.toggleTask('${task.id}')">
              ${task.completed ? '✓' : ''}
            </div>
            <div class="task-details">
              <span class="task-title-text" onclick="app.toggleTask('${task.id}')" style="cursor: pointer;">${task.title}</span>
              <div class="task-sub-meta">
                ${task.category ? `<span>📁 ${task.category}</span>` : ''}
                ${task.dueDate ? `<span>📅 Due: ${task.dueDate}</span>` : ''}
                <span class="task-pill ${priorityClass}">${task.priority || 'Medium'}</span>
              </div>
            </div>
          </div>
          <div class="task-actions">
            <button class="btn-delete-item" onclick="app.deleteTask('${task.id}')" title="Delete task">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  toggleTask(taskId) {
    const evt = this.getCurrentEvent();
    if (!evt || !evt.tasks) return;

    const task = evt.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.saveEvents();
      this.renderTasks();

      if (task.completed) {
        this.showToast('✅ Ritual / task marked as complete!');
        if (evt.tasks.every(t => t.completed)) {
          this.triggerConfetti();
          this.showToast('🎉 Jayawewa! All tasks for this event are complete!');
        }
      }
    }
  }

  deleteTask(taskId) {
    const evt = this.getCurrentEvent();
    if (!evt || !evt.tasks) return;

    evt.tasks = evt.tasks.filter(t => t.id !== taskId);
    this.saveEvents();
    this.renderTasks();
    document.getElementById('tabCountTasks').textContent = evt.tasks.length;
    this.showToast('Task removed.');
  }

  openAddTaskModal() {
    document.getElementById('formTask').reset();
    this.openModal('modalTask');
  }

  saveTask(e) {
    e.preventDefault();
    const evt = this.getCurrentEvent();
    if (!evt) return;

    const title = document.getElementById('taskFormTitle').value.trim();
    const category = document.getElementById('taskFormCategory').value.trim();
    const priority = document.getElementById('taskFormPriority').value;
    const dueDate = document.getElementById('taskFormDueDate').value;

    if (!evt.tasks) evt.tasks = [];
    evt.tasks.push({
      id: 'task-' + Date.now(),
      title,
      category,
      priority,
      dueDate,
      completed: false
    });

    this.saveEvents();
    this.closeModal('modalTask');
    this.renderTasks();
    document.getElementById('tabCountTasks').textContent = evt.tasks.length;
    this.showToast('✨ New task added to checklist!');
  }

  /* ================= Tab 2: Guests & RSVPs ================= */
  renderGuests() {
    const evt = this.getCurrentEvent();
    if (!evt) return;

    const guests = evt.guests || [];
    const tbody = document.getElementById('guestTableBody');

    let attending = 0;
    let awaiting = 0;
    let declined = 0;
    let totalHeadcount = 0;

    guests.forEach(g => {
      if (g.status === 'Attending') {
        attending += 1;
        totalHeadcount += 1 + (Number(g.plusOnes) || 0);
      } else if (g.status === 'Declined') {
        declined += 1;
      } else {
        awaiting += 1;
      }
    });

    document.getElementById('rsvpCountAttending').textContent = attending;
    document.getElementById('rsvpCountAwaiting').textContent = awaiting;
    document.getElementById('rsvpCountDeclined').textContent = declined;
    document.getElementById('rsvpCountHeadcount').textContent = totalHeadcount;

    if (guests.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">No guests added yet. Click "+ Add Guest" to invite attendees.</td></tr>`;
      return;
    }

    tbody.innerHTML = guests.map(guest => {
      const statusClass = (guest.status || 'awaiting').toLowerCase();
      return `
        <tr>
          <td style="font-weight: 600;">${guest.name}</td>
          <td style="color: var(--text-muted);">${guest.email || '—'}</td>
          <td>
            <select class="table-status-select ${statusClass}" onchange="app.changeGuestRSVP('${guest.id}', this.value)">
              <option value="Attending" ${guest.status === 'Attending' ? 'selected' : ''}>Attending</option>
              <option value="Awaiting" ${guest.status === 'Awaiting' ? 'selected' : ''}>Awaiting Reply</option>
              <option value="Declined" ${guest.status === 'Declined' ? 'selected' : ''}>Declined</option>
            </select>
          </td>
          <td>+${guest.plusOnes || 0}</td>
          <td style="color: var(--text-muted); font-size: 0.82rem;">${guest.notes || '—'}</td>
          <td class="text-right">
            <button class="btn-delete-item" onclick="app.deleteGuest('${guest.id}')" title="Remove guest">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  changeGuestRSVP(guestId, newStatus) {
    const evt = this.getCurrentEvent();
    if (!evt || !evt.guests) return;

    const guest = evt.guests.find(g => g.id === guestId);
    if (guest) {
      guest.status = newStatus;
      this.saveEvents();
      this.renderGuests();
      this.showToast(`Updated ${guest.name}'s RSVP to ${newStatus}.`);
    }
  }

  deleteGuest(guestId) {
    const evt = this.getCurrentEvent();
    if (!evt || !evt.guests) return;

    evt.guests = evt.guests.filter(g => g.id !== guestId);
    this.saveEvents();
    this.renderGuests();
    document.getElementById('tabCountGuests').textContent = evt.guests.length;
    this.showToast('Guest removed.');
  }

  openAddGuestModal() {
    document.getElementById('formGuest').reset();
    this.openModal('modalGuest');
  }

  saveGuest(e) {
    e.preventDefault();
    const evt = this.getCurrentEvent();
    if (!evt) return;

    const name = document.getElementById('guestFormName').value.trim();
    const email = document.getElementById('guestFormEmail').value.trim();
    const status = document.getElementById('guestFormStatus').value;
    const plusOnes = parseInt(document.getElementById('guestFormPlusOnes').value) || 0;
    const diet = document.getElementById('guestFormDiet').value;
    const rawNotes = document.getElementById('guestFormNotes').value.trim();

    const notes = diet ? `${diet}${rawNotes ? ' • ' + rawNotes : ''}` : rawNotes;

    if (!evt.guests) evt.guests = [];
    evt.guests.push({
      id: 'guest-' + Date.now(),
      name,
      email,
      status,
      plusOnes,
      notes
    });

    this.saveEvents();
    this.closeModal('modalGuest');
    this.renderGuests();
    document.getElementById('tabCountGuests').textContent = evt.guests.length;
    this.showToast(`🎉 ${name} added to guest list!`);
  }

  exportGuestsCSV() {
    const evt = this.getCurrentEvent();
    if (!evt || !evt.guests || evt.guests.length === 0) {
      this.showToast('No guests to export.');
      return;
    }

    const headers = ['Name', 'Contact', 'RSVP Status', 'Plus Ones', 'Notes / Dietary'];
    const rows = evt.guests.map(g => [
      `"${g.name.replace(/"/g, '""')}"`,
      `"${(g.email || '').replace(/"/g, '""')}"`,
      `"${g.status}"`,
      g.plusOnes || 0,
      `"${(g.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${evt.title.replace(/[^a-z0-9]/gi, '_')}_Guests.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast('📥 Guest list exported to CSV!');
  }

  /* ================= Tab 3: Budget & Expenses (LKR) ================= */
  renderBudget() {
    const evt = this.getCurrentEvent();
    if (!evt) return;

    const totalBudget = Number(evt.budget) || 0;
    const expenses = evt.expenses || [];
    let totalSpent = 0;

    expenses.forEach(exp => {
      totalSpent += Number(exp.amount) || 0;
    });

    const remaining = totalBudget - totalSpent;
    const percent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

    document.getElementById('eventTotalBudget').textContent = `Rs. ${totalBudget.toLocaleString()}`;
    document.getElementById('eventTotalSpent').textContent = `Rs. ${totalSpent.toLocaleString()}`;
    
    const remainingEl = document.getElementById('eventRemainingBudget');
    remainingEl.textContent = `Rs. ${remaining.toLocaleString()}`;
    if (remaining < 0) {
      remainingEl.style.color = 'var(--accent-rose)';
    } else {
      remainingEl.style.color = 'var(--text-main)';
    }

    document.getElementById('budgetUsagePercent').textContent = `${percent}% Used`;
    const bar = document.getElementById('budgetProgressBar');
    bar.style.width = `${Math.min(percent, 100)}%`;
    if (percent > 100) {
      bar.style.background = 'var(--accent-rose)';
    } else {
      bar.style.background = 'linear-gradient(90deg, var(--primary) 0%, #ec4899 100%)';
    }

    const tbody = document.getElementById('expenseTableBody');
    if (expenses.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">No expenses logged yet in LKR. Click "+ Add Expense" to record costs.</td></tr>`;
      return;
    }

    tbody.innerHTML = expenses.map(exp => {
      const paidClass = exp.status === 'Paid' ? 'paid' : 'pending';
      return `
        <tr>
          <td style="font-weight: 600;">${exp.title}</td>
          <td><span class="task-pill medium">${exp.category}</span></td>
          <td style="font-weight: 700;">Rs. ${(Number(exp.amount) || 0).toLocaleString()}</td>
          <td>
            <select class="table-status-select ${paidClass}" onchange="app.changeExpenseStatus('${exp.id}', this.value)">
              <option value="Paid" ${exp.status === 'Paid' ? 'selected' : ''}>Paid</option>
              <option value="Pending" ${exp.status === 'Pending' ? 'selected' : ''}>Pending</option>
            </select>
          </td>
          <td class="text-right">
            <button class="btn-delete-item" onclick="app.deleteExpense('${exp.id}')" title="Delete expense">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  changeExpenseStatus(expenseId, newStatus) {
    const evt = this.getCurrentEvent();
    if (!evt || !evt.expenses) return;

    const exp = evt.expenses.find(e => e.id === expenseId);
    if (exp) {
      exp.status = newStatus;
      this.saveEvents();
      this.renderBudget();
      this.showToast(`Expense updated to ${newStatus}.`);
    }
  }

  deleteExpense(expenseId) {
    const evt = this.getCurrentEvent();
    if (!evt || !evt.expenses) return;

    evt.expenses = evt.expenses.filter(e => e.id !== expenseId);
    this.saveEvents();
    this.renderBudget();
    this.showToast('Expense removed.');
  }

  openAddExpenseModal() {
    document.getElementById('formExpense').reset();
    this.openModal('modalExpense');
  }

  saveExpense(e) {
    e.preventDefault();
    const evt = this.getCurrentEvent();
    if (!evt) return;

    const title = document.getElementById('expenseFormTitle').value.trim();
    const category = document.getElementById('expenseFormCategory').value;
    const amount = parseFloat(document.getElementById('expenseFormAmount').value) || 0;
    const status = document.getElementById('expenseFormStatus').value;

    if (!evt.expenses) evt.expenses = [];
    evt.expenses.push({
      id: 'exp-' + Date.now(),
      title,
      category,
      amount,
      status
    });

    this.saveEvents();
    this.closeModal('modalExpense');
    this.renderBudget();
    this.showToast('💵 Expense recorded in LKR!');
  }

  /* ================= Tab 4: Day-of Timeline (Nekath & Schedule) ================= */
  renderTimeline() {
    const evt = this.getCurrentEvent();
    if (!evt) return;

    const items = [...(evt.timeline || [])].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    const container = document.getElementById('timelineContainer');

    if (items.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">⏰</div><p>No schedule items yet. Click "+ Add Schedule Item" to build the auspicious Nekath rundown.</p></div>`;
      return;
    }

    container.innerHTML = items.map(slot => {
      return `
        <div class="timeline-slot">
          <div class="timeline-bullet"></div>
          <div class="timeline-box">
            <div>
              <span class="timeline-time-badge">${slot.time}</span>
              <div class="timeline-title-text">${slot.title}</div>
              ${slot.description ? `<p class="timeline-desc-text">${slot.description}</p>` : ''}
            </div>
            <button class="btn-delete-item" onclick="app.deleteTimeline('${slot.id}')" title="Delete slot">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  deleteTimeline(timelineId) {
    const evt = this.getCurrentEvent();
    if (!evt || !evt.timeline) return;

    evt.timeline = evt.timeline.filter(t => t.id !== timelineId);
    this.saveEvents();
    this.renderTimeline();
    document.getElementById('tabCountTimeline').textContent = evt.timeline.length;
    this.showToast('Schedule item removed.');
  }

  openAddTimelineModal() {
    document.getElementById('formTimeline').reset();
    this.openModal('modalTimeline');
  }

  saveTimeline(e) {
    e.preventDefault();
    const evt = this.getCurrentEvent();
    if (!evt) return;

    const time = document.getElementById('timelineFormTime').value;
    const title = document.getElementById('timelineFormTitle').value.trim();
    const description = document.getElementById('timelineFormDesc').value.trim();

    if (!evt.timeline) evt.timeline = [];
    evt.timeline.push({
      id: 'tm-' + Date.now(),
      time,
      title,
      description
    });

    this.saveEvents();
    this.closeModal('modalTimeline');
    this.renderTimeline();
    document.getElementById('tabCountTimeline').textContent = evt.timeline.length;
    this.showToast('⏱️ Schedule / Nekath item added!');
  }

  /* ================= Tab 5: Vendors Directory ================= */
  renderVendors() {
    const evt = this.getCurrentEvent();
    if (!evt) return;

    const vendors = evt.vendors || [];
    const container = document.getElementById('vendorsContainer');

    if (vendors.length === 0) {
      container.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1;"><div class="empty-icon">🤝</div><p>No vendor contacts saved yet. Click "+ Add Vendor" to add Poruwa, Papare, Catering, or Photo partners.</p></div>`;
      return;
    }

    container.innerHTML = vendors.map(v => {
      return `
        <div class="vendor-card">
          <div class="vendor-top">
            <div>
              <div class="vendor-name">${v.name}</div>
              <div class="vendor-service">${v.service}</div>
            </div>
            <span class="status-badge confirmed">${v.status || 'Confirmed'}</span>
          </div>
          <div class="vendor-contact">
            📞 ${v.contact || 'No contact provided'}
          </div>
          <div style="display: flex; justify-content: flex-end;">
            <button class="btn-delete-item" onclick="app.deleteVendor('${v.id}')" title="Delete vendor">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  deleteVendor(vendorId) {
    const evt = this.getCurrentEvent();
    if (!evt || !evt.vendors) return;

    evt.vendors = evt.vendors.filter(v => v.id !== vendorId);
    this.saveEvents();
    this.renderVendors();
    document.getElementById('tabCountVendors').textContent = evt.vendors.length;
    this.showToast('Vendor removed.');
  }

  openAddVendorModal() {
    document.getElementById('formVendor').reset();
    this.openModal('modalVendor');
  }

  saveVendor(e) {
    e.preventDefault();
    const evt = this.getCurrentEvent();
    if (!evt) return;

    const name = document.getElementById('vendorFormName').value.trim();
    const service = document.getElementById('vendorFormService').value.trim();
    const contact = document.getElementById('vendorFormContact').value.trim();
    const status = document.getElementById('vendorFormStatus').value;

    if (!evt.vendors) evt.vendors = [];
    evt.vendors.push({
      id: 'vendor-' + Date.now(),
      name,
      service,
      contact,
      status
    });

    this.saveEvents();
    this.closeModal('modalVendor');
    this.renderVendors();
    document.getElementById('tabCountVendors').textContent = evt.vendors.length;
    this.showToast('🤝 Vendor contact saved!');
  }

  /* ================= Create / Edit Event Modal ================= */
  openNewEventModal() {
    document.getElementById('formEvent').reset();
    document.getElementById('eventFormId').value = '';
    document.getElementById('modalEventTitle').textContent = 'Add New Sri Lankan Event';

    // Default to a date next month
    const future = new Date();
    future.setDate(future.getDate() + 21);
    document.getElementById('eventFormDate').value = future.toISOString().split('T')[0];

    this.openModal('modalEvent');
  }

  openEditEventModal() {
    const evt = this.getCurrentEvent();
    if (!evt) return;

    document.getElementById('eventFormId').value = evt.id;
    document.getElementById('modalEventTitle').textContent = 'Edit Event Details';
    document.getElementById('eventFormTitle').value = evt.title;
    document.getElementById('eventFormCategory').value = evt.category;
    document.getElementById('eventFormDistrict').value = evt.district || 'Colombo';
    document.getElementById('eventFormDate').value = evt.date;
    document.getElementById('eventFormTime').value = evt.time || '09:30';
    document.getElementById('eventFormVenue').value = evt.venue;
    document.getElementById('eventFormClientName').value = evt.clientName || '';
    document.getElementById('eventFormClientPhone').value = evt.clientPhone || '';
    document.getElementById('eventFormBudget').value = evt.budget || 0;
    document.getElementById('eventFormStatus').value = evt.status || 'In Progress';
    document.getElementById('eventFormDesc').value = evt.description || '';

    this.openModal('modalEvent');
  }

  saveEvent(e) {
    e.preventDefault();
    const id = document.getElementById('eventFormId').value;
    const title = document.getElementById('eventFormTitle').value.trim();
    const category = document.getElementById('eventFormCategory').value;
    const district = document.getElementById('eventFormDistrict').value;
    const date = document.getElementById('eventFormDate').value;
    const time = document.getElementById('eventFormTime').value;
    const venue = document.getElementById('eventFormVenue').value.trim();
    const clientName = document.getElementById('eventFormClientName').value.trim();
    const clientPhone = document.getElementById('eventFormClientPhone').value.trim();
    const budget = parseFloat(document.getElementById('eventFormBudget').value) || 0;
    const status = document.getElementById('eventFormStatus').value;
    const description = document.getElementById('eventFormDesc').value.trim();

    // Map themeColor & coverEmoji based on category
    const foundCat = CATEGORIES.find(c => c.name === category);
    const themeColor = foundCat ? foundCat.color : 'indigo';
    const coverEmoji = foundCat ? foundCat.emoji : '🪷';

    if (id) {
      // Edit existing
      const evt = this.events.find(e => e.id === id);
      if (evt) {
        evt.title = title;
        evt.category = category;
        evt.district = district;
        evt.coverEmoji = coverEmoji;
        evt.date = date;
        evt.time = time;
        evt.venue = venue;
        evt.clientName = clientName;
        evt.clientPhone = clientPhone;
        evt.budget = budget;
        evt.status = status;
        evt.description = description;
        evt.themeColor = themeColor;
        this.saveEvents();
        this.closeModal('modalEvent');
        this.renderEventWorkspace();
        this.showToast('Event updated successfully!');
      }
    } else {
      // Create new event
      const newEvent = {
        id: 'evt-sl-' + Date.now(),
        title,
        category,
        district,
        themeColor,
        date,
        time,
        venue,
        clientName,
        clientPhone,
        description,
        budget,
        status,
        coverEmoji,
        tasks: [],
        guests: [],
        expenses: [],
        timeline: [],
        vendors: []
      };

      this.events.unshift(newEvent);
      this.saveEvents();
      this.closeModal('modalEvent');
      this.triggerConfetti();
      this.showToast('🎉 New Sri Lankan event added to planner!');
      this.openEventWorkspace(newEvent.id);
    }
  }

  confirmDeleteCurrentEvent() {
    const evt = this.getCurrentEvent();
    if (!evt) return;

    document.getElementById('confirmModalText').textContent = `Are you sure you want to delete "${evt.title}"? All guests, tasks, and budget items for this event will be permanently deleted.`;
    const actionBtn = document.getElementById('confirmModalActionBtn');
    actionBtn.onclick = () => {
      this.events = this.events.filter(e => e.id !== evt.id);
      this.saveEvents();
      this.closeModal('modalConfirm');
      this.showDashboard();
      this.showToast('Event deleted.');
    };
    this.openModal('modalConfirm');
  }

  printEventSummary() {
    window.print();
  }

  /* ================= Calendar View ================= */
  renderCalendar() {
    const year = this.calendarDate.getFullYear();
    const month = this.calendarDate.getMonth();
    const monthName = this.calendarDate.toLocaleString('default', { month: 'long' });
    document.getElementById('calendarMonthYearTitle').textContent = `${monthName} ${year}`;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const prevLastDay = new Date(year, month, 0).getDate();

    const grid = document.getElementById('calendarDaysGrid');
    if (!grid) return;

    let html = '';

    // Prev month overflow days
    for (let i = firstDayIndex; i > 0; i--) {
      html += `<div class="calendar-cell other-month"><span class="day-number">${prevLastDay - i + 1}</span></div>`;
    }

    // Days of current month
    const today = new Date();
    for (let d = 1; d <= lastDayOfMonth; d++) {
      const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
      const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

      // Events on this date
      const daysEvents = this.events.filter(e => e.date === formattedDate);

      let eventsHtml = '';
      daysEvents.forEach(evt => {
        eventsHtml += `
          <div class="cal-event-pill" onclick="app.openEventWorkspace('${evt.id}')" title="${evt.title} (${evt.time || 'TBD'})">
            ${evt.coverEmoji || '🪷'} ${evt.title}
          </div>
        `;
      });

      html += `
        <div class="calendar-cell ${isToday ? 'today' : ''}">
          <span class="day-number">${d}</span>
          ${eventsHtml}
        </div>
      `;
    }

    // Next month overflow days
    const totalCells = firstDayIndex + lastDayOfMonth;
    const remainingCells = 35 - totalCells > 0 ? 35 - totalCells : (42 - totalCells > 0 ? 42 - totalCells : 0);
    for (let j = 1; j <= remainingCells; j++) {
      html += `<div class="calendar-cell other-month"><span class="day-number">${j}</span></div>`;
    }

    grid.innerHTML = html;
  }

  prevCalendarMonth() {
    this.calendarDate.setMonth(this.calendarDate.getMonth() - 1);
    this.renderCalendar();
  }

  nextCalendarMonth() {
    this.calendarDate.setMonth(this.calendarDate.getMonth() + 1);
    this.renderCalendar();
  }

  todayCalendarMonth() {
    this.calendarDate = new Date();
    this.renderCalendar();
  }

  /* ================= Global Budget View (LKR) ================= */
  renderGlobalBudget() {
    const container = document.getElementById('globalBudgetCards');
    if (!container) return;

    if (this.events.length === 0) {
      container.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1;"><div class="empty-icon">💰</div><p>No events to analyze yet.</p></div>`;
      return;
    }

    container.innerHTML = this.events.map(evt => {
      const budget = Number(evt.budget) || 0;
      let spent = 0;
      (evt.expenses || []).forEach(e => spent += Number(e.amount) || 0);
      const remaining = budget - spent;
      const pct = budget > 0 ? Math.round((spent / budget) * 100) : 0;

      return `
        <div class="global-b-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <h3>${evt.coverEmoji || '🪷'} ${evt.title}</h3>
            <button class="btn btn-sm btn-secondary" onclick="app.openEventWorkspace('${evt.id}')">View</button>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">
            📍 ${evt.venue} (${evt.district || 'Sri Lanka'})
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">
            <span>Budget: <b>Rs. ${budget.toLocaleString()}</b></span>
            <span>Spent: <b style="color: var(--primary);">Rs. ${spent.toLocaleString()}</b></span>
          </div>
          <div class="progress-track" style="margin-bottom: 0.75rem;">
            <div class="progress-fill ${pct > 100 ? 'budget-fill' : ''}" style="width: ${Math.min(pct, 100)}%;"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600;">
            <span>Remaining: <b style="color: ${remaining < 0 ? 'var(--accent-rose)' : 'inherit'};">Rs. ${remaining.toLocaleString()}</b></span>
            <span>${pct}% used</span>
          </div>
        </div>
      `;
    }).join('');
  }

  /* ================= Modal Helpers ================= */
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('open');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
  }

  handleBackdropClick(event, modalId) {
    if (event.target.id === modalId) {
      this.closeModal(modalId);
    }
  }

  /* ================= Toast Notifications ================= */
  showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-fadeout');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 2800);
  }

  /* ================= Utility Helpers ================= */
  formatDate(dateString) {
    if (!dateString) return 'Date TBD';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return dateString;
  }

  /* ================= Interactive Canvas Confetti ================= */
  initConfetti() {
    this.confettiCanvas = document.getElementById('confettiCanvas');
    if (!this.confettiCanvas) return;
    this.confettiCtx = this.confettiCanvas.getContext('2d');
    this.particles = [];
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    if (!this.confettiCanvas) return;
    this.confettiCanvas.width = window.innerWidth;
    this.confettiCanvas.height = window.innerHeight;
  }

  triggerConfetti() {
    if (!this.confettiCanvas) return;
    this.particles = [];
    const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#3b82f6'];

    for (let i = 0; i < 90; i++) {
      this.particles.push({
        x: window.innerWidth / 2 + (Math.random() * 200 - 100),
        y: window.innerHeight / 3 + (Math.random() * 100 - 50),
        r: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.7) * 14,
        gravity: 0.35,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1
      });
    }

    if (!this.confettiRunning) {
      this.confettiRunning = true;
      this.animateConfetti();
    }
  }

  animateConfetti() {
    if (!this.confettiCtx || !this.confettiRunning) return;
    this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.009;

      if (p.opacity > 0) {
        this.confettiCtx.save();
        this.confettiCtx.translate(p.x, p.y);
        this.confettiCtx.rotate((p.rotation * Math.PI) / 180);
        this.confettiCtx.fillStyle = p.color;
        this.confettiCtx.globalAlpha = Math.max(p.opacity, 0);
        this.confettiCtx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
        this.confettiCtx.restore();
      }
    }

    this.particles = this.particles.filter(p => p.opacity > 0 && p.y < window.innerHeight);

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.animateConfetti());
    } else {
      this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
      this.confettiRunning = false;
    }
  }
}

// Instantiate on DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new EventPlannerApp();
});
