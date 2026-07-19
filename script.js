/* =========================================================
   KONFIGURASI — ubah semua data asli di sini
========================================================= */
const CONFIG = {
  brideFull: "Enim Masitoh Royani S.Pd",
  bridePartial: "Putri Bungsu Bapak H. Marsun Saifudin & Ibu Hj. Poniyem",
  groomFull: "M. Nur Huda",
  groomPartial: "Putra Kelima Bapak M. Abdul Khodir & Ibu Ngatemi",
  akadDateTimeISO: "2026-07-25T08:00:00+07:00",
  akadDateTimeEndISO: "2026-07-25T10:00:00+07:00", // perkiraan durasi 2 jam, hanya dipakai untuk tombol +Kalender
  resepsiDateTimeISO: "2026-07-25T11:00:00+07:00",
  resepsiDateTimeEndISO: "2026-07-25T13:00:00+07:00", // perkiraan durasi 2 jam, hanya dipakai untuk tombol +Kalender
  venueName: "Kediaman Mempelai Wanita",
  venueAddress: "Jl. Serbajadi, Gg. Setia 1, Desa Pemanggilan, Kec. Natar, Lampung Selatan",
  mapsQuery: "Jl. Serbajadi, Gg. Setia 1, Desa Pemanggilan, Kec. Natar, Lampung Selatan",
  whatsappNumber: "6281234567890", // ganti dengan nomor WA tujuan (format 62xxxxxxxxxx)
  countdownTargetISO: "2026-07-25T08:00:00+07:00"
};

/* =========================================================
   1. NAMA TAMU — dari URL (?to=Nama) untuk isi otomatis,
      atau diketik langsung oleh tamu di kolom cover
========================================================= */
const params = new URLSearchParams(window.location.search);
const guest = params.get('to') || params.get('nama');
const guestNameInput = document.getElementById('guestName');
if (guest) {
  guestNameInput.value = decodeURIComponent(guest);
  guestNameInput.readOnly = true;
  guestNameInput.classList.add('locked');
  document.title = "Undangan Pernikahan untuk " + decodeURIComponent(guest);
}

/* =========================================================
   2. BUKA UNDANGAN — reveal + mulai musik
========================================================= */
const cover = document.getElementById('cover');
const openBtn = document.getElementById('openBtn');
const music = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

// Kunci/buka scroll TANPA membuat lebar halaman berubah saat scrollbar muncul/hilang
function lockScroll(){
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = scrollbarWidth > 0 ? scrollbarWidth + 'px' : '';
}
function unlockScroll(){
  document.body.style.overflow = 'auto';
  document.body.style.paddingRight = '';
}

openBtn.addEventListener('click', () => {
  cover.classList.add('hidden');
  unlockScroll();
  // isi otomatis kolom "Nama" pada form ucapan dengan nama yang diketik tamu
  const typedName = guestNameInput.value.trim();
  if (typedName) {
    const fNameField = document.getElementById('fName');
    if (fNameField) fNameField.value = typedName;
  }
  if (music.querySelector('source').src) {
    music.play().then(() => musicToggle.classList.remove('paused')).catch(() => {});
  }
});
lockScroll();

musicToggle.addEventListener('click', () => {
  if (music.paused) {
    music.play().then(() => musicToggle.classList.remove('paused')).catch(() => {
      alert('Tambahkan berkas musik pada tag <audio id="bgMusic"> di kode untuk mengaktifkan fitur ini.');
    });
  } else {
    music.pause();
    musicToggle.classList.add('paused');
  }
});

/* =========================================================
   3. SCROLL REVEAL
========================================================= */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

/* =========================================================
   4. COUNTDOWN
========================================================= */
function tickCountdown(){
  const target = new Date(CONFIG.countdownTargetISO).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById('cd-d').textContent = String(d).padStart(2,'0');
  document.getElementById('cd-h').textContent = String(h).padStart(2,'0');
  document.getElementById('cd-m').textContent = String(m).padStart(2,'0');
  document.getElementById('cd-s').textContent = String(s).padStart(2,'0');
}
tickCountdown();
setInterval(tickCountdown, 1000);

/* =========================================================
   5. LINK PETA & KALENDER
========================================================= */
const mapsUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.mapsQuery);
document.getElementById('mapBtn').href = mapsUrl;
document.getElementById('mapBtn2').href = mapsUrl;
document.getElementById('mapBtn3').href = mapsUrl;
document.getElementById('venueMap').src = "https://www.google.com/maps?q=" + encodeURIComponent(CONFIG.mapsQuery) + "&output=embed";

function toGCalDate(iso){
  return new Date(iso).toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';
}
function buildCalLink(title, startISO, endISO){
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: toGCalDate(startISO) + '/' + toGCalDate(endISO),
    location: CONFIG.venueName + ', ' + CONFIG.venueAddress,
    details: 'Undangan pernikahan ' + CONFIG.brideFull + ' & ' + CONFIG.groomFull
  });
  return 'https://calendar.google.com/calendar/render?' + p.toString();
}
document.getElementById('calBtn-akad').href = buildCalLink('Akad Nikah', CONFIG.akadDateTimeISO, CONFIG.akadDateTimeEndISO);
document.getElementById('calBtn-resepsi').href = buildCalLink('Resepsi Pernikahan', CONFIG.resepsiDateTimeISO, CONFIG.resepsiDateTimeEndISO);

/* =========================================================
   6. GALERI — duplikasi item agar loop marquee mulus
========================================================= */
const row = document.getElementById('marqueeRow');
row.innerHTML += row.innerHTML;

/* =========================================================
   7. UCAPAN — RSVP pill selection
========================================================= */
let selectedRsvp = '';
document.querySelectorAll('#rsvpOptions button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#rsvpOptions button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedRsvp = btn.dataset.val;
  });
});

/* =========================================================
   8. KIRIM UCAPAN VIA WHATSAPP
========================================================= */
const formStatus = document.getElementById('formStatus');
const sendWa = document.getElementById('sendWa');
sendWa.addEventListener('click', (e) => {
  const name = document.getElementById('fName').value.trim();
  const msg = document.getElementById('fMsg').value.trim();
  if (!name || !msg) {
    e.preventDefault();
    formStatus.textContent = 'Mohon isi nama dan ucapan terlebih dahulu.';
    return;
  }
  formStatus.textContent = '';
  const text = `Assalamu'alaikum, saya ${name}.\nKonfirmasi kehadiran: ${selectedRsvp || '-'}\nUcapan: ${msg}`;
  sendWa.href = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(text);
});

/* =========================================================
   9. SALIN NOMOR REKENING / E-WALLET
========================================================= */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const val = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(val);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = val; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
    }
    const original = btn.textContent;
    btn.textContent = 'Tersalin';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = original; btn.classList.remove('copied'); }, 1800);
  });
});