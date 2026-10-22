/**
 * REST API Client for Corporate Wellness Dashboard
 * Communicates with Spring Boot backend endpoints.
 */
const API = {
  baseUrl: '',

  async login(email, password) {
    const res = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return { ok: res.ok, status: res.status, data: await res.json() };
  },

  async getSummary() {
    const res = await fetch(`${this.baseUrl}/api/dashboard/summary`);
    return await res.json();
  },

  async getEvents(query = '', department = 'all', status = 'all') {
    const params = new URLSearchParams({ query, department, status });
    const res = await fetch(`${this.baseUrl}/api/events?${params.toString()}`);
    return await res.json();
  },

  async getEvent(eventCode) {
    const res = await fetch(`${this.baseUrl}/api/events/${encodeURIComponent(eventCode)}`);
    if (!res.ok) return null;
    return await res.json();
  },

  async createEvent(eventData) {
    const res = await fetch(`${this.baseUrl}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    return { ok: res.ok, status: res.status, data: await res.json() };
  },

  async updateEventStatus(eventCode, status, reason = '') {
    const res = await fetch(`${this.baseUrl}/api/events/${encodeURIComponent(eventCode)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reason, performedBy: 'DevOps Admin' })
    });
    return { ok: res.ok, status: res.status, data: await res.json() };
  },

  async getEventAudit(eventCode) {
    const res = await fetch(`${this.baseUrl}/api/events/${encodeURIComponent(eventCode)}/audit`);
    return await res.json();
  },

  async getAlerts(status = 'all') {
    const res = await fetch(`${this.baseUrl}/api/alerts?status=${encodeURIComponent(status)}`);
    return await res.json();
  },

  async getAlertSummary() {
    const res = await fetch(`${this.baseUrl}/api/alerts/summary`);
    return await res.json();
  },

  async resolveAlert(exceptionCode) {
    const res = await fetch(`${this.baseUrl}/api/alerts/${encodeURIComponent(exceptionCode)}/resolve`, {
      method: 'POST'
    });
    return await res.json();
  },

  async bulkResolveAlerts() {
    const res = await fetch(`${this.baseUrl}/api/alerts/bulk-resolve`, { method: 'POST' });
    return await res.json();
  },

  async getReports() {
    const res = await fetch(`${this.baseUrl}/api/reports/analytics`);
    return await res.json();
  },

  async getDeployment() {
    const res = await fetch(`${this.baseUrl}/api/deployment/status`);
    return await res.json();
  },

  async simulateDeploymentState(state) {
    const res = await fetch(`${this.baseUrl}/api/deployment/simulate/${encodeURIComponent(state)}`, {
      method: 'POST'
    });
    return await res.json();
  },

  async getConsoleLog() {
    const res = await fetch(`${this.baseUrl}/api/deployment/console`);
    return await res.json();
  }
};
