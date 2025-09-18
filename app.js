const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTN5FOSUM77lPnkjReqiyTlM5paNh_VMPu27TuQJxip6n7pD7su15lVqyBqwvJ-TKyp7AXJGuT26l11/pub?gid=0&single=true&output=csv;
const BANNER_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTN5FOSUM77lPnkjReqiyTlM5paNh_VMPu27TuQJxip6n7pD7su15lVqyBqwvJ-TKyp7AXJGuT26l11/pubhtml?gid=31431312&single=true';

async function fetchData() {
  const response = await fetch(CSV_URL);
  const data = await response.text();
  const rows = data.split('\n').slice(1); // skip header
  const tbody = document.querySelector('#jadwal tbody');
  tbody.innerHTML = '';
  rows.forEach(r => {
    if (r.trim() === '') return;
    const cols = r.split(',');
    const tr = document.createElement('tr');
    cols.forEach(c => {
      const td = document.createElement('td');
      td.textContent = c;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

async function fetchBanner() {
  const response = await fetch(BANNER_URL);
  const data = await response.text();
  const rows = data.split('\n').slice(1); // skip header
  const texts = rows.map(r => r.split(',')[0]).filter(t => t.trim() !== '');
  document.getElementById('banner').innerHTML = texts.join(' • ');
}

function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleString();
}

setInterval(updateClock, 1000);
updateClock();

fetchData();
fetchBanner();
setInterval(fetchData, 60000);
setInterval(fetchBanner, 60000);
