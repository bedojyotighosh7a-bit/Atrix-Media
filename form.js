'use strict';
(() => {
  const form = document.getElementById('atrixForm');
  if (!form) return;
  const status = document.getElementById('form-status');
  const button = form.querySelector('button[type="submit"]');
  const plan = document.getElementById('plan');
  const requested = new URLSearchParams(location.search).get('plan');
  if ([...plan.options].some(o => o.value === requested)) plan.value = requested;
  const radios = [...document.querySelectorAll('input[name="posts"]')];
  radios.forEach(radio => { radio.checked = radio.value === plan.value; radio.addEventListener('change', () => { if (radio.checked) plan.value = radio.value; }); });
  const phone = document.getElementById('phone');
  const checkPhone = () => {
    const value = phone.value.trim();
    const digits = value.replace(/\D/g, '');
    phone.setCustomValidity(/^[+\d\s()-]+$/.test(value) && digits.length >= 10 && digits.length <= 15 ? '' : 'Enter a valid phone number with 10–15 digits.');
  };
  phone.addEventListener('input', checkPhone);
  const fields = ['business', 'contactName', 'email', 'phone', 'profile', 'city', 'plan', 'goal', 'budget', 'companyWebsite'];
  let lastPayload = '';
  let requestId = '';
  let pending = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending) return;
    checkPhone();
    ['business','contactName','city','goal'].forEach(id => {
      const input = document.getElementById(id);
      input.value = input.value.trim();
    });
    if (!form.reportValidity()) return;
    if (document.getElementById('companyWebsite').value) return;
    const data = Object.fromEntries(fields.map(id => [id, document.getElementById(id).value.trim()]));
    data.country = 'India';
    data.onlineOnly = false;
    data.consent = document.getElementById('consent').checked;
    const payload = JSON.stringify(data);
    if (payload !== lastPayload) {
      requestId = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2);
      lastPayload = payload;
    }
    data.requestId = requestId;
    const config = window.ATRYX_CONFIG;
    status.textContent = '';
    if (!config || !/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(config.formEndpoint)) {
      status.textContent = 'The form is temporarily unavailable. Please message us on Instagram using the link below.';
      status.focus();
      return;
    }
    pending = true;
    button.disabled = true;
    button.textContent = 'Sending your request…';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.timeoutMs || 20000);
    try {
      // Simple CORS request; do not use no-cors, which hides server errors.
      const response = await fetch(config.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data),
        signal: controller.signal,
        credentials: 'omit',
        redirect: 'follow'
      });
      if (!response.ok) throw new Error('Server rejected request');
      const result = await response.json();
      if (result.ok !== true) throw new Error('Receipt not confirmed');
      location.href = 'atrixwelcome.html?submitted=1';
    } catch (_) {
      status.textContent = 'We couldn’t confirm receipt. Your details are still here. Please retry, or message us on Instagram if this continues. If you already receive a reply, you don’t need to resubmit.';
      status.focus();
    } finally {
      clearTimeout(timer);
      pending = false;
      button.disabled = false;
      button.textContent = 'Request my free audit ↗';
    }
  });
})();
