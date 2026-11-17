'use strict';
/* Add your YouTube links here. Leave a value empty until a video is published.
   Accepts an 11-character video ID, youtube.com/watch?v=..., youtu.be/...,
   youtube.com/shorts/... or youtube.com/embed/... . No HTML edits needed. */
const ATRYX_VIDEOS = [
  { slot: 1, youtube: '', title: 'From setup to celebration — Atryx Media' },
  { slot: 2, youtube: '', title: 'The thinking behind the room — Atryx Media' },
  { slot: 3, youtube: '', title: 'A closer look at the material — Atryx Media' }
];
function atryxYouTubeId(value) {
  value = String(value || '').trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(value)) return value;
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol)) return null;
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    let id = '';
    if (host === 'youtu.be') id = url.pathname.split('/')[1];
    else if (['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host)) {
      id = url.searchParams.get('v') || (/^\/(shorts|embed)\//.test(url.pathname) ? url.pathname.split('/')[2] : '');
    }
    return /^[A-Za-z0-9_-]{11}$/.test(id || '') ? id : null;
  } catch (_) { return null; }
}
ATRYX_VIDEOS.forEach(video => {
  const container = document.querySelector('[data-video-slot="' + video.slot + '"]');
  const id = atryxYouTubeId(video.youtube);
  if (!container || !id) return;
  const button = document.createElement('button');
  button.className = 'video-empty video-ready';
  button.type = 'button';
  button.setAttribute('aria-label', 'Play ' + video.title);
  const icon = document.createElement('span'); icon.className = 'video-play'; icon.textContent = '▶'; icon.setAttribute('aria-hidden', 'true');
  const title = document.createElement('strong'); title.textContent = video.title;
  const note = document.createElement('small'); note.textContent = 'Play on this page · loads YouTube';
  button.append(icon, title, note);
  button.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1';
    frame.title = video.title;
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    container.replaceChildren(frame);
    frame.focus();
  });
  container.replaceChildren(button);
});
