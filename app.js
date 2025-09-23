// konfigurasi URL CSV
const JADWAL_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTN5FOSUM77lPnkjReqiyTlM5paNh_VMPu27TuQJxip6n7pD7su15lVqyBqwvJ-TKyp7AXJGuT26l11/pub?gid=0&single=true&output=csv';     // Jetty, Nama Kapal, ATA, ETD
const INCOMING_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTN5FOSUM77lPnkjReqiyTlM5paNh_VMPu27TuQJxip6n7pD7su15lVqyBqwvJ-TKyp7AXJGuT26l11/pub?gid=785826341&single=true&output=csv'; // Nama Kapal, ETA
const ANCHORAGE_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTN5FOSUM77lPnkjReqiyTlM5paNh_VMPu27TuQJxip6n7pD7su15lVqyBqwvJ-TKyp7AXJGuT26l11/pub?gid=949735173&single=true&output=csv'; // Nama Kapal, ATA, ETB
const BANNER_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTN5FOSUM77lPnkjReqiyTlM5paNh_VMPu27TuQJxip6n7pD7su15lVqyBqwvJ-TKyp7AXJGuT26l11/pub?gid=31431312&single=true&output=csv';     // Teks banner

// ubah teks CSV ke array
function csvToRows(text) {
  return text.trim().split(/\r?\n/).map(r => r.split(','));
}

// load table umum
async function loadTable(url, tableSelector, colCount) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const txt = await res.text();
    const rows = csvToRows(txt).slice(1); // skip header
    const tbody = document.querySelector(tableSelector + ' tbody');
    tbody.innerHTML = '';
    rows.forEach(r => {
      if (r.join('').trim()==='') return;
      const tr = document.createElement('tr');
      for (let i=0; i<colCount; i++) {
        const td = document.createElement('td');
        td.textContent = r[i] || '';
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('loadTable', tableSelector, err);
    document.querySelector(tableSelector+' tbody').innerHTML =
      `<tr><td colspan="${colCount}">Gagal memuat data</td></tr>`;
  }
}


// load banner
async function fetchBanner() {
  const bannerEl = document.getElementById('banner');
  try {
    const res = await fetch(BANNER_URL);
    if (!res.ok) throw new Error(res.status);
    const txt = await res.text();
    const rows = csvToRows(txt).slice(1);
    const texts = rows.map(r => (r[0]||'').trim()).filter(Boolean);
    const content = texts.join(' • ') || '— Tidak ada info banner —';
    // isi #banner dengan <span> agar animasi scroll jalan
    bannerEl.innerHTML = `<span>${content}</span>`;
  } catch(e) {
    console.error(e);
    bannerEl.innerHTML='<span>Gagal memuat banner</span>';
  }
}

// jam digital
function updateClock(){
  document.getElementById('clock').textContent = new Date().toLocaleString();
}
setInterval(updateClock,1000);updateClock();

// load semua
function loadAll(){
  loadTable(JADWAL_URL,'#jadwal',4);
  loadTable(INCOMING_URL,'#incoming',2);
  loadTable(ANCHORAGE_URL,'#anchorage',3);
  fetchBanner();
}
loadAll();
setInterval(loadAll,15000);
