'use strict';
if (new URLSearchParams(location.search).get('submitted') === '1') {
  document.getElementById('receipt-label').textContent = 'Received';
  const title = document.getElementById('receipt-title');
  title.textContent = '';
  title.append(document.createTextNode("We've got your"),document.createElement('br'));
  const accent = document.createElement('span'); accent.className = 'accent'; accent.textContent = 'details.'; title.append(accent);
  document.getElementById('receipt-copy').textContent = 'Thank you for sharing your business information with us. We’ll review your details and reply with practical next steps for your business.';
  const cta = document.getElementById('receipt-cta'); cta.href = 'about.html'; cta.textContent = 'Explore Atryx Media →';
}
