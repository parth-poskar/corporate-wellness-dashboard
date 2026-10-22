/**
 * Corporate Wellness Dashboard - Frontend Application Controller
 * Implements all 8 Stitch screens, shared persistent App Shell,
 * client routing, live search/filtering, and interactive modals.
 */

const AppState = {
  currentRoute: 'overview',
  user: {
    name: 'DevOps Admin',
    role: 'HR Ops Specialist',
    email: 'elena.vance@acme-corp.internal',
    avatar: 'DA'
  },
  activeEventCode: 'EVT-2025-0802',
  deploymentState: 'RUNNING',
  targetBenchmarkVisible: true,
  chartView: 'monthly',
  openExceptionsCount: null
};

// Router & State Navigation
function navigateTo(route, params = {}) {
  if (params.eventCode) {
    AppState.activeEventCode = params.eventCode;
  }
  AppState.currentRoute = route;
  window.location.hash = `#/${route}${params.eventCode ? `/${params.eventCode}` : ''}`;
  render();
}

function handleHashChange() {
  const hash = window.location.hash.replace('#/', '');
  if (!hash || hash === '') {
    navigateTo('overview');
    return;
  }
  const parts = hash.split('/');
  const route = parts[0];
  const param = parts[1];

  AppState.currentRoute = route;
  if (param) AppState.activeEventCode = param;
  render();
}

window.addEventListener('hashchange', handleHashChange);
window.addEventListener('DOMContentLoaded', () => {
  if (!window.location.hash) {
    window.location.hash = '#/overview';
  } else {
    handleHashChange();
  }
});

// Toast Manager
function showToast(title, message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toastId = 'toast-' + Date.now();
  const isSuccess = type === 'success';
  const icon = isSuccess ? 'task_alt' : 'error';
  const iconColor = isSuccess ? 'text-primary' : 'text-error';
  const iconBg = isSuccess ? 'bg-primary-fixed/50' : 'bg-error-container';
  const borderColor = isSuccess ? 'border-primary/20' : 'border-error/30';

  const toastHtml = `
    <div id="${toastId}" class="pointer-events-auto flex items-start gap-space-md bg-surface-container-lowest p-space-md rounded-xl shadow-xl border ${borderColor} transition-all duration-300 max-w-md">
      <div class="w-8 h-8 rounded-full ${iconBg} flex items-center justify-center shrink-0 ${iconColor}">
        <span class="material-symbols-outlined text-[18px]">${icon}</span>
      </div>
      <div class="flex flex-col flex-1 min-w-0 pr-space-xs">
        <div class="flex items-center justify-between">
          <span class="font-headline-sm text-body-md text-on-surface font-semibold">${title}</span>
          <span class="font-label-sm text-label-sm text-outline">Just now</span>
        </div>
        <p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">${message}</p>
      </div>
      <button onclick="dismissToast('${toastId}')" class="text-outline hover:text-on-surface p-1 rounded transition-colors" type="button">
        <span class="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', toastHtml);
  setTimeout(() => dismissToast(toastId), 4500);
}

function dismissToast(toastId) {
  const toast = document.getElementById(toastId);
  if (toast) {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 250);
  }
}

// Main Render Function
async function render() {
  if (AppState.openExceptionsCount === null) {
    try {
      const s = await API.getAlertSummary();
      AppState.openExceptionsCount = s.openExceptions;
    } catch (e) {}
  }
  const app = document.getElementById('app');
  if (!app) return;

  // Route 1: Login Screen (No App Shell)
  if (AppState.currentRoute === 'login') {
    app.innerHTML = renderLoginScreen();
    bindLoginEvents();
    return;
  }

  // Authenticated Pages with App Shell
  app.innerHTML = `
    <div class="min-h-screen flex flex-col bg-background font-body text-on-surface">
      ${renderSidebar()}
      ${renderHeader()}
      <main class="pl-60 pt-16 min-h-screen">
        <div id="page-content" class="w-full">
          <div class="p-8 flex items-center justify-center text-outline">
            <span class="material-symbols-outlined animate-spin mr-2">sync</span> Loading view...
          </div>
        </div>
      </main>
    </div>
  `;

  // Populate dynamic page content
  const pageContainer = document.getElementById('page-content');
  switch (AppState.currentRoute) {
    case 'overview':
      pageContainer.innerHTML = await renderOverviewScreen();
      break;
    case 'events':
      pageContainer.innerHTML = await renderEventsScreen();
      bindEventsFilterEvents();
      break;
    case 'create-event':
      pageContainer.innerHTML = renderCreateEventScreen();
      bindCreateEventForm();
      break;
    case 'event-detail':
      pageContainer.innerHTML = await renderEventDetailScreen(AppState.activeEventCode);
      bindEventDetailEvents();
      break;
    case 'alerts':
      pageContainer.innerHTML = await renderAlertsScreen();
      bindAlertsEvents();
      break;
    case 'reports':
      pageContainer.innerHTML = await renderReportsScreen();
      bindReportsEvents();
      break;
    case 'deployment':
      pageContainer.innerHTML = await renderDeploymentScreen();
      bindDeploymentEvents();
      break;
    default:
      pageContainer.innerHTML = await renderOverviewScreen();
  }
}

// Persistent Sidebar
function renderSidebar() {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'grid_view' },
    { id: 'events', label: 'Wellness Events', icon: 'event_available' },
    { id: 'reports', label: 'Reports', icon: 'assessment' },
    { id: 'alerts', label: 'Alerts & Exceptions', icon: 'notifications_active', badge: (AppState.openExceptionsCount > 0 ? String(AppState.openExceptionsCount) : null) },
    { id: 'deployment', label: 'Deployment Status', icon: 'deployed_code' }
  ];

  return `
    <aside class="fixed left-0 top-0 h-screen w-60 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between select-none">
      <div class="flex flex-col">
        <!-- Brand Header -->
        <div class="h-16 px-space-lg flex items-center justify-between">
          <div class="flex items-center gap-space-sm cursor-pointer" onclick="navigateTo('overview')">
            <div class="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-xs">
              <span class="material-symbols-outlined text-[18px]">spa</span>
            </div>
            <span class="text-headline-sm font-semibold tracking-tight text-on-surface">Wellness Hub</span>
          </div>
        </div>

        <!-- Release Info Tag -->
        <div class="px-space-lg pb-space-sm">
          <div class="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span>v2.414 LTS / Production Pipeline <span class="text-[10px] text-tertiary font-mono">(Demo data)</span></span>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex flex-col gap-1 px-space-md mt-space-sm">
          ${navItems.map(item => {
            const isActive = AppState.currentRoute === item.id || 
              (item.id === 'events' && (AppState.currentRoute === 'create-event' || AppState.currentRoute === 'event-detail'));
            const activeClasses = isActive
              ? 'bg-primary-container text-on-primary-container font-medium shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface';
            
            return `
              <a href="#/${item.id}" onclick="event.preventDefault(); navigateTo('${item.id}')"
                 class="flex items-center justify-between px-space-md py-space-sm rounded-lg text-body-md transition-colors ${activeClasses}">
                <div class="flex items-center gap-space-sm">
                  <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
                  <span>${item.label}</span>
                </div>
                ${item.badge ? `<span class="px-1.5 py-0.5 rounded-full bg-error-container text-on-error-container text-[11px] font-semibold">${item.badge}</span>` : ''}
              </a>
            `;
          }).join('')}
        </nav>
      </div>

      <!-- Footer & CI/CD Active Indicator -->
      <div class="p-space-lg flex flex-col gap-space-md border-t border-surface-container/60">
        <div class="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-1 cursor-pointer hover:bg-surface-container transition-colors" onclick="navigateTo('deployment')">
          <div class="flex items-center gap-space-xs text-primary text-[12px]">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span class="font-semibold">Jenkins CI/CD Active <span class="text-[10px] text-tertiary font-mono">(Demo data)</span></span>
          </div>
          <div class="text-[11px] text-on-surface-variant">Build #142 Healthy • Telemetry <span class="text-[10px] text-tertiary font-mono">[Demo data]</span></div>
        </div>

        <div class="flex items-center justify-between px-space-xs text-[12px]">
          <a href="#/deployment" onclick="event.preventDefault(); navigateTo('deployment')" class="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">menu_book</span>
            <span>Docs</span>
          </a>
          <a href="#/login" onclick="event.preventDefault(); navigateTo('login')" class="text-on-surface-variant hover:text-error transition-colors flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">logout</span>
            <span>Log out</span>
          </a>
        </div>
      </div>
    </aside>
  `;
}

// Persistent Top Header
function renderHeader() {
  return `
    <header class="fixed top-0 left-60 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 px-space-xl flex items-center justify-between">
      <div class="flex items-center gap-space-md">
        <span class="font-semibold text-on-surface text-[15px]">Corporate Wellness Dashboard</span>
      </div>

      <!-- Center Search -->
      <div class="flex-1 max-w-lg mx-space-xl">
        <div class="relative flex items-center w-full">
          <span class="material-symbols-outlined absolute left-3 text-[18px] text-outline">search</span>
          <input type="text"
                 placeholder="Search events, departments, or programs (Ctrl+K)..."
                 onkeyup="if(event.key === 'Enter') { navigateTo('events'); }"
                 class="w-full h-9 pl-9 pr-4 rounded-lg bg-surface-container-low text-on-surface text-body-sm placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest transition-colors"/>
        </div>
      </div>

      <!-- Right Action Cluster -->
      <div class="flex items-center gap-space-lg">
        <button type="button" onclick="window.location.href='/api/reports/export/csv'" class="h-9 px-space-md rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-label-md flex items-center gap-space-xs transition-colors">
          <span class="material-symbols-outlined text-[18px] text-on-surface-variant">ios_share</span>
          <span>Export CSV</span>
        </button>

        <button type="button" onclick="navigateTo('alerts')" class="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors" title="Alerts & Exceptions">
          <span class="material-symbols-outlined text-[20px]">notifications</span>
          <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
        </button>

        <!-- User Profile Pill -->
        <div class="flex items-center gap-space-md pl-space-sm border-l border-surface-container">
          <div class="flex flex-col text-right">
            <span class="text-label-md font-semibold text-on-surface leading-tight">DevOps Admin</span>
            <span class="text-[11px] text-on-surface-variant leading-tight">HR Ops Specialist</span>
          </div>
          <div class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-semibold text-[13px]">
            <span>EV</span>
          </div>
        </div>
      </div>
    </header>
  `;
}

// =============================================================================
// SCREEN 1: LOGIN (Wellness Hub Login)
// =============================================================================
function renderLoginScreen() {
  return `
    <div class="flex flex-col w-full min-h-screen items-center justify-between px-margin py-space-xl md:py-space-2xl selection:bg-primary-fixed selection:text-on-primary-fixed bg-background">
      <!-- Interactive Demo State Switcher Pill Menu -->
      <header class="w-full max-w-xl mx-auto flex flex-col items-center mb-space-lg">
        <div class="inline-flex items-center gap-space-xs bg-surface-container-high/60 backdrop-blur-sm p-1 rounded-full shadow-sm text-label-sm font-label-sm">
          <span class="text-on-surface-variant px-space-sm font-semibold tracking-wider uppercase text-[10px] hidden sm:inline">Demo State:</span>
          <button id="btn-state-default" onclick="setLoginDemoState('default')" type="button"
                  class="px-space-md py-1 rounded-full transition-all text-on-surface font-medium bg-surface-container-lowest shadow-sm">
            Default
          </button>
          <button id="btn-state-validation-error" onclick="setLoginDemoState('validation-error')" type="button"
                  class="px-space-md py-1 rounded-full transition-all text-secondary hover:text-on-surface font-medium">
            Validation Error
          </button>
          <button id="btn-state-invalid-credentials" onclick="setLoginDemoState('invalid-credentials')" type="button"
                  class="px-space-md py-1 rounded-full transition-all text-secondary hover:text-on-surface font-medium">
            Invalid Auth
          </button>
          <button id="btn-state-loading" onclick="setLoginDemoState('loading')" type="button"
                  class="px-space-md py-1 rounded-full transition-all text-secondary hover:text-on-surface font-medium">
            Loading
          </button>
          <button id="btn-state-success" onclick="setLoginDemoState('success')" type="button"
                  class="px-space-md py-1 rounded-full transition-all text-secondary hover:text-on-surface font-medium">
            Success
          </button>
        </div>
      </header>

      <!-- Main Centered Authentication Panel -->
      <main class="w-full max-w-md mx-auto my-auto flex flex-col items-center">
        <div class="w-full bg-surface-container-lowest rounded-xl shadow-md p-space-xl sm:p-space-2xl border border-surface-container-high/40">
          <!-- Logo Emblem -->
          <div class="flex flex-col items-center text-center">
            <div class="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm mb-space-md relative">
              <span class="material-symbols-outlined text-[32px]">spa</span>
              <div class="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-25 pointer-events-none"></div>
            </div>
            <div class="inline-flex items-center gap-space-xs mb-space-xs">
              <span class="text-headline-sm font-semibold tracking-tight text-on-surface">Wellness Hub</span>
              <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-surface-container text-secondary">v2.414 LTS</span>
            </div>
            <h1 class="text-headline-lg font-semibold tracking-tight text-on-surface mb-space-xs">Welcome back</h1>
            <p class="text-body-md text-secondary">Sign in to manage corporate wellness programs.</p>
          </div>

          <!-- Dynamic Alerts -->
          <div id="login-alerts" class="mt-space-lg w-full space-y-2">
            <div id="alert-invalid" class="hidden flex items-start gap-space-md p-space-md rounded-lg bg-error-container/60 text-on-error-container">
              <span class="material-symbols-outlined text-[20px] text-error shrink-0 mt-0.5">error</span>
              <div class="flex-1 text-body-sm">
                <p class="font-semibold text-error mb-0.5">Authentication failed</p>
                <p class="text-on-surface-variant">Invalid work email or password. Please verify credentials.</p>
              </div>
            </div>
            <div id="alert-success" class="hidden flex items-start gap-space-md p-space-md rounded-lg bg-primary-fixed/40 text-on-primary-fixed-variant">
              <span class="material-symbols-outlined text-[20px] text-primary shrink-0 mt-0.5">check_circle</span>
              <div class="flex-1 text-body-sm">
                <p class="font-semibold text-primary mb-0.5">Authentication verified</p>
                <p class="text-on-surface">Redirecting to Corporate Wellness Executive Overview...</p>
              </div>
            </div>
          </div>

          <!-- Login Form -->
          <form id="login-form" class="mt-space-lg space-y-space-lg" onsubmit="handleLoginSubmit(event)">
            <div class="space-y-1">
              <label class="block text-label-md font-medium text-on-surface" for="email">
                Work Email <span class="text-error">*</span>
              </label>
              <div class="relative flex items-center">
                <span class="material-symbols-outlined absolute left-3 text-[18px] text-secondary">mail</span>
                <input id="email" type="email" value="elena.vance@acme-corp.internal" required
                       class="w-full h-10 pl-10 pr-3 rounded-lg bg-surface text-on-surface text-body-md border border-outline-variant/50 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-all"/>
              </div>
              <p id="email-error" class="hidden text-label-sm text-error flex items-center gap-1 mt-1">
                <span class="material-symbols-outlined text-[14px]">error</span>
                <span>Work email is required</span>
              </p>
            </div>

            <div class="space-y-1">
              <div class="flex items-center justify-between">
                <label class="block text-label-md font-medium text-on-surface" for="password">
                  Password <span class="text-error">*</span>
                </label>
                <a href="javascript:void(0)" class="text-label-md text-primary hover:underline">Forgot password?</a>
              </div>
              <div class="relative flex items-center">
                <span class="material-symbols-outlined absolute left-3 text-[18px] text-secondary">lock</span>
                <input id="password" type="password" value="password123" required
                       class="w-full h-10 pl-10 pr-10 rounded-lg bg-surface text-on-surface text-body-md border border-outline-variant/50 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none transition-all"/>
                <button type="button" onclick="togglePasswordVisibility()" class="absolute right-3 text-secondary hover:text-on-surface">
                  <span id="pw-eye" class="material-symbols-outlined text-[18px]">visibility</span>
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked class="w-4 h-4 accent-primary rounded"/>
                <span class="text-body-sm text-secondary">Remember this workstation</span>
              </label>
            </div>

            <button id="login-submit-btn" type="submit"
                    class="w-full h-10 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-medium text-label-md shadow-sm transition-all flex items-center justify-center gap-2">
              <span id="login-spinner" class="hidden material-symbols-outlined text-[18px] animate-spin">sync</span>
              <span id="login-btn-text">Sign in to Wellness Hub</span>
            </button>

            <button type="button" onclick="navigateTo('overview')"
                    class="w-full h-10 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-medium text-label-md transition-all flex items-center justify-center gap-2 border border-outline-variant/40">
              <span class="material-symbols-outlined text-[18px] text-secondary">domain</span>
              <span>Sign in with ACME SSO (Direct)</span>
            </button>
          </form>
        </div>
      </main>

      <footer class="text-center py-4 text-[12px] text-secondary">
        <span>© 2025 ACME Corporation • Clinical Clarity & Executive Vitality</span>
      </footer>
    </div>
  `;
}

function bindLoginEvents() {}

function togglePasswordVisibility() {
  const pw = document.getElementById('password');
  const eye = document.getElementById('pw-eye');
  if (pw.type === 'password') {
    pw.type = 'text';
    eye.textContent = 'visibility_off';
  } else {
    pw.type = 'password';
    eye.textContent = 'visibility';
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  setLoginDemoState('loading');
  const res = await API.login(email, password);

  if (res.ok) {
    setLoginDemoState('success');
    setTimeout(() => {
      navigateTo('overview');
      showToast('Welcome back, Elena', 'Logged into Corporate Wellness Dashboard (Build #142)', 'success');
    }, 800);
  } else {
    setLoginDemoState('invalid-credentials');
  }
}

function setLoginDemoState(state) {
  const btnDefault = document.getElementById('btn-state-default');
  const btnVal = document.getElementById('btn-state-validation-error');
  const btnAuth = document.getElementById('btn-state-invalid-credentials');
  const btnLoad = document.getElementById('btn-state-loading');
  const btnSucc = document.getElementById('btn-state-success');

  const alertInv = document.getElementById('alert-invalid');
  const alertSuc = document.getElementById('alert-success');
  const emailError = document.getElementById('email-error');
  const spinner = document.getElementById('login-spinner');
  const btnText = document.getElementById('login-btn-text');

  if (!btnDefault) return;

  // Reset pills
  [btnDefault, btnVal, btnAuth, btnLoad, btnSucc].forEach(b => {
    b.className = 'px-space-md py-1 rounded-full transition-all text-secondary hover:text-on-surface font-medium';
  });
  alertInv.classList.add('hidden');
  alertSuc.classList.add('hidden');
  emailError.classList.add('hidden');
  spinner.classList.add('hidden');
  btnText.textContent = 'Sign in to Wellness Hub';

  if (state === 'default') {
    btnDefault.className = 'px-space-md py-1 rounded-full transition-all text-on-surface font-medium bg-surface-container-lowest shadow-sm';
  } else if (state === 'validation-error') {
    btnVal.className = 'px-space-md py-1 rounded-full transition-all text-on-surface font-medium bg-surface-container-lowest shadow-sm';
    emailError.classList.remove('hidden');
  } else if (state === 'invalid-credentials') {
    btnAuth.className = 'px-space-md py-1 rounded-full transition-all text-on-surface font-medium bg-surface-container-lowest shadow-sm';
    alertInv.classList.remove('hidden');
  } else if (state === 'loading') {
    btnLoad.className = 'px-space-md py-1 rounded-full transition-all text-on-surface font-medium bg-surface-container-lowest shadow-sm';
    spinner.classList.remove('hidden');
    btnText.textContent = 'Authenticating credentials...';
  } else if (state === 'success') {
    btnSucc.className = 'px-space-md py-1 rounded-full transition-all text-on-surface font-medium bg-surface-container-lowest shadow-sm';
    alertSuc.classList.remove('hidden');
  }
}

// =============================================================================
// SCREEN 2: OVERVIEW DASHBOARD
// =============================================================================
async function renderOverviewScreen() {
  const summary = await API.getSummary();

  return `
    <div class="max-w-[1560px] mx-auto w-full px-space-xl py-space-xl flex flex-col gap-space-xl">
      <!-- Top Title & CI/CD Status Bar -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-lg pb-space-sm border-b border-surface-container-high/60">
        <div class="flex flex-col gap-1.5">
          <div class="flex items-center gap-space-sm flex-wrap">
            <h1 class="text-headline-lg text-on-surface font-semibold tracking-tight">Wellness Overview</h1>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high/70 text-on-surface-variant text-[11px]">
              <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span class="font-medium">CI/CD: Jenkins Build #142 <span class="text-[10px] text-tertiary font-mono px-1 py-0.5 rounded bg-surface-container">(Demo data)</span></span>
              <span class="text-outline-variant">•</span>
              <span class="text-primary font-semibold">Passed</span>
              <span class="text-outline-variant">•</span>
              <span>Env: Prod</span>
            </div>
          </div>
          <p class="text-body-md text-on-surface-variant">Monitor employee wellness activities and program performance across enterprise teams.</p>
        </div>

        <!-- Action Cluster -->
        <div class="flex items-center gap-space-sm flex-wrap">
          <button type="button" class="h-9 px-3 rounded-lg bg-surface-container-lowest text-on-surface text-body-sm shadow-sm hover:bg-surface-container-low transition-colors flex items-center gap-2">
            <span class="material-symbols-outlined text-[17px] text-outline">calendar_today</span>
            <span>Last 30 Days: Jan 1 - Jan 31</span>
          </button>
          <button type="button" onclick="window.location.href='/api/reports/export/csv'" class="h-9 px-3.5 rounded-lg bg-surface-container-lowest text-on-surface text-label-md shadow-sm hover:bg-surface-container-low transition-colors flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[17px] text-on-surface-variant">download</span>
            <span>Export Report</span>
          </button>
          <button type="button" onclick="navigateTo('create-event')" class="h-9 px-4 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-label-md shadow-sm transition-all flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px]">add</span>
            <span>Schedule Event</span>
          </button>
        </div>
      </div>

      <!-- 4 Compact KPI Stat Tiles -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
        <!-- KPI 1 -->
        <div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between">
            <div class="flex flex-col">
              <span class="text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">Total Events</span>
              <span class="text-[36px] font-bold text-on-surface mt-1 leading-none">${summary.totalEvents || 24}</span>
            </div>
            <div class="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
              <span class="material-symbols-outlined text-[22px]">event_available</span>
            </div>
          </div>
          <div class="flex items-center justify-between pt-3 mt-2 border-t border-surface-container">
            <span class="text-body-sm text-on-surface-variant">+4 from last month</span>
            <span class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-primary-fixed/30 text-on-primary-fixed-variant text-[11px] font-semibold">
              <span class="material-symbols-outlined text-[14px]">trending_up</span> 16.7%
            </span>
          </div>
        </div>

        <!-- KPI 2 -->
        <div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between">
            <div class="flex flex-col">
              <span class="text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">Active Programs</span>
              <span class="text-[36px] font-bold text-on-surface mt-1 leading-none">${summary.activePrograms || summary.activeEvents || 0}</span>
            </div>
            <div class="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
              <span class="material-symbols-outlined text-[22px]">fitness_center</span>
            </div>
          </div>
          <div class="flex items-center justify-between pt-3 mt-2 border-t border-surface-container">
            <span class="text-body-sm text-on-surface-variant">Across 6 regional hubs</span>
            <span class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[11px] font-semibold">
              +2 new
            </span>
          </div>
        </div>

        <!-- KPI 3 -->
        <div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between">
            <div class="flex flex-col">
              <span class="text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">Participation Rate</span>
              <div class="flex items-baseline gap-2 mt-1">
                <span class="text-[36px] font-bold text-on-surface leading-none">${summary.participationRate || 76.4}%</span>
                <span class="text-[11px] text-on-surface-variant">Target 75% met</span>
              </div>
            </div>
            <div class="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
              <span class="material-symbols-outlined text-[22px]">groups</span>
            </div>
          </div>
          <div class="flex flex-col gap-1.5 pt-3 mt-2 border-t border-surface-container">
            <div class="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
              <div class="h-full bg-primary rounded-full" style="width: ${summary.participationRate || 76.4}%"></div>
            </div>
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-on-surface-variant">1,420 Active Staff</span>
              <span class="text-primary font-semibold flex items-center gap-0.5">
                <span class="material-symbols-outlined text-[13px]">arrow_upward</span> +5.2% vs Q3
              </span>
            </div>
          </div>
        </div>

        <!-- KPI 4 -->
        <div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between">
            <div class="flex flex-col">
              <span class="text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">Open Exceptions</span>
              <span class="text-[36px] font-bold text-tertiary mt-1 leading-none">${summary.openExceptions || 3}</span>
            </div>
            <div class="w-10 h-10 rounded-lg bg-tertiary-fixed/40 flex items-center justify-center text-tertiary">
              <span class="material-symbols-outlined text-[22px]">warning_amber</span>
            </div>
          </div>
          <div class="flex items-center justify-between pt-3 mt-2 border-t border-surface-container">
            <span class="text-body-sm text-on-surface-variant">2 overdue, 1 low enrolled</span>
            <a href="#/alerts" onclick="event.preventDefault(); navigateTo('alerts')" class="text-label-sm text-tertiary hover:underline font-semibold flex items-center gap-0.5">
              Review <span class="material-symbols-outlined text-[13px]">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Main Two-Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
        <!-- Left / Wide Column (8 cols) -->
        <div class="lg:col-span-8 flex flex-col gap-space-xl">
          <!-- Participation Trends Chart -->
          <div class="bg-surface-container-lowest rounded-xl shadow-sm p-space-xl flex flex-col">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-md border-b border-surface-container">
              <div>
                <h2 class="text-headline-sm text-on-surface font-semibold">Participation Trends</h2>
                <p class="text-body-sm text-on-surface-variant">Past 6 months enterprise engagement benchmarked to target</p>
              </div>
              <div class="flex items-center bg-surface-container-low p-1 rounded-lg">
                <button class="px-3 py-1 rounded text-on-surface text-label-md bg-surface-container-lowest shadow-sm font-semibold">Monthly Overview</button>
                <button onclick="navigateTo('reports')" class="px-3 py-1 rounded text-on-surface-variant text-label-md hover:text-on-surface transition-colors">By Department</button>
              </div>
            </div>

            <div class="flex items-center justify-between pt-space-md text-body-sm">
              <div class="flex items-center gap-space-md">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-sm bg-primary"></span>
                  <span class="text-body-sm text-on-surface font-medium">Actual Participation</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-3 h-0.5 bg-outline border border-dashed border-outline"></span>
                  <span class="text-body-sm text-on-surface-variant">Enterprise Target (75%)</span>
                </div>
              </div>
              <span class="text-[12px] text-on-surface-variant">Avg: 73.5%</span>
            </div>

            <!-- SVG Spline Trend Visualizer -->
            <div class="relative w-full h-64 mt-4 select-none">
              <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 680 220">
                <defs>
                  <linearGradient id="trendGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stop-color="#15684d" stop-opacity="0.22"/>
                    <stop offset="100%" stop-color="#15684d" stop-opacity="0.0"/>
                  </linearGradient>
                </defs>
                <!-- Horizontal Guide Lines -->
                <line x1="40" y1="30" x2="660" y2="30" stroke="#dde3ee" stroke-dasharray="3 3"/>
                <line x1="40" y1="80" x2="660" y2="80" stroke="#dde3ee" stroke-dasharray="3 3"/>
                <line x1="40" y1="130" x2="660" y2="130" stroke="#dde3ee" stroke-dasharray="3 3"/>
                <line x1="40" y1="180" x2="660" y2="180" stroke="#dde3ee"/>

                <text x="32" y="34" fill="#6f7973" font-size="10" text-anchor="end">90%</text>
                <text x="32" y="84" fill="#6f7973" font-size="10" text-anchor="end">75%</text>
                <text x="32" y="134" fill="#6f7973" font-size="10" text-anchor="end">60%</text>
                <text x="32" y="184" fill="#6f7973" font-size="10" text-anchor="end">45%</text>

                <!-- 75% Target Line -->
                <line x1="40" y1="80" x2="660" y2="80" stroke="#505f76" stroke-dasharray="4 4" stroke-width="1.5" opacity="0.6"/>

                <!-- Area Fill -->
                <path d="M 60 148 Q 170 120, 280 115 T 480 88 T 640 76 L 640 180 L 60 180 Z" fill="url(#trendGradient)"/>
                <!-- Curve -->
                <path d="M 60 148 Q 170 120, 280 115 T 480 88 T 640 76" fill="none" stroke="#15684d" stroke-width="3" stroke-linecap="round"/>

                <!-- Nodes -->
                <circle cx="60" cy="148" r="4" fill="#fff" stroke="#15684d" stroke-width="2.5"/>
                <circle cx="176" cy="128" r="4" fill="#fff" stroke="#15684d" stroke-width="2.5"/>
                <circle cx="292" cy="115" r="4" fill="#fff" stroke="#15684d" stroke-width="2.5"/>
                <circle cx="408" cy="102" r="4" fill="#fff" stroke="#15684d" stroke-width="2.5"/>
                <circle cx="524" cy="88" r="4" fill="#fff" stroke="#15684d" stroke-width="2.5"/>
                <circle cx="640" cy="76" r="6" fill="#15684d" stroke="#ffffff" stroke-width="3"/>

                <!-- Tooltip Callout -->
                <g transform="translate(560, 22)">
                  <rect width="105" height="42" rx="6" fill="#161c24" opacity="0.92"/>
                  <text x="52" y="17" fill="#f8f9ff" font-size="11" font-weight="600" text-anchor="middle">Jan: 76.4% Met</text>
                  <text x="52" y="32" fill="#bec9c2" font-size="9.5" text-anchor="middle">1,420 Enrolled</text>
                </g>

                <!-- Month Labels -->
                <text x="60" y="202" fill="#3f4944" font-size="11" text-anchor="middle">Aug '24</text>
                <text x="176" y="202" fill="#3f4944" font-size="11" text-anchor="middle">Sep '24</text>
                <text x="292" y="202" fill="#3f4944" font-size="11" text-anchor="middle">Oct '24</text>
                <text x="408" y="202" fill="#3f4944" font-size="11" text-anchor="middle">Nov '24</text>
                <text x="524" y="202" fill="#3f4944" font-size="11" text-anchor="middle">Dec '24</text>
                <text x="640" y="202" fill="#15684d" font-size="11" font-weight="600" text-anchor="middle">Jan '25</text>
              </svg>
            </div>

            <div class="mt-4 pt-3 border-t border-surface-container flex flex-wrap items-center justify-between text-body-sm gap-2">
              <div class="flex items-center gap-2 text-on-surface-variant">
                <span class="material-symbols-outlined text-[18px] text-primary">insights</span>
                <span><strong>Highest engagement:</strong> Engineering (88%)</span>
                <span>•</span>
                <span><strong>Most improved:</strong> Sales (+14% QoQ)</span>
              </div>
              <a href="#/reports" onclick="event.preventDefault(); navigateTo('reports')" class="text-label-md text-primary font-semibold hover:underline flex items-center gap-0.5">
                <span>View Cohort Breakdown</span>
                <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </div>
          </div>

          <!-- Recent Wellness Events Table -->
          <div class="bg-surface-container-lowest rounded-xl shadow-sm flex flex-col overflow-hidden">
            <div class="p-space-lg flex items-center justify-between border-b border-surface-container">
              <div>
                <h3 class="text-headline-sm text-on-surface font-semibold">Recent Wellness Events</h3>
                <p class="text-body-sm text-on-surface-variant">Active calendar deployments and session attendance logs</p>
              </div>
              <a href="#/events" onclick="event.preventDefault(); navigateTo('events')" class="text-label-md text-primary font-semibold hover:underline">View All (${summary.totalEvents || 24})</a>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-surface-container-low/70 text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold">
                    <th class="py-3 px-space-lg">Event Name & Venue</th>
                    <th class="py-3 px-space-md">Date</th>
                    <th class="py-3 px-space-md">Department</th>
                    <th class="py-3 px-space-md">Enrolled / Cap</th>
                    <th class="py-3 px-space-md">Status</th>
                    <th class="py-3 px-space-md text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-surface-container text-body-sm">
                  ${(summary.recentEvents || []).map(event => `
                    <tr class="hover:bg-surface-container-low/50 transition-colors cursor-pointer" onclick="navigateTo('event-detail', { eventCode: '${event.eventCode}' })">
                      <td class="py-3.5 px-space-lg">
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                            <span class="material-symbols-outlined text-[18px]">spa</span>
                          </div>
                          <div class="flex flex-col">
                            <span class="font-medium text-on-surface hover:text-primary transition-colors">${event.title}</span>
                            <span class="text-[12px] text-on-surface-variant">${event.venue}</span>
                          </div>
                        </div>
                      </td>
                      <td class="py-3.5 px-space-md text-on-surface-variant whitespace-nowrap">${event.eventDate}</td>
                      <td class="py-3.5 px-space-md">
                        <span class="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px]">${event.department}</span>
                      </td>
                      <td class="py-3.5 px-space-md">
                        <div class="flex flex-col gap-1 w-32">
                          <div class="flex justify-between text-[11px]">
                            <span class="font-medium text-on-surface">${event.enrolled} / ${event.capacity}</span>
                            <span class="text-primary font-semibold">${event.enrollmentPercentage}%</span>
                          </div>
                          <div class="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
                            <div class="h-full bg-primary rounded-full" style="width: ${event.enrollmentPercentage}%"></div>
                          </div>
                        </div>
                      </td>
                      <td class="py-3.5 px-space-md whitespace-nowrap">
                        ${renderStatusBadge(event.status)}
                      </td>
                      <td class="py-3.5 px-space-md text-right whitespace-nowrap" onclick="event.stopPropagation()">
                        <button onclick="navigateTo('event-detail', { eventCode: '${event.eventCode}' })" class="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface" title="View details">
                          <span class="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Right Column (4 cols) -->
        <div class="lg:col-span-4 flex flex-col gap-space-xl">
          <!-- Actionable Alerts Column -->
          <div class="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
            <div class="flex items-center justify-between pb-space-sm border-b border-surface-container">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px] text-tertiary">error</span>
                <h3 class="text-headline-sm text-on-surface font-semibold">Alerts & Exceptions</h3>
              </div>
              <span class="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-semibold">3 Actionable</span>
            </div>

            <div class="flex flex-col divide-y divide-surface-container">
              <!-- Alert 1 -->
              <div class="py-3 flex flex-col gap-1.5">
                <div class="flex items-start justify-between gap-2">
                  <span class="font-medium text-body-sm text-on-surface">Health Risk Assessment Overdue</span>
                  <span class="px-1.5 py-0.2 rounded bg-error-container text-on-error-container text-[10px] font-semibold">Overdue (4d)</span>
                </div>
                <p class="text-[12px] text-on-surface-variant">Operations Dept has 48 pending mandatory survey filings.</p>
                <div class="flex items-center justify-between pt-1">
                  <span class="text-[11px] text-outline">Lead: Sarah Lin (HR)</span>
                  <button onclick="showToast('Reminder Dispatched', 'Automated reminder sent to Operations Dept', 'success')" class="px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container text-primary text-[11px] font-semibold transition-colors flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">send</span> Send Reminder
                  </button>
                </div>
              </div>

              <!-- Alert 2 -->
              <div class="py-3 flex flex-col gap-1.5">
                <div class="flex items-start justify-between gap-2">
                  <span class="font-medium text-body-sm text-on-surface">Desk Yoga & Posture Clinic</span>
                  <span class="px-1.5 py-0.2 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-semibold">Low Attendance</span>
                </div>
                <p class="text-[12px] text-on-surface-variant">Sales & Marketing at 18% registered (threshold is 40%).</p>
                <div class="flex items-center justify-between pt-1">
                  <span class="text-[11px] text-outline">Session in 3 days</span>
                  <button onclick="showToast('Event Promoted', 'Broadcasted invite to Sales & Marketing Slack channel', 'success')" class="px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container text-primary text-[11px] font-semibold transition-colors flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">campaign</span> Promote Event
                  </button>
                </div>
              </div>

              <!-- Alert 3 -->
              <div class="py-3 flex flex-col gap-1.5">
                <div class="flex items-start justify-between gap-2">
                  <span class="font-medium text-body-sm text-on-surface">Flu Vaccination Clinic Delay</span>
                  <span class="px-1.5 py-0.2 rounded bg-secondary-container text-on-secondary-container text-[10px] font-semibold">Supply Delay</span>
                </div>
                <p class="text-[12px] text-on-surface-variant">Chicago Regional Office vendor reported cold chain shipment holdup.</p>
                <div class="flex items-center justify-between pt-1">
                  <span class="text-[11px] text-outline">Hub: Chicago IL</span>
                  <button onclick="navigateTo('alerts')" class="px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface text-[11px] font-semibold transition-colors flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">sync_alt</span> Reassign
                  </button>
                </div>
              </div>
            </div>

            <div class="pt-2 text-center border-t border-surface-container">
              <a href="#/alerts" onclick="event.preventDefault(); navigateTo('alerts')" class="text-label-md text-primary font-semibold hover:underline inline-flex items-center gap-1">
                <span>View All 8 Exceptions</span>
                <span class="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              </a>
            </div>
          </div>

          <!-- Program Status Summary -->
          <div class="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
            <div class="flex flex-col gap-0.5 pb-space-sm border-b border-surface-container">
              <h3 class="text-headline-sm text-on-surface font-semibold">Program Status Summary</h3>
              <p class="text-body-sm text-on-surface-variant">Active corporate wellness initiatives portfolio</p>
            </div>

            <div class="flex flex-col gap-2">
              <div class="w-full h-3 bg-surface-container-high rounded-full overflow-hidden flex">
                <div class="h-full bg-primary" style="width: 62.5%" title="Active: 5"></div>
                <div class="h-full bg-secondary" style="width: 25%" title="Completed: 2"></div>
                <div class="h-full bg-tertiary" style="width: 12.5%" title="At Risk: 1"></div>
              </div>
              <div class="flex flex-col gap-2 mt-2 text-[12px]">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <span>Active Programs</span>
                  </div>
                  <span class="font-semibold text-on-surface">5 (62.5%)</span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    <span>Completed Initiatives</span>
                  </div>
                  <span class="font-semibold text-on-surface">2 (25.0%)</span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                    <span>At Risk / Attention</span>
                  </div>
                  <span class="font-semibold text-tertiary">1 (12.5%)</span>
                </div>
              </div>
            </div>

            <!-- Top Performing Cohorts -->
            <div class="pt-3 border-t border-surface-container flex flex-col gap-2">
              <span class="text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">Top Performing Cohorts</span>
              <div class="flex flex-col gap-2 text-[12px]">
                <div>
                  <div class="flex justify-between mb-1">
                    <span>1. Engineering & DevOps</span>
                    <span class="font-semibold text-primary">88%</span>
                  </div>
                  <div class="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
                    <div class="h-full bg-primary" style="width: 88%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between mb-1">
                    <span>2. Customer Experience</span>
                    <span class="font-semibold text-primary">81%</span>
                  </div>
                  <div class="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
                    <div class="h-full bg-primary" style="width: 81%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between mb-1">
                    <span>3. Marketing Operations</span>
                    <span class="font-semibold text-secondary">74%</span>
                  </div>
                  <div class="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
                    <div class="h-full bg-secondary" style="width: 74%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick DevOps Data Sync Engine Tile -->
          <div class="bg-surface-container-low rounded-xl p-space-md shadow-sm flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center shadow-xs">
                <span class="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div class="flex flex-col">
                <span class="text-label-md font-semibold text-on-surface">Data Sync Engine</span>
                <span class="text-[11px] text-on-surface-variant">Last polled 4 mins ago</span>
              </div>
            </div>
            <button type="button" onclick="showToast('Data Synced', 'H2 database synchronized with HR Active Directory', 'success')" class="h-7 px-2.5 rounded bg-surface-container-lowest hover:bg-surface-container-high text-on-surface text-[11px] font-medium transition-colors shadow-xs">
              Trigger Sync
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// =============================================================================
// SCREEN 3: WELLNESS EVENTS DIRECTORY
// =============================================================================
async function renderEventsScreen() {
  const events = await API.getEvents();

  return `
    <div class="px-space-xl py-space-xl flex flex-col gap-space-xl max-w-[1520px] mx-auto w-full">
      <!-- Top Action Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-space-lg">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-primary"></span>
            <span class="text-[11px] uppercase tracking-wider text-outline font-semibold">Program Intelligence & Schedules</span>
          </div>
          <h1 class="text-headline-lg font-semibold tracking-tight text-on-surface">Wellness Events</h1>
          <p class="text-body-md text-on-surface-variant">Manage, monitor, and audit corporate wellness activities across worldwide operational clusters.</p>
        </div>
        <div class="flex items-center gap-space-md shrink-0">
          <button type="button" onclick="window.location.href='/api/reports/export/csv'" class="h-9 px-space-md rounded-lg bg-surface-container-lowest text-on-surface text-label-md flex items-center gap-2 shadow-sm hover:bg-surface-container-low transition-all">
            <span class="material-symbols-outlined text-[18px] text-outline">file_download</span>
            <span>Export Events (CSV)</span>
          </button>
          <button type="button" onclick="openCreateEventDrawer()" class="h-9 px-space-lg rounded-lg bg-primary hover:bg-primary-container text-on-primary text-label-md flex items-center gap-2 shadow-sm transition-all">
            <span class="material-symbols-outlined text-[18px]">add</span>
            <span>Add Event</span>
          </button>
        </div>
      </div>

      <!-- KPI Strip -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-space-md">
        <div class="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] text-on-surface-variant uppercase font-semibold">Total Events</span>
            <span class="material-symbols-outlined text-outline text-[20px]">calendar_month</span>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-[32px] font-semibold text-on-surface">${events.length}</span>
            <span class="text-[11px] text-outline">FY25 Q1</span>
          </div>
          <div class="mt-2 text-[11px] text-primary font-semibold flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">trending_up</span> +8% vs prior cycle
          </div>
        </div>

        <div class="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] text-on-surface-variant uppercase font-semibold">Active / Live Now</span>
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-[32px] font-semibold text-on-surface">3</span>
            <span class="text-[11px] text-outline">concurrent</span>
          </div>
          <div class="mt-2 text-[11px] text-on-surface-variant">878 colleagues engaged today</div>
        </div>

        <div class="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] text-on-surface-variant uppercase font-semibold">Scheduled</span>
            <span class="material-symbols-outlined text-secondary text-[20px]">event_upcoming</span>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-[32px] font-semibold text-on-surface">14</span>
            <span class="text-[11px] text-outline">next 30 days</span>
          </div>
          <div class="mt-2 text-[11px] text-secondary font-medium">94% capacity reserve</div>
        </div>

        <div class="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] text-on-surface-variant uppercase font-semibold">At Risk / Review</span>
            <span class="material-symbols-outlined text-tertiary-container text-[20px]">warning</span>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-[32px] font-semibold text-tertiary">2</span>
            <span class="text-[11px] text-tertiary">Action req.</span>
          </div>
          <div class="mt-2 text-[11px] text-tertiary font-medium">Low sign-up threshold</div>
        </div>
      </div>

      <!-- Filter & Search Toolbar -->
      <div class="bg-surface-container-lowest rounded-xl shadow-sm p-space-md md:p-space-lg flex flex-col gap-space-md">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-space-md items-center">
          <div class="md:col-span-5 relative flex items-center">
            <span class="material-symbols-outlined absolute left-3 text-[18px] text-outline">search</span>
            <input id="eventsSearchInput" type="text" placeholder="Search by event name, lead, or keyword..."
                   class="w-full h-9 pl-10 pr-4 rounded-lg bg-surface-container-low text-on-surface text-body-sm placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest transition-all"/>
          </div>

          <div class="md:col-span-3">
            <select id="departmentFilter" class="w-full h-9 px-3 rounded-lg bg-surface-container-low text-on-surface text-body-sm focus:outline-none cursor-pointer">
              <option value="all">All Departments</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Engineering & DevOps">Engineering & DevOps</option>
              <option value="Cust. Operations">Customer Operations</option>
              <option value="Finance & Legal">Finance & Legal</option>
              <option value="Sales & Marketing">Sales & Marketing</option>
              <option value="Enterprise / All">Enterprise / All Hands</option>
            </select>
          </div>

          <div class="md:col-span-4 flex items-center gap-2">
            <select id="statusFilter" class="w-full h-9 px-3 rounded-lg bg-surface-container-low text-on-surface text-body-sm focus:outline-none cursor-pointer">
              <option value="all">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="AT_RISK">At Risk</option>
            </select>
            <button onclick="navigateTo('create-event')" class="h-9 px-3.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-label-md whitespace-nowrap transition-colors">
              + Full Form
            </button>
          </div>
        </div>

        <!-- Quick Filter Pills -->
        <div class="flex items-center gap-2 flex-wrap pt-1 border-t border-surface-container">
          <span class="text-[11px] text-outline font-semibold uppercase tracking-wider">Quick Filter:</span>
          <button onclick="filterByPill('all')" class="event-pill px-3 py-1 rounded-full text-[12px] font-medium bg-primary-container text-on-primary-container font-semibold transition-colors">All (${events.length})</button>
          <button onclick="filterByPill('ACTIVE')" class="event-pill px-3 py-1 rounded-full text-[12px] font-medium bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors">Active</button>
          <button onclick="filterByPill('SCHEDULED')" class="event-pill px-3 py-1 rounded-full text-[12px] font-medium bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors">Scheduled</button>
          <button onclick="filterByPill('COMPLETED')" class="event-pill px-3 py-1 rounded-full text-[12px] font-medium bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors">Completed</button>
          <button onclick="filterByPill('AT_RISK')" class="event-pill px-3 py-1 rounded-full text-[12px] font-medium bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors">At Risk</button>
        </div>
      </div>

      <!-- Events Data Table -->
      <div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-low/70 text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold">
                <th class="py-3 px-space-lg">Event Title & Format</th>
                <th class="py-3 px-space-md">Date & Time</th>
                <th class="py-3 px-space-md">Department</th>
                <th class="py-3 px-space-md">Lead Facilitator</th>
                <th class="py-3 px-space-md">Capacity Meter</th>
                <th class="py-3 px-space-md">Status</th>
                <th class="py-3 px-space-md text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="eventsTableBody" class="divide-y divide-surface-container text-body-sm">
              ${events.map(event => `
                <tr class="hover:bg-surface-container-low/50 transition-colors cursor-pointer event-row"
                    data-title="${event.title.toLowerCase()}"
                    data-department="${event.department}"
                    data-status="${event.status}"
                    onclick="navigateTo('event-detail', { eventCode: '${event.eventCode}' })">
                  <td class="py-3.5 px-space-lg">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                        <span class="material-symbols-outlined text-[18px]">spa</span>
                      </div>
                      <div class="flex flex-col">
                        <span class="font-medium text-on-surface hover:text-primary transition-colors">${event.title}</span>
                        <span class="text-[12px] text-on-surface-variant">${event.format} • ${event.venue}</span>
                      </div>
                    </div>
                  </td>
                  <td class="py-3.5 px-space-md whitespace-nowrap text-on-surface-variant">
                    <div class="flex flex-col">
                      <span class="text-on-surface font-medium">${event.eventDate}</span>
                      <span class="text-[11px] text-outline">${event.timeSlot || '09:00 AM EST'}</span>
                    </div>
                  </td>
                  <td class="py-3.5 px-space-md">
                    <span class="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px]">${event.department}</span>
                  </td>
                  <td class="py-3.5 px-space-md text-on-surface">${event.facilitator}</td>
                  <td class="py-3.5 px-space-md">
                    <div class="flex flex-col gap-1 w-32">
                      <div class="flex justify-between text-[11px]">
                        <span class="font-medium text-on-surface">${event.enrolled} / ${event.capacity}</span>
                        <span class="text-primary font-semibold">${event.enrollmentPercentage}%</span>
                      </div>
                      <div class="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
                        <div class="h-full bg-primary rounded-full" style="width: ${event.enrollmentPercentage}%"></div>
                      </div>
                    </div>
                  </td>
                  <td class="py-3.5 px-space-md whitespace-nowrap">
                    ${renderStatusBadge(event.status)}
                  </td>
                  <td class="py-3.5 px-space-md text-right whitespace-nowrap" onclick="event.stopPropagation()">
                    <button onclick="navigateTo('event-detail', { eventCode: '${event.eventCode}' })" class="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface" title="View details">
                      <span class="material-symbols-outlined text-[18px]">visibility</span>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Slide-over Quick Add Event Drawer -->
    <div id="quickAddDrawer" class="hidden fixed inset-0 z-50 overflow-hidden">
      <div class="absolute inset-0 bg-on-surface/30 backdrop-blur-sm" onclick="closeCreateEventDrawer()"></div>
      <div class="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div class="w-screen max-w-md bg-surface-container-lowest p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-4 border-b border-surface-container">
              <h2 class="text-headline-sm font-semibold text-on-surface">Quick Add Wellness Event</h2>
              <button onclick="closeCreateEventDrawer()" class="text-on-surface-variant hover:text-on-surface">
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form id="quickAddForm" class="mt-4 space-y-4" onsubmit="handleQuickAddSubmit(event)">
              <div>
                <label class="block text-[12px] font-medium text-on-surface mb-1">Event Title *</label>
                <input id="qa-title" type="text" required placeholder="e.g. Ergonomics & Posture Session"
                       class="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant/60 text-body-sm focus:outline-none focus:ring-1 focus:ring-primary"/>
              </div>
              <div>
                <label class="block text-[12px] font-medium text-on-surface mb-1">Department Allocation *</label>
                <select id="qa-dept" class="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant/60 text-body-sm focus:outline-none">
                  <option value="Human Resources">Human Resources</option>
                  <option value="Engineering & DevOps">Engineering & DevOps</option>
                  <option value="Customer Experience">Customer Experience</option>
                  <option value="Finance & Legal">Finance & Legal</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Enterprise / All">Enterprise / All Hands</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[12px] font-medium text-on-surface mb-1">Date *</label>
                  <input id="qa-date" type="date" required value="2025-02-15"
                         class="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant/60 text-body-sm focus:outline-none"/>
                </div>
                <div>
                  <label class="block text-[12px] font-medium text-on-surface mb-1">Capacity *</label>
                  <input id="qa-cap" type="number" value="50" required min="1"
                         class="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant/60 text-body-sm focus:outline-none"/>
                </div>
              </div>
              <div>
                <label class="block text-[12px] font-medium text-on-surface mb-1">Venue / Platform</label>
                <input id="qa-venue" type="text" value="Main Studio & Zoom Bridge"
                       class="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant/60 text-body-sm focus:outline-none"/>
              </div>
              <div>
                <label class="block text-[12px] font-medium text-on-surface mb-1">Facilitator</label>
                <input id="qa-fac" type="text" value="Maya Patel"
                       class="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant/60 text-body-sm focus:outline-none"/>
              </div>
              <div class="pt-4 flex items-center justify-end gap-2 border-t border-surface-container">
                <button type="button" onclick="closeCreateEventDrawer()" class="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-medium">Cancel</button>
                <button type="submit" class="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-[12px] font-medium shadow-sm">Save & Publish</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}

function bindEventsFilterEvents() {
  const searchInput = document.getElementById('eventsSearchInput');
  const deptSelect = document.getElementById('departmentFilter');
  const statusSelect = document.getElementById('statusFilter');

  function applyFilters() {
    const q = (searchInput?.value || '').toLowerCase();
    const dept = deptSelect?.value || 'all';
    const st = statusSelect?.value || 'all';

    document.querySelectorAll('.event-row').forEach(row => {
      const title = row.getAttribute('data-title');
      const rowDept = row.getAttribute('data-department');
      const rowStatus = row.getAttribute('data-status');

      const matchesQ = !q || title.includes(q);
      const matchesDept = dept === 'all' || rowDept.includes(dept);
      const matchesStatus = st === 'all' || rowStatus === st;

      if (matchesQ && matchesDept && matchesStatus) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (deptSelect) deptSelect.addEventListener('change', applyFilters);
  if (statusSelect) statusSelect.addEventListener('change', applyFilters);
}

function filterByPill(statusVal) {
  const statusSelect = document.getElementById('statusFilter');
  if (statusSelect) {
    statusSelect.value = statusVal;
    statusSelect.dispatchEvent(new Event('change'));
  }
}

function openCreateEventDrawer() {
  const drawer = document.getElementById('quickAddDrawer');
  if (drawer) drawer.classList.remove('hidden');
}

function closeCreateEventDrawer() {
  const drawer = document.getElementById('quickAddDrawer');
  if (drawer) drawer.classList.add('hidden');
}

async function handleQuickAddSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('qa-title').value;
  const department = document.getElementById('qa-dept').value;
  const eventDate = document.getElementById('qa-date').value;
  const capacity = parseInt(document.getElementById('qa-cap').value, 10);
  const venue = document.getElementById('qa-venue').value;
  const facilitator = document.getElementById('qa-fac').value;

  const res = await API.createEvent({
    title,
    department,
    eventDate,
    capacity,
    enrolled: 0,
    venue,
    facilitator,
    format: 'Hybrid',
    wellnessCredits: 100,
    status: 'SCHEDULED'
  });

  if (res.ok) {
    closeCreateEventDrawer();
    showToast('Event Created', `Successfully scheduled "${title}"`, 'success');
    navigateTo('events');
  } else {
    showToast('Creation Failed', res.data.message || 'Please check form fields', 'error');
  }
}

// =============================================================================
// SCREEN 4: CREATE WELLNESS EVENT
// =============================================================================
function renderCreateEventScreen() {
  return `
    <div class="px-space-xl pt-space-lg pb-space-md bg-surface-container-lowest shadow-sm border-b border-surface-container-high">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-space-md">
        <div class="flex flex-col gap-1">
          <nav class="flex items-center gap-space-xs text-[12px] text-on-surface-variant">
            <a href="#/events" onclick="event.preventDefault(); navigateTo('events')" class="hover:text-primary transition-colors flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">arrow_back</span>
              <span>Wellness Events</span>
            </a>
            <span class="text-outline">/</span>
            <span class="font-semibold text-on-surface">Create Event</span>
          </nav>
          <div class="flex items-center gap-space-md mt-1">
            <h1 class="text-headline-lg text-on-surface tracking-tight font-semibold">Create Wellness Event</h1>
            <span class="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px]">
              <span class="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span>
              <span>Draft - Ready to Publish</span>
            </span>
          </div>
          <p class="text-body-sm text-on-surface-variant">Configure, schedule, and allocate resources for new enterprise well-being interventions.</p>
        </div>

        <!-- Dev Sandbox Bar -->
        <div class="flex items-center gap-space-xs bg-surface-container-low p-1 rounded-lg border border-surface-container-high">
          <span class="text-[11px] uppercase tracking-wider text-outline px-2">Dev Sandbox:</span>
          <button type="button" onclick="showToast('Event Published', 'Scheduled successfully. Synced with Jenkins pipeline Build #142', 'success')" class="px-2.5 py-1 text-[11px] rounded bg-surface-container-lowest text-on-surface hover:text-primary transition-all shadow-xs flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px] text-primary">check_circle</span> Success Toast
          </button>
          <button type="button" onclick="showToast('Submission Exception', 'Validation error: title must exceed 5 characters', 'error')" class="px-2.5 py-1 text-[11px] rounded bg-surface-container-lowest text-on-surface hover:text-error transition-all shadow-xs flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px] text-error">report</span> Error Toast
          </button>
        </div>
      </div>
    </div>

    <!-- Main Form Canvas -->
    <div class="max-w-7xl mx-auto w-full px-space-xl py-space-xl">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        <!-- Form Column (8 cols) -->
        <div class="lg:col-span-8 flex flex-col gap-space-lg">
          <form id="wellnessEventFullForm" class="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high p-space-xl space-y-space-lg" onsubmit="handleFullFormSubmit(event)">
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="text-label-md font-semibold text-on-surface" for="full-title">Event Title <span class="text-error">*</span></label>
                <span id="full-char-counter" class="text-[11px] text-outline">0 / 80 characters</span>
              </div>
              <input id="full-title" type="text" maxlength="80" required placeholder="e.g. Annual Biometric Screening & Health Fair"
                     oninput="document.getElementById('full-char-counter').textContent = this.value.length + ' / 80 characters'"
                     class="w-full h-10 px-space-md rounded-lg bg-surface-container-lowest border border-outline-variant/60 text-body-md focus:outline-none focus:ring-1 focus:ring-primary"/>
              <p class="text-[12px] text-on-surface-variant mt-1">Provide a descriptive, action-oriented title visible on employee calendars and internal portals.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
              <div>
                <label class="text-label-md font-semibold text-on-surface block mb-1">Department Allocation <span class="text-error">*</span></label>
                <select id="full-dept" class="w-full h-10 px-3 rounded-lg bg-surface border border-outline-variant/60 text-body-md focus:outline-none">
                  <option value="Human Resources">Human Resources</option>
                  <option value="Engineering & DevOps">Engineering & DevOps</option>
                  <option value="Customer Experience">Customer Experience</option>
                  <option value="Finance & Legal">Finance & Legal</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Enterprise / All">Enterprise / All Hands</option>
                </select>
              </div>

              <div>
                <label class="text-label-md font-semibold text-on-surface block mb-1">Initial Status</label>
                <select id="full-status" class="w-full h-10 px-3 rounded-lg bg-surface border border-outline-variant/60 text-body-md focus:outline-none">
                  <option value="SCHEDULED">Scheduled (Upcoming)</option>
                  <option value="ACTIVE">Active (In Progress)</option>
                  <option value="AT_RISK">At Risk / Review</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
              <div>
                <label class="text-label-md font-semibold text-on-surface block mb-1">Date *</label>
                <input id="full-date" type="date" required value="2025-02-20"
                       class="w-full h-10 px-3 rounded-lg bg-surface border border-outline-variant/60 text-body-md focus:outline-none"/>
              </div>

              <div>
                <label class="text-label-md font-semibold text-on-surface block mb-1">Time Slot</label>
                <input id="full-timeslot" type="text" value="09:00 AM - 10:30 AM EST"
                       class="w-full h-10 px-3 rounded-lg bg-surface border border-outline-variant/60 text-body-md focus:outline-none"/>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              <div>
                <label class="text-label-md font-semibold text-on-surface block mb-1">Format</label>
                <select id="full-format" class="w-full h-10 px-3 rounded-lg bg-surface border border-outline-variant/60 text-body-md focus:outline-none">
                  <option value="Hybrid">Hybrid (Onsite + Virtual)</option>
                  <option value="Onsite">Onsite Only</option>
                  <option value="Virtual">Virtual Only</option>
                </select>
              </div>

              <div>
                <label class="text-label-md font-semibold text-on-surface block mb-1">Capacity Limit *</label>
                <input id="full-cap" type="number" required value="100" min="5"
                       class="w-full h-10 px-3 rounded-lg bg-surface border border-outline-variant/60 text-body-md focus:outline-none"/>
              </div>

              <div>
                <label class="text-label-md font-semibold text-on-surface block mb-1">Wellness Credits</label>
                <input id="full-credits" type="number" value="100"
                       class="w-full h-10 px-3 rounded-lg bg-surface border border-outline-variant/60 text-body-md focus:outline-none"/>
              </div>
            </div>

            <div>
              <label class="text-label-md font-semibold text-on-surface block mb-1">Venue / Video Link</label>
              <input id="full-venue" type="text" value="Studio A & Zoom Channel 2"
                     class="w-full h-10 px-3 rounded-lg bg-surface border border-outline-variant/60 text-body-md focus:outline-none"/>
            </div>

            <div>
              <label class="text-label-md font-semibold text-on-surface block mb-1">Lead Facilitator</label>
              <input id="full-facilitator" type="text" value="Dr. Sarah Lin (Wellness Ops)"
                     class="w-full h-10 px-3 rounded-lg bg-surface border border-outline-variant/60 text-body-md focus:outline-none"/>
            </div>

            <div>
              <label class="text-label-md font-semibold text-on-surface block mb-1">Event Description & Notes</label>
              <textarea id="full-desc" rows="3" placeholder="Provide event goals, required physical waiver links, or dietary notes..."
                        class="w-full p-3 rounded-lg bg-surface border border-outline-variant/60 text-body-md focus:outline-none">Comprehensive corporate mental well-being intervention focusing on stress reduction and ergonomics.</textarea>
            </div>

            <div class="pt-4 flex items-center justify-between border-t border-surface-container">
              <button type="button" onclick="navigateTo('events')" class="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-label-md">
                Cancel
              </button>
              <button type="submit" class="px-space-xl py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-label-md font-medium shadow-sm flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]">publish</span>
                <span>Publish Event & Sync CI/CD (Demo data)</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Tips Side Panel (4 cols) -->
        <div class="lg:col-span-4 flex flex-col gap-space-lg">
          <div class="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high p-space-lg">
            <div class="flex items-center gap-2 text-primary font-semibold text-headline-sm mb-2">
              <span class="material-symbols-outlined">health_and_safety</span>
              <span>ISO 45003 Checklist</span>
            </div>
            <ul class="text-[12px] text-on-surface-variant space-y-2">
              <li class="flex items-start gap-2">
                <span class="material-symbols-outlined text-[16px] text-primary">check</span>
                <span>Clear psychological safety notice provided.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="material-symbols-outlined text-[16px] text-primary">check</span>
                <span>HSA/HRA wellness credit eligible allocation.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="material-symbols-outlined text-[16px] text-primary">check</span>
                <span>Hybrid accessibility for distributed remote workforce.</span>
              </li>
            </ul>
          </div>

          <div class="bg-surface-container-low rounded-xl p-space-lg border border-surface-container">
            <span class="text-label-md font-semibold text-on-surface block mb-1">Automated Audit Trail</span>
            <p class="text-[12px] text-on-surface-variant">Publishing creates an immutable record tied to Jenkins Build #142 telemetry and dispatches employee Outlook invitations.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function bindCreateEventForm() {}

async function handleFullFormSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('full-title').value;
  const department = document.getElementById('full-dept').value;
  const status = document.getElementById('full-status').value;
  const eventDate = document.getElementById('full-date').value;
  const timeSlot = document.getElementById('full-timeslot').value;
  const format = document.getElementById('full-format').value;
  const capacity = parseInt(document.getElementById('full-cap').value, 10);
  const wellnessCredits = parseInt(document.getElementById('full-credits').value, 10);
  const venue = document.getElementById('full-venue').value;
  const facilitator = document.getElementById('full-facilitator').value;
  const description = document.getElementById('full-desc').value;

  const res = await API.createEvent({
    title,
    department,
    status,
    eventDate,
    timeSlot,
    format,
    capacity,
    enrolled: 0,
    wellnessCredits,
    venue,
    facilitator,
    description
  });

  if (res.ok) {
    showToast('Event Scheduled', `"${title}" successfully created and logged to audit trail`, 'success');
    navigateTo('events');
  } else {
    showToast('Submission Error', res.data.message || 'Please check form fields', 'error');
  }
}

// =============================================================================
// SCREEN 5: EVENT DETAILS & STATUS UPDATE MODAL
// =============================================================================
async function renderEventDetailScreen(eventCode) {
  const event = await API.getEvent(eventCode) || {
    eventCode: 'EVT-2025-0802',
    title: 'Yoga & Mindfulness',
    department: 'Human Resources',
    eventDate: '2025-02-08',
    timeSlot: '09:00 AM - 10:15 AM EST',
    format: 'Onsite & Hybrid',
    venue: 'Studio A & Zoom Bridge',
    facilitator: 'Maya Patel (Mindfulness Coach)',
    wellnessCredits: 100,
    capacity: 50,
    enrolled: 38,
    status: 'ACTIVE',
    description: 'Gentle Vinyasa flow coupled with breathwork exercises for desk stress reduction, ergonomic alignment, and nervous system decompression.'
  };

  const auditLogs = await API.getEventAudit(eventCode);

  return `
    <div class="p-space-xl flex flex-col gap-space-xl max-w-[1520px] mx-auto w-full">
      <!-- Breadcrumb & Top Actions -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-sm">
        <div class="flex flex-col gap-1">
          <nav class="flex items-center gap-2 text-on-surface-variant text-[12px]">
            <a href="#/events" onclick="event.preventDefault(); navigateTo('events')" class="hover:text-primary transition-colors flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">event_available</span>
              <span>Wellness Events</span>
            </a>
            <span class="text-outline text-xs">/</span>
            <span class="text-on-surface font-semibold">Event Details</span>
          </nav>
          <div class="flex flex-wrap items-center gap-space-md pt-1">
            <h1 class="text-headline-xl text-on-surface font-semibold tracking-tight">${event.title}</h1>
            ${renderStatusBadge(event.status)}
            <span class="px-2 py-0.5 rounded bg-surface-container text-[11px] text-on-surface-variant font-mono font-medium">${event.eventCode}</span>
          </div>
          <p class="text-body-md text-on-surface-variant">View event logistics, attendee allocation, and real-time lifecycle audit history.</p>
        </div>

        <div class="flex flex-wrap items-center gap-space-sm">
          <button onclick="navigateTo('events')" class="h-9 px-space-md rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface text-label-md shadow-sm flex items-center gap-space-xs transition-colors">
            <span class="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Events</span>
          </button>
          <button onclick="openStatusModal()" class="h-9 px-space-md rounded-lg bg-primary hover:bg-primary-container text-on-primary text-label-md shadow-sm flex items-center gap-space-xs transition-all">
            <span class="material-symbols-outlined text-[18px]">cached</span>
            <span>Update Status</span>
          </button>
        </div>
      </div>

      <!-- 2-Column Responsive Workspace -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        <!-- Left / Primary Workspace (8 cols) -->
        <div class="lg:col-span-8 flex flex-col gap-space-xl">
          <!-- Logistics Card -->
          <div class="bg-surface-container-lowest rounded-xl shadow-sm p-space-xl flex flex-col gap-space-lg">
            <div class="flex items-center justify-between pb-space-sm border-b border-surface-container">
              <div class="flex items-center gap-space-sm">
                <span class="material-symbols-outlined text-[20px] text-primary">analytics</span>
                <h2 class="text-headline-md font-semibold text-on-surface">Event Information & Logistics</h2>
              </div>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant text-[11px]">
                <span class="material-symbols-outlined text-[14px]">tag</span>
                <span>Spring Wellness Initiative</span>
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-space-xl gap-y-space-md pt-space-xs">
              <div class="flex flex-col gap-0.5">
                <span class="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Event Title</span>
                <span class="text-body-md font-semibold text-on-surface">${event.title}</span>
              </div>
              <div class="flex flex-col gap-0.5">
                <span class="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Department Allocation</span>
                <span class="text-body-md text-on-surface">${event.department}</span>
              </div>
              <div class="flex flex-col gap-0.5">
                <span class="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Date & Schedule</span>
                <span class="text-body-md text-on-surface flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
                  ${event.eventDate} • ${event.timeSlot || '09:00 AM - 10:15 AM EST'}
                </span>
              </div>
              <div class="flex flex-col gap-0.5">
                <span class="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Format & Venue</span>
                <span class="text-body-md text-on-surface flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[16px] text-secondary">hub</span>
                  ${event.format} • ${event.venue}
                </span>
              </div>
              <div class="flex flex-col gap-0.5">
                <span class="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Lead Facilitator</span>
                <span class="text-body-md text-on-surface">${event.facilitator}</span>
              </div>
              <div class="flex flex-col gap-0.5">
                <span class="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Benefit Allocation</span>
                <span class="text-body-md text-primary font-semibold flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[16px]">stars</span>
                  ${event.wellnessCredits || 100} Wellness Credits (HSA Eligible)
                </span>
              </div>
            </div>

            <!-- Description Block -->
            <div class="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-1.5">
              <span class="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Curriculum Overview</span>
              <p class="text-body-sm text-on-surface">${event.description}</p>
            </div>
          </div>

          <!-- Audit Trail Section -->
          <div class="bg-surface-container-lowest rounded-xl shadow-sm p-space-xl flex flex-col gap-space-md">
            <h3 class="text-headline-sm font-semibold text-on-surface flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">history</span>
              <span>Lifecycle Audit Trail</span>
            </h3>
            <div class="divide-y divide-surface-container">
              ${(auditLogs.length > 0 ? auditLogs : [
                { action: 'STATUS_CHANGE', performedBy: 'DevOps Admin', auditNote: 'Marked event as ACTIVE during morning check-in.', jenkinsBuildNo: 'Build #142', timestamp: 'Today at 09:05 EST' },
                { action: 'ENROLLMENT_CONFIRMED', performedBy: 'System Sync', auditNote: '38 participant badges synced with corporate active directory.', jenkinsBuildNo: 'Build #141', timestamp: 'Today at 08:50 EST' }
              ]).map(log => `
                <div class="py-3 flex items-start justify-between text-body-sm">
                  <div class="flex items-start gap-3">
                    <span class="material-symbols-outlined text-[18px] text-primary mt-0.5">commit</span>
                    <div class="flex flex-col">
                      <span class="font-medium text-on-surface">${log.auditNote || log.action}</span>
                      <span class="text-[11px] text-outline">Action: ${log.action} • Logged by ${log.performedBy}</span>
                    </div>
                  </div>
                  <div class="flex flex-col text-right">
                    <span class="text-[11px] text-on-surface-variant font-mono">${log.jenkinsBuildNo || 'Build #142'} <span class="text-[10px] text-tertiary">(Demo data)</span></span>
                    <span class="text-[10px] text-outline">${log.timestamp || 'Recent'}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right Side: Attendance & Metrics (4 cols) -->
        <div class="lg:col-span-4 flex flex-col gap-space-lg">
          <div class="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
            <span class="text-headline-sm font-semibold text-on-surface">Registration & Attendance</span>
            <div class="flex items-baseline justify-between">
              <span class="text-[36px] font-bold text-on-surface">${event.enrolled}</span>
              <span class="text-body-md text-on-surface-variant">/ ${event.capacity} Capacity</span>
            </div>
            <div class="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
              <div class="h-full bg-primary rounded-full" style="width: ${event.enrollmentPercentage || 76}%"></div>
            </div>
            <div class="text-[12px] text-on-surface-variant flex justify-between">
              <span>Enrollment: <strong>${event.enrollmentPercentage || 76}%</strong></span>
              <span class="text-primary font-semibold">12 Seats Remaining</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Update Status Interactive Modal Dialog -->
    <div id="statusModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm">
      <div class="bg-surface-container-lowest rounded-xl shadow-xl max-w-md w-full p-space-xl flex flex-col gap-space-lg border border-surface-container-high">
        <div class="flex items-center justify-between pb-space-xs border-b border-surface-container">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[22px] text-primary">published_with_changes</span>
            <h3 class="text-headline-sm font-semibold text-on-surface">Update Event Status</h3>
          </div>
          <button onclick="closeStatusModal()" class="text-on-surface-variant hover:text-on-surface">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p class="text-body-sm text-on-surface-variant">
          Select a lifecycle transition for <strong>${event.title} (${event.eventCode})</strong>.
        </p>

        <form onsubmit="handleStatusUpdateSubmit(event, '${event.eventCode}')" class="space-y-3">
          <label class="flex items-start gap-2.5 p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
            <input type="radio" name="modal_status" value="ACTIVE" checked class="mt-1 accent-primary w-4 h-4"/>
            <div class="flex flex-col">
              <span class="text-[13px] font-semibold text-on-surface">Active (In Progress)</span>
              <span class="text-[11px] text-on-surface-variant">Session underway. Virtual room open and onsite check-in live.</span>
            </div>
          </label>

          <label class="flex items-start gap-2.5 p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
            <input type="radio" name="modal_status" value="SCHEDULED" class="mt-1 accent-primary w-4 h-4"/>
            <div class="flex flex-col">
              <span class="text-[13px] font-semibold text-on-surface">Scheduled (Upcoming)</span>
              <span class="text-[11px] text-on-surface-variant">Calendar invitations dispatched; pending session timestamp.</span>
            </div>
          </label>

          <label class="flex items-start gap-2.5 p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
            <input type="radio" name="modal_status" value="COMPLETED" class="mt-1 accent-primary w-4 h-4"/>
            <div class="flex flex-col">
              <span class="text-[13px] font-semibold text-on-surface">Completed</span>
              <span class="text-[11px] text-on-surface-variant">Conclude attendance and grant 100 Wellness Credits to participants.</span>
            </div>
          </label>

          <label class="flex items-start gap-2.5 p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
            <input type="radio" name="modal_status" value="CANCELLED" class="mt-1 accent-primary w-4 h-4"/>
            <div class="flex flex-col">
              <span class="text-[13px] font-semibold text-error">Cancelled</span>
              <span class="text-[11px] text-on-surface-variant">Release room reservation and send cancellation notice to registered staff.</span>
            </div>
          </label>

          <div>
            <label class="block text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold mb-1">Reason / Audit Notes (Optional)</label>
            <input id="modal-status-reason" type="text" placeholder="e.g. Session verified and started on schedule"
                   class="w-full h-9 px-3 rounded-lg bg-surface border border-outline-variant/60 text-body-sm focus:outline-none"/>
          </div>

          <div class="pt-3 flex items-center justify-end gap-2 border-t border-surface-container">
            <button type="button" onclick="closeStatusModal()" class="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-medium">Cancel</button>
            <button type="submit" class="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-[12px] font-medium shadow-sm flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">check</span>
              <span>Confirm & Log Audit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function bindEventDetailEvents() {}

function openStatusModal() {
  const modal = document.getElementById('statusModal');
  if (modal) modal.classList.remove('hidden');
}

function closeStatusModal() {
  const modal = document.getElementById('statusModal');
  if (modal) modal.classList.add('hidden');
}

async function handleStatusUpdateSubmit(e, eventCode) {
  e.preventDefault();
  const selectedStatus = document.querySelector('input[name="modal_status"]:checked')?.value || 'ACTIVE';
  const reason = document.getElementById('modal-status-reason')?.value || '';

  const res = await API.updateEventStatus(eventCode, selectedStatus, reason);
  closeStatusModal();

  if (res.ok) {
    showToast('Status Updated', `Event marked as ${selectedStatus}. Audit logged to Jenkins Build #142`, 'success');
    render();
  } else {
    showToast('Update Failed', res.data.message || 'Unable to transition status', 'error');
  }
}

// =============================================================================
// SCREEN 6: ALERTS & EXCEPTIONS
// =============================================================================
async function renderAlertsScreen() {
  const alerts = await API.getAlerts();
  const openCount = alerts.filter(a => a.status === 'OPEN').length;
  const highPriorityCount = alerts.filter(a => a.severity === 'HIGH' && a.status === 'OPEN').length;
  const resolvedCount = alerts.filter(a => a.status === 'RESOLVED').length;
  AppState.openExceptionsCount = openCount;

  return `
    <div class="w-full max-w-[1520px] mx-auto px-space-xl py-space-lg flex flex-col gap-space-lg">
      <!-- Breadcrumb & Top Bar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-space-xs text-[11px] text-on-surface-variant">
            <a href="#/overview" onclick="event.preventDefault(); navigateTo('overview')" class="hover:text-primary transition-colors flex items-center gap-1">
              <span class="material-symbols-outlined text-[15px]">dashboard</span>
              <span>Overview</span>
            </a>
            <span class="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
            <span class="text-primary font-semibold">Alerts & Exceptions</span>
            <span class="mx-1 text-outline">•</span>
            <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px]">
              <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span>Audited 2m ago • Auto-scan active</span>
            </div>
          </div>
          <div class="flex items-baseline gap-space-md mt-1">
            <h1 class="text-headline-lg font-semibold tracking-tight text-on-surface">Alerts & Exceptions</h1>
            <span class="text-body-sm text-on-surface-variant">Review and resolve corporate wellness activities that require administrative triage</span>
          </div>
        </div>

        <div class="flex items-center gap-space-sm">
          <button onclick="render()" class="h-9 px-space-md rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface text-label-md shadow-sm transition-all flex items-center gap-space-xs">
            <span class="material-symbols-outlined text-[18px]">sync</span>
            <span>Refresh</span>
          </button>
          <button onclick="bulkResolveAll()" class="h-9 px-space-md rounded-lg bg-primary hover:bg-primary-container text-on-primary text-label-md shadow-sm transition-all flex items-center gap-space-xs">
            <span class="material-symbols-outlined text-[18px]">done_all</span>
            <span>Bulk Resolve</span>
          </button>
        </div>
      </div>

      <!-- 3 Compact Metric Tiles -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        <div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] text-on-surface-variant uppercase font-semibold">Open Exceptions</span>
            <div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
              <span class="material-symbols-outlined text-[19px]">notifications_active</span>
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-[36px] font-bold text-on-surface">${openCount}</span>
            <span class="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[11px] font-semibold">${highPriorityCount} urgent</span>
          </div>
          <div class="mt-2 text-[11px] text-on-surface-variant flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px] text-tertiary">warning</span>
            <span>Across enterprise departments • H2 Live Records</span>
          </div>
        </div>

        <div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] text-error uppercase font-semibold">High Priority</span>
            <div class="w-8 h-8 rounded-lg bg-error-container text-on-error-container flex items-center justify-center">
              <span class="material-symbols-outlined text-[19px]">priority_high</span>
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-[36px] font-bold text-on-surface">${highPriorityCount}</span>
            <span class="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[11px] font-semibold">SLA Critical</span>
          </div>
          <div class="mt-2 text-[11px] text-on-surface-variant flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px] text-error">alarm</span>
            <span>SLA response threshold < 4 hours remaining</span>
          </div>
        </div>

        <div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[11px] text-primary uppercase font-semibold">Resolved Today</span>
            <div class="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
              <span class="material-symbols-outlined text-[19px]">check_circle</span>
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-[36px] font-bold text-on-surface">${resolvedCount}</span>
            <span class="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-semibold">Recorded in DB</span>
          </div>
          <div class="mt-2 text-[11px] text-on-surface-variant flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px] text-primary">trending_up</span>
            <span>Median resolution latency: 38 mins</span>
          </div>
        </div>
      </div>

      <!-- Main Alerts Table -->
      <div class="bg-surface-container-lowest rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-low/70 text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold">
                <th class="py-3 px-space-lg">Exception Summary</th>
                <th class="py-3 px-space-md">Related Event</th>
                <th class="py-3 px-space-md">Department</th>
                <th class="py-3 px-space-md">Severity</th>
                <th class="py-3 px-space-md">Status</th>
                <th class="py-3 px-space-md text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-container text-body-sm">
              ${alerts.map(a => `
                <tr class="hover:bg-surface-container-low/40 transition-colors">
                  <td class="py-3.5 px-space-lg">
                    <div class="flex items-start gap-2.5">
                      <div class="w-7 h-7 rounded-lg ${a.severity === 'HIGH' ? 'bg-error-container text-on-error-container' : 'bg-tertiary-fixed text-on-tertiary-fixed'} flex items-center justify-center shrink-0 mt-0.5">
                        <span class="material-symbols-outlined text-[16px]">${a.severity === 'HIGH' ? 'warning' : 'local_shipping'}</span>
                      </div>
                      <div class="flex flex-col">
                        <span class="font-semibold text-on-surface text-[13px] flex items-center gap-1.5">
                          ${a.title}
                          <span class="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant text-[10px] font-mono">${a.exceptionCode}</span>
                        </span>
                        <span class="text-on-surface-variant text-[12px]">${a.description}</span>
                      </div>
                    </div>
                  </td>
                  <td class="py-3.5 px-space-md text-on-surface font-medium">${a.eventName || 'Enterprise'}</td>
                  <td class="py-3.5 px-space-md">
                    <span class="px-2 py-0.5 rounded-full bg-surface-container text-[11px] text-on-surface-variant">${a.department}</span>
                  </td>
                  <td class="py-3.5 px-space-md">
                    <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold ${a.severity === 'HIGH' ? 'bg-error-container text-on-error-container' : 'bg-tertiary-fixed text-on-tertiary-fixed'}">
                      ${a.severity}
                    </span>
                  </td>
                  <td class="py-3.5 px-space-md whitespace-nowrap">
                    <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold ${a.status === 'RESOLVED' ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-secondary-container text-on-secondary-container'}">
                      ${a.status}
                    </span>
                  </td>
                  <td class="py-3.5 px-space-md text-right whitespace-nowrap">
                    ${a.status !== 'RESOLVED' ? `
                      <button onclick="resolveSingleAlert('${a.exceptionCode}')" class="h-7 px-2.5 rounded bg-primary text-on-primary text-[11px] font-medium hover:bg-primary-container transition-colors">
                        Resolve
                      </button>
                    ` : `
                      <span class="text-[11px] text-primary flex items-center justify-end gap-1">
                        <span class="material-symbols-outlined text-[14px]">check</span> Resolved
                      </span>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function bindAlertsEvents() {}

async function resolveSingleAlert(code) {
  const res = await API.resolveAlert(code);
  AppState.openExceptionsCount = Math.max(0, (AppState.openExceptionsCount || 1) - 1);
  showToast('Exception Resolved', `Alert ${code} marked as resolved. SLA timer halted.`, 'success');
  render();
}

async function bulkResolveAll() {
  const res = await API.bulkResolveAlerts();
  AppState.openExceptionsCount = 0;
  showToast('Bulk Triage Complete', res.message || 'All open alerts marked resolved.', 'success');
  render();
}

// =============================================================================
// SCREEN 7: WELLNESS REPORTS
// =============================================================================
async function renderReportsScreen() {
  const data = await API.getReports();

  return `
    <div class="w-full max-w-[1600px] mx-auto px-gutter md:px-gutter-lg py-space-xl flex flex-col gap-space-xl">
      <header class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg pb-space-md">
        <div class="flex flex-col gap-space-xs">
          <div class="flex items-center gap-space-sm text-[12px] text-on-surface-variant">
            <span>Overview</span>
            <span class="text-outline">/</span>
            <span class="text-on-surface font-semibold">Reports</span>
            <span class="inline-block w-1 h-1 rounded-full bg-outline-variant mx-1"></span>
            <span class="flex items-center gap-1 text-primary">
              <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              ${data.syncStatus || 'Pipeline Sync: Jan 2025 Cycle • Updated nominal'} (Demo data)
            </span>
          </div>
          <h1 class="text-headline-xl font-semibold text-on-surface tracking-tight">Wellness Reports</h1>
          <p class="text-body-md text-on-surface-variant">Analyze employee participation and corporate wellness program performance across organizational cohorts.</p>
        </div>

        <div class="flex flex-wrap items-center gap-space-sm">
          <button onclick="window.location.href='/api/reports/export/csv'" class="h-9 px-space-md bg-surface-container-lowest hover:bg-surface-container-low text-on-surface text-label-md rounded-lg flex items-center gap-space-xs shadow-sm transition-colors">
            <span class="material-symbols-outlined text-[18px]">table_view</span>
            <span>Export CSV</span>
          </button>
          <button onclick="showToast('Exporting PDF', 'Compiling executive PDF report for download...', 'success')" class="h-9 px-space-md bg-primary hover:bg-primary-container text-on-primary text-label-md rounded-lg flex items-center gap-space-xs shadow-sm transition-colors">
            <span class="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            <span>Export PDF Report</span>
          </button>
        </div>
      </header>

      <!-- KPI Summary Row -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
          <span class="text-[11px] text-on-surface-variant tracking-wider uppercase font-semibold">Total Wellness Events</span>
          <span class="text-[36px] font-bold text-on-surface leading-none mt-1">48</span>
          <div class="pt-2 text-[11px] text-primary flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">arrow_upward</span> +12 vs prior cycle
          </div>
        </div>

        <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
          <span class="text-[11px] text-on-surface-variant tracking-wider uppercase font-semibold">Total Participants</span>
          <span class="text-[36px] font-bold text-on-surface leading-none mt-1">1,842</span>
          <div class="pt-2 text-[11px] text-primary flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">trending_up</span> +18.4% YoY
          </div>
        </div>

        <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
          <span class="text-[11px] text-on-surface-variant tracking-wider uppercase font-semibold">Average Participation</span>
          <div class="flex items-baseline gap-2 mt-1">
            <span class="text-[36px] font-bold text-on-surface leading-none">76.4%</span>
            <span class="text-[11px] text-on-surface-variant">(Target: 75.0%)</span>
          </div>
          <div class="pt-2 text-[11px] text-primary font-semibold">Above Target (+1.4%)</div>
        </div>

        <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
          <span class="text-[11px] text-on-surface-variant tracking-wider uppercase font-semibold">Completed Programs</span>
          <span class="text-[36px] font-bold text-on-surface leading-none mt-1">18</span>
          <div class="pt-2 text-[11px] text-primary font-semibold">92% completion rate</div>
        </div>
      </section>

      <!-- Two-Column Analytics -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <section class="lg:col-span-8 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm border-b border-surface-container">
            <div>
              <h2 class="text-headline-sm text-on-surface font-semibold">Participation Trends (Past 6 Months)</h2>
              <p class="text-body-sm text-on-surface-variant">Actual employee engagement benchmarked against 75% corporate target</p>
            </div>
            <div class="flex items-center bg-surface-container-low p-1 rounded-lg">
              <button onclick="toggleBenchmarkLine()" class="flex items-center gap-1 px-2.5 py-1 text-primary text-label-md rounded-md">
                <span id="targetCheckIcon" class="material-symbols-outlined text-[16px]">check_box</span>
                <span>Target 75%</span>
              </button>
            </div>
          </div>

          <div class="relative w-full h-72 pt-4">
            <svg class="w-full h-full overflow-visible select-none" preserveAspectRatio="none" viewBox="0 0 760 260">
              <defs>
                <linearGradient id="reportsGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stop-color="#15684d" stop-opacity="0.28"/>
                  <stop offset="100%" stop-color="#15684d" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <line x1="45" y1="20" x2="740" y2="20" stroke="#dde3ee" stroke-dasharray="2 2"/>
              <text x="35" y="24" fill="#6f7973" font-size="11" text-anchor="end">100%</text>
              <line x1="45" y1="66" x2="740" y2="66" stroke="#dde3ee" stroke-dasharray="2 2"/>
              <text x="35" y="70" fill="#6f7973" font-size="11" text-anchor="end">80%</text>
              <line x1="45" y1="112" x2="740" y2="112" stroke="#dde3ee" stroke-dasharray="2 2"/>
              <text x="35" y="116" fill="#6f7973" font-size="11" text-anchor="end">60%</text>
              <line x1="45" y1="158" x2="740" y2="158" stroke="#dde3ee" stroke-dasharray="2 2"/>
              <text x="35" y="162" fill="#6f7973" font-size="11" text-anchor="end">40%</text>
              <line x1="45" y1="250" x2="740" y2="250" stroke="#dde3ee"/>
              <text x="35" y="253" fill="#6f7973" font-size="11" text-anchor="end">0%</text>

              <g id="reportsBenchmarkLine" style="display: ${AppState.targetBenchmarkVisible ? '' : 'none'}">
                <line x1="45" y1="77.5" x2="740" y2="77.5" stroke="#505f76" stroke-dasharray="4 4" stroke-width="1.5"/>
                <rect x="670" y="66" width="68" height="18" rx="4" fill="#dde3ee"/>
                <text x="704" y="79" fill="#161c24" font-size="10" font-weight="600" text-anchor="middle">Target 75%</text>
              </g>

              <path d="M 75 93.6 C 140 93.6, 140 86.7, 205 86.7 C 270 86.7, 270 79.8, 335 79.8 C 400 79.8, 400 82.1, 465 82.1 C 530 82.1, 530 68.3, 595 68.3 C 660 68.3, 660 74.3, 725 74.3 L 725 250 L 75 250 Z" fill="url(#reportsGrad)"/>
              <path d="M 75 93.6 C 140 93.6, 140 86.7, 205 86.7 C 270 86.7, 270 79.8, 335 79.8 C 400 79.8, 400 82.1, 465 82.1 C 530 82.1, 530 68.3, 595 68.3 C 660 68.3, 660 74.3, 725 74.3" fill="none" stroke="#15684d" stroke-width="3" stroke-linecap="round"/>

              <circle cx="75" cy="93.6" r="4.5" fill="#fff" stroke="#15684d" stroke-width="2.5"/>
              <text x="75" y="85" fill="#3f4944" font-size="11" text-anchor="middle">68%</text>
              <text x="75" y="268" fill="#6f7973" font-size="12" text-anchor="middle">Aug '24</text>

              <circle cx="205" cy="86.7" r="4.5" fill="#fff" stroke="#15684d" stroke-width="2.5"/>
              <text x="205" y="78" fill="#3f4944" font-size="11" text-anchor="middle">71%</text>
              <text x="205" y="268" fill="#6f7973" font-size="12" text-anchor="middle">Sep '24</text>

              <circle cx="335" cy="79.8" r="4.5" fill="#fff" stroke="#15684d" stroke-width="2.5"/>
              <text x="335" y="71" fill="#3f4944" font-size="11" text-anchor="middle">74%</text>
              <text x="335" y="268" fill="#6f7973" font-size="12" text-anchor="middle">Oct '24</text>

              <circle cx="465" cy="82.1" r="4.5" fill="#fff" stroke="#15684d" stroke-width="2.5"/>
              <text x="465" y="73" fill="#3f4944" font-size="11" text-anchor="middle">73%</text>
              <text x="465" y="268" fill="#6f7973" font-size="12" text-anchor="middle">Nov '24</text>

              <circle cx="595" cy="68.3" r="5" fill="#15684d" stroke="#ffffff" stroke-width="2"/>
              <text x="595" y="58" fill="#15684d" font-size="11" font-weight="bold" text-anchor="middle">79% (Peak)</text>
              <text x="595" y="268" fill="#6f7973" font-size="12" text-anchor="middle">Dec '24</text>

              <circle cx="725" cy="74.3" r="5.5" fill="#15684d" stroke="#ffffff" stroke-width="2.5"/>
              <text x="725" y="268" fill="#161c24" font-size="12" font-weight="600" text-anchor="middle">Jan '25</text>
            </svg>
          </div>
        </section>

        <!-- Department Progress Bars (4 cols) -->
        <section class="lg:col-span-4 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
          <div class="flex items-start justify-between pb-space-xs">
            <div>
              <h2 class="text-headline-sm font-semibold text-on-surface">Department Comparison</h2>
              <p class="text-[12px] text-on-surface-variant">Participation rate by business unit</p>
            </div>
            <span class="text-[11px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">75% Target</span>
          </div>

          <div class="flex flex-col gap-space-md pt-space-xs">
            ${(data.departments || []).map(d => `
              <div class="flex flex-col gap-1">
                <div class="flex items-center justify-between text-[13px]">
                  <span class="font-semibold text-on-surface">${d.name}</span>
                  <span class="text-primary font-semibold">${d.participationRate}% <span class="text-on-surface-variant font-normal text-[11px]">(${d.enrolledEmployees}/${d.totalEmployees})</span></span>
                </div>
                <div class="relative w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div class="absolute left-0 top-0 h-full bg-primary rounded-full" style="width: ${d.participationRate}%;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    </div>
  `;
}

function bindReportsEvents() {}

function toggleBenchmarkLine() {
  AppState.targetBenchmarkVisible = !AppState.targetBenchmarkVisible;
  const line = document.getElementById('reportsBenchmarkLine');
  const icon = document.getElementById('targetCheckIcon');
  if (line) line.style.display = AppState.targetBenchmarkVisible ? '' : 'none';
  if (icon) icon.textContent = AppState.targetBenchmarkVisible ? 'check_box' : 'check_box_outline_blank';
}

// =============================================================================
// SCREEN 8: DEPLOYMENT STATUS (DevOps Telemetry Simulation)
// =============================================================================
async function renderDeploymentScreen() {
  const data = await API.getDeployment();
  const tel = data.telemetry || {
    buildNumber: 24,
    status: AppState.deploymentState,
    branch: 'main',
    commitSha: '8f4a1c9',
    pipelineTarget: 'dev-cluster-us-east-1',
    triggerType: 'GitHub Webhook'
  };

  return `
    <div class="w-full bg-surface-container-lowest shadow-sm px-space-xl py-space-sm flex flex-wrap items-center justify-between gap-space-sm mb-space-lg">
      <div class="flex items-center gap-space-sm text-body-sm text-secondary">
        <span class="hover:text-on-surface transition-colors cursor-pointer" onclick="navigateTo('overview')">Overview</span>
        <span class="text-outline-variant">/</span>
        <span class="font-semibold text-primary">Deployment Status</span>
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px]">
          <span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
          <span>Simulated Poller • Demo Mode</span>
        </span>
      </div>
      <div class="flex items-center gap-space-sm">
        <span class="text-[11px] text-secondary uppercase tracking-wider font-semibold">Educational Project Telemetry</span>
        <span class="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-semibold">CI/CD Pipeline</span>
      </div>
    </div>

    <div class="max-w-[1600px] w-full mx-auto px-space-xl pb-space-2xl space-y-space-lg">
      <!-- State Simulation Switcher -->
      <div class="flex flex-col xl:flex-row xl:items-end justify-between gap-space-lg">
        <div class="space-y-1">
          <div class="flex items-center gap-space-sm">
            <h1 class="text-headline-lg font-semibold text-on-surface tracking-tight">Deployment Status</h1>
            <span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium">v1.0.0 build #${tel.buildNumber}</span>
          </div>
          <p class="text-body-md text-secondary">Monitor application builds, automated tests, and deployments in the simulated Jenkins CI/CD pipeline.</p>
        </div>

        <div class="flex flex-wrap items-center gap-space-sm">
          <div class="flex items-center bg-surface-container-low p-1 rounded-lg">
            <button onclick="setSimState('RUNNING')" class="px-3 py-1.5 rounded-lg ${AppState.deploymentState === 'RUNNING' ? 'bg-surface-container-lowest shadow-sm text-primary font-semibold' : 'text-secondary hover:text-on-surface'} text-[12px] flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span> #24 Running
            </button>
            <button onclick="setSimState('STABLE')" class="px-3 py-1.5 rounded-lg ${AppState.deploymentState === 'STABLE' ? 'bg-surface-container-lowest shadow-sm text-primary font-semibold' : 'text-secondary hover:text-on-surface'} text-[12px] flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-primary"></span> #23 Stable
            </button>
            <button onclick="setSimState('FAILED')" class="px-3 py-1.5 rounded-lg ${AppState.deploymentState === 'FAILED' ? 'bg-surface-container-lowest shadow-sm text-error font-semibold' : 'text-secondary hover:text-on-surface'} text-[12px] flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-error"></span> #22 Failed
            </button>
          </div>

          <button onclick="openConsoleModal()" class="h-9 px-space-md rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-label-md flex items-center gap-space-xs shadow-sm">
            <span class="material-symbols-outlined text-[18px]">terminal</span>
            <span>Raw Console Output</span>
          </button>
        </div>
      </div>

      <!-- Application Info Bar -->
      <div class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-surface-container-high/40">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-md border-b border-surface-container">
          <div class="flex items-center gap-space-md">
            <div class="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary">
              <span class="material-symbols-outlined text-[24px]">deployed_code</span>
            </div>
            <div>
              <div class="flex items-center gap-space-sm">
                <h2 class="text-headline-sm font-semibold text-on-surface">Corporate Wellness Dashboard</h2>
                <span class="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-medium">Spring Boot 3.2</span>
                <span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium">H2 In-Memory</span>
              </div>
              <p class="text-body-sm text-secondary">Spring Boot microservice & executive analytics hub for employee health and mental wellness.</p>
            </div>
          </div>
          <div class="inline-flex items-center gap-space-xs px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant text-[11px]">
            <span class="material-symbols-outlined text-[16px] text-tertiary">school</span>
            <span>${data.demoDisclaimer || 'Illustrative DevOps telemetry for college mini-project demonstration.'}</span>
          </div>
        </div>

        <div class="pt-space-md grid grid-cols-2 md:grid-cols-4 gap-space-md text-body-sm">
          <div>
            <span class="text-[11px] text-secondary uppercase font-semibold">Pipeline Target</span>
            <span class="block font-semibold text-on-surface mt-0.5">${tel.pipelineTarget} <span class="text-[10px] text-tertiary font-mono">(Demo data)</span></span>
          </div>
          <div>
            <span class="text-[11px] text-secondary uppercase font-semibold">Latest Trigger</span>
            <span class="block font-semibold text-on-surface mt-0.5">${tel.triggerType}</span>
          </div>
          <div>
            <span class="text-[11px] text-secondary uppercase font-semibold">Git Branch</span>
            <span class="block font-mono text-[12px] text-primary mt-0.5">${tel.branch}</span>
          </div>
          <div>
            <span class="text-[11px] text-secondary uppercase font-semibold">Commit SHA</span>
            <span class="block font-mono text-[12px] text-primary mt-0.5">${tel.commitSha}</span>
          </div>
        </div>
      </div>

      <!-- Pipeline Stages Grid -->
      <div class="grid grid-cols-1 md:grid-cols-6 gap-3">
        ${(data.stages || []).map((stage, idx) => `
          <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-container flex flex-col justify-between">
            <div>
              <span class="text-[10px] text-outline uppercase font-semibold">Stage 0${idx + 1}</span>
              <span class="block text-label-md font-semibold text-on-surface mt-1">${stage.name}</span>
            </div>
            <div class="mt-3 flex items-center justify-between text-[11px]">
              <span class="px-1.5 py-0.5 rounded font-semibold ${stage.status === 'PASSED' ? 'bg-primary-fixed/40 text-on-primary-fixed-variant' : (stage.status === 'IN_PROGRESS' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-outline')}">
                ${stage.status}
              </span>
              <span class="text-outline">${stage.duration}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Console Output Modal -->
    <div id="consoleModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm">
      <div class="bg-[#161c24] text-[#f8f9ff] rounded-xl shadow-2xl max-w-2xl w-full p-space-lg flex flex-col gap-3 font-mono text-[12px] border border-outline/30">
        <div class="flex items-center justify-between pb-2 border-b border-outline/20">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-error"></span>
            <span class="w-3 h-3 rounded-full bg-tertiary"></span>
            <span class="w-3 h-3 rounded-full bg-primary"></span>
            <span class="ml-2 font-semibold text-[13px]">Jenkins Pipeline Console Output (#24) - [Simulated Demo Data]</span>
          </div>
          <button onclick="closeConsoleModal()" class="text-outline hover:text-white">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <pre id="consoleOutputText" class="p-3 bg-black/40 rounded-lg overflow-y-auto max-h-96 text-left whitespace-pre-wrap text-emerald-400">Loading console logs...</pre>
      </div>
    </div>
  `;
}

function bindDeploymentEvents() {}

async function setSimState(state) {
  AppState.deploymentState = state;
  await API.simulateDeploymentState(state);
  showToast('Simulated State', `Telemetry switched to ${state}`, 'success');
  render();
}

async function openConsoleModal() {
  const modal = document.getElementById('consoleModal');
  const text = document.getElementById('consoleOutputText');
  if (modal) modal.classList.remove('hidden');
  const res = await API.getConsoleLog();
  if (text) text.textContent = res.consoleLog || 'Console output unavailable';
}

function closeConsoleModal() {
  const modal = document.getElementById('consoleModal');
  if (modal) modal.classList.add('hidden');
}

// Status badge helper
function renderStatusBadge(status) {
  switch ((status || '').toUpperCase()) {
    case 'ACTIVE':
      return `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant text-[11px] font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>Active</span>`;
    case 'SCHEDULED':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-outline"></span>Scheduled</span>`;
    case 'COMPLETED':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-semibold"><span class="material-symbols-outlined text-[13px]">check</span>Completed</span>`;
    case 'AT_RISK':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span>At Risk</span>`;
    case 'CANCELLED':
      return `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container text-[11px] font-semibold">Cancelled</span>`;
    default:
      return `<span class="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px]">${status}</span>`;
  }
}
