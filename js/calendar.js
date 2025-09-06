import { posts } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  const events = posts.map(p => ({
    title: p.title,
    start: p.date,
    url: `post.html?slug=${p.slug}`,
    color: p.type==='notification' ? '#2563eb' :
           p.type==='admit' ? '#16a34a' :
           p.type==='result' ? '#9333ea' : '#f59e0b'
  }));
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    height: 'auto',
    headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' },
    events
  });
  calendar.render();
});