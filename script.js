const form = document.querySelector("#abForm");
const saveStatus = document.querySelector("#saveStatus");
const STORAGE_KEY = "pmb_unsiq_ab_testing_worksheet_v1";

const fields = [
  "campaignName", "experimentGoal", "hypothesis", "variationA", "variationB",
  "audience", "channel", "cta", "contentTested", "primaryMetric", "period",
  "visitorsA", "clicksA", "conversionsA", "costA",
  "visitorsB", "clicksB", "conversionsB", "costB",
  "experimentResult", "insight", "finalDecision"
];

const templateData = {
  campaignName: "PMB UNSIQ 2026 - Campaign Instagram Ads Jalur Reguler",
  experimentGoal: "Meningkatkan jumlah klik menuju landing page pendaftaran PMB dan menaikkan jumlah calon mahasiswa yang menghubungi admin melalui WhatsApp.",
  hypothesis: "Jika CTA dibuat lebih spesifik dengan menawarkan konsultasi jurusan gratis, maka calon mahasiswa akan lebih terdorong untuk klik karena manfaat yang diterima terasa lebih jelas dibanding CTA umum.",
  variationA: "Banner dengan CTA 'Daftar Sekarang', visual gedung kampus, dan caption umum tentang pembukaan PMB.",
  variationB: "Banner dengan CTA 'Konsultasi Jurusan Gratis', visual mahasiswa aktif, benefit beasiswa, prospek karier, dan tombol WhatsApp yang lebih menonjol.",
  audience: "Siswa kelas 12 SMA/SMK/MA, gap year, dan orang tua calon mahasiswa di wilayah Jawa Tengah dan sekitarnya.",
  channel: "Instagram Ads",
  cta: "Daftar Sekarang vs Konsultasi Jurusan Gratis",
  contentTested: "CTA, headline, visual banner, caption, dan benefit yang ditampilkan.",
  primaryMetric: "Conversion Rate",
  period: "1-14 Juli 2026",
  visitorsA: 3200,
  clicksA: 186,
  conversionsA: 42,
  costA: 850000,
  visitorsB: 3100,
  clicksB: 244,
  conversionsB: 69,
  costB: 900000,
  experimentResult: "Variasi B menghasilkan conversion rate lebih tinggi dibanding Variasi A. Klik dan jumlah pendaftar juga meningkat meskipun biaya campaign sedikit lebih besar.",
  insight: "CTA yang lebih spesifik dan berorientasi bantuan membuat calon mahasiswa merasa lebih aman untuk memulai interaksi. Konten benefit dan konsultasi lebih kuat dibanding ajakan daftar langsung.",
  finalDecision: "Variasi B dipilih sebagai materi utama campaign berikutnya. Eksperimen lanjutan akan menguji headline program studi, segmentasi audiens, dan format video pendek."
};

function formatPercent(value) {
  if (!Number.isFinite(value)) return "0%";
  return `${value.toFixed(value >= 10 ? 1 : 2)}%`;
}

function formatCurrency(value) {
  if (!Number.isFinite(value) || value <= 0) return "Rp0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}

function getNumber(name) {
  const input = form.elements[name];
  return Number(input?.value || 0);
}

function getFormData() {
  const data = {};
  fields.forEach((field) => {
    data[field] = form.elements[field]?.value ?? "";
  });
  return data;
}

function setFormData(data) {
  fields.forEach((field) => {
    if (form.elements[field] && data[field] !== undefined) {
      form.elements[field].value = data[field];
    }
  });
  updateDashboard();
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getFormData()));
  saveStatus.textContent = "Tersimpan otomatis";
  setTimeout(() => {
    saveStatus.textContent = "Data tersimpan di browser";
  }, 1200);
}

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;
  try {
    setFormData(JSON.parse(saved));
    saveStatus.textContent = "Data terakhir berhasil dimuat";
  } catch (error) {
    console.warn("Data lokal tidak bisa dibaca", error);
  }
}

function updateDashboard() {
  const visitorsA = getNumber("visitorsA");
  const visitorsB = getNumber("visitorsB");
  const clicksA = getNumber("clicksA");
  const clicksB = getNumber("clicksB");
  const conversionsA = getNumber("conversionsA");
  const conversionsB = getNumber("conversionsB");
  const costA = getNumber("costA");
  const costB = getNumber("costB");

  const crA = visitorsA > 0 ? (conversionsA / visitorsA) * 100 : 0;
  const crB = visitorsB > 0 ? (conversionsB / visitorsB) * 100 : 0;
  const uplift = crA > 0 ? ((crB - crA) / crA) * 100 : 0;

  document.querySelector("#crA").textContent = formatPercent(crA);
  document.querySelector("#crB").textContent = formatPercent(crB);
  document.querySelector("#uplift").textContent = formatPercent(uplift);

  let winner = "Belum ada data";
  if (visitorsA > 0 && visitorsB > 0) {
    if (crB > crA) winner = "Variasi B";
    else if (crA > crB) winner = "Variasi A";
    else winner = "Seri";
  }
  document.querySelector("#winner").textContent = winner;

  document.querySelector("#tableVisitorsA").textContent = visitorsA.toLocaleString("id-ID");
  document.querySelector("#tableVisitorsB").textContent = visitorsB.toLocaleString("id-ID");
  document.querySelector("#tableClicksA").textContent = clicksA.toLocaleString("id-ID");
  document.querySelector("#tableClicksB").textContent = clicksB.toLocaleString("id-ID");
  document.querySelector("#tableConversionsA").textContent = conversionsA.toLocaleString("id-ID");
  document.querySelector("#tableConversionsB").textContent = conversionsB.toLocaleString("id-ID");
  document.querySelector("#cpcA").textContent = conversionsA > 0 ? formatCurrency(costA / conversionsA) : "Rp0";
  document.querySelector("#cpcB").textContent = conversionsB > 0 ? formatCurrency(costB / conversionsB) : "Rp0";
}

function exportPDF() {
  saveData();
  document.body.classList.add("print-mode");
  window.print();
  setTimeout(() => document.body.classList.remove("print-mode"), 500);
}

form.addEventListener("input", () => {
  updateDashboard();
  saveData();
});

document.querySelector("#btnTemplate").addEventListener("click", () => {
  setFormData(templateData);
  saveData();
  document.querySelector("#worksheet").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#btnClear").addEventListener("click", () => {
  const confirmed = confirm("Reset semua isian worksheet?");
  if (!confirmed) return;
  localStorage.removeItem(STORAGE_KEY);
  form.reset();
  updateDashboard();
  saveStatus.textContent = "Worksheet direset";
});

document.querySelector("#btnPrint").addEventListener("click", exportPDF);
document.querySelector("#btnExportFloating").addEventListener("click", exportPDF);

document.querySelector("#btnScrollTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

loadData();
updateDashboard();
