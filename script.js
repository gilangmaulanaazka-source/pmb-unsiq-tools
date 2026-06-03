const STORAGE_KEY = "pmb_unsiq_marketing_funnel_worksheet_v1";
const form = document.querySelector("#funnelForm");
const saveStatus = document.querySelector("#saveStatus");

const stages = {
  awareness: {
    name: "Awareness",
    title: "Membangun kesadaran dan kedekatan awal",
    description: "Fase ini cocok untuk konten storytelling yang memperkenalkan identitas kampus, kehidupan mahasiswa, nilai pesantren, prestasi, dan peluang masa depan tanpa langsung memaksa daftar.",
    contents: ["Storytelling mahasiswa", "Video kehidupan kampus", "Konten nilai kampus Islami", "Reels/TikTok edukatif ringan", "Prestasi dan kegiatan kampus"],
    channels: ["Instagram Reels", "TikTok", "YouTube Shorts", "Meta Ads reach", "Konten organik komunitas sekolah"],
    ctas: ["Kenali UNSIQ lebih dekat", "Lihat kehidupan mahasiswa", "Ikuti info PMB", "Cari tahu pilihan prodi"],
    metrics: ["Reach", "Impression", "Video views", "Profile visit", "Follower growth"],
    diagnosis: "Jika reach tinggi tetapi interest rendah, konten mungkin belum cukup relevan, hook lemah, atau pesan belum menyentuh kebutuhan calon mahasiswa."
  },
  interest: {
    name: "Interest",
    title: "Mengubah perhatian menjadi rasa ingin tahu",
    description: "Fase interest membutuhkan konten yang menjawab rasa penasaran awal: jurusan, biaya, pengalaman mahasiswa, suasana kampus, dan alasan mengapa UNSIQ layak dipertimbangkan.",
    contents: ["FAQ singkat PMB", "Carousel alasan memilih UNSIQ", "Konten myth vs fact", "Q&A jurusan", "Behind the scene layanan PMB"],
    channels: ["Instagram Story", "Carousel Instagram", "Live Q&A", "TikTok edukatif", "WhatsApp status"],
    ctas: ["Tanya admin PMB", "Cek program studi", "Simpan info ini", "Kirim pertanyaanmu"],
    metrics: ["Engagement rate", "Saves", "Shares", "Klik profil", "DM/komentar"],
    diagnosis: "Jika engagement ada tetapi lead rendah, audiens mungkin tertarik tetapi belum menemukan jalur tindakan yang jelas atau belum percaya untuk lanjut."
  },
  consideration: {
    name: "Consideration",
    title: "Membantu calon mahasiswa membandingkan dan percaya",
    description: "Fase ini fokus pada informasi yang lebih rasional dan meyakinkan: akreditasi, biaya, beasiswa, fasilitas, prospek karier, testimoni, dan perbandingan program studi.",
    contents: ["Comparison program studi", "Konten biaya dan beasiswa", "Testimoni mahasiswa/alumni", "Prospek kerja lulusan", "Panduan memilih jurusan"],
    channels: ["Landing page PMB", "Artikel website", "YouTube explainer", "Webinar/open house", "WhatsApp consultation"],
    ctas: ["Bandingkan program studi", "Download brosur", "Konsultasi jurusan gratis", "Lihat biaya dan beasiswa"],
    metrics: ["Landing page visit", "Brochure download", "WhatsApp lead", "Webinar registration", "Time on page"],
    diagnosis: "Jika banyak audiens berhenti di fase consideration, informasi penting mungkin belum lengkap, trust signal kurang kuat, atau landing page belum menjawab keberatan utama."
  },
  intent: {
    name: "Intent",
    title: "Mendorong niat menjadi tindakan awal",
    description: "Fase intent membutuhkan CTA yang jelas, form yang mudah, follow-up cepat, dan pesan yang mengurangi keraguan sebelum calon mahasiswa benar-benar submit pendaftaran.",
    contents: ["Reminder deadline", "Step-by-step cara daftar", "Simulasi pengisian form", "Konten benefit daftar lebih awal", "Retargeting untuk pengunjung landing page"],
    channels: ["Landing page", "WhatsApp admin", "Retargeting ads", "Email/SMS reminder", "Instagram Story CTA"],
    ctas: ["Mulai daftar sekarang", "Lanjutkan pendaftaran", "Chat admin PMB", "Amankan kuota gelombang ini"],
    metrics: ["Klik tombol daftar", "Start form", "WhatsApp click", "Abandoned form", "Lead response time"],
    diagnosis: "Jika intent tinggi tetapi conversion rendah, kemungkinan ada hambatan teknis, form terlalu panjang, biaya belum jelas, atau follow-up admin belum cukup cepat."
  },
  conversion: {
    name: "Conversion",
    title: "Mengubah niat menjadi pendaftar",
    description: "Fase conversion memastikan calon mahasiswa menyelesaikan pendaftaran. Fokusnya pada kemudahan proses, kejelasan instruksi, tracking, dan follow-up sampai submit.",
    contents: ["Checklist dokumen", "Tutorial daftar", "Reminder batas waktu", "Pesan reassurance", "Bantuan admin real-time"],
    channels: ["Form PMB", "WhatsApp follow-up", "Email confirmation", "CRM sederhana", "Call center PMB"],
    ctas: ["Submit pendaftaran", "Lengkapi berkas", "Konfirmasi pembayaran", "Hubungi admin jika terkendala"],
    metrics: ["Jumlah pendaftar", "Conversion rate", "Cost per registration", "Form completion rate", "Drop-off form"],
    diagnosis: "Jika conversion rendah, audit harus dilakukan pada form, kecepatan follow-up, kejelasan biaya, alur pembayaran, dan tracking sumber lead."
  },
  advocacy: {
    name: "Retention / Advocacy",
    title: "Menguatkan keputusan dan membentuk rekomendasi",
    description: "Setelah pendaftaran, pengalaman calon mahasiswa tetap penting. Follow-up daftar ulang, konten mahasiswa baru, testimoni, dan referral dapat memperkuat kepercayaan serta menarik calon mahasiswa lain.",
    contents: ["Welcome content", "Testimoni mahasiswa baru", "Konten alumni", "Referral campaign", "Cerita orang tua/mahasiswa"],
    channels: ["WhatsApp group", "Email onboarding", "Instagram story", "Community ambassador", "Konten alumni"],
    ctas: ["Ajak teman daftar", "Bagikan pengalamanmu", "Lengkapi daftar ulang", "Ikuti grup mahasiswa baru"],
    metrics: ["Daftar ulang", "Referral", "Testimonial collected", "Share rate", "Retention to enrollment"],
    diagnosis: "Jika daftar ulang atau referral rendah, pengalaman pasca-pendaftaran perlu diperbaiki melalui komunikasi yang lebih jelas, personal, dan konsisten."
  }
};

const fields = [
  "campaignName", "campaignPeriod", "mainAudience", "persona", "mainProblem",
  "awarenessCount", "awarenessNote", "interestCount", "interestNote",
  "considerationCount", "considerationNote", "intentCount", "intentNote",
  "conversionCount", "conversionNote", "advocacyCount", "advocacyNote",
  "priorityStrategy", "experimentPlan", "actionPlan"
];

const recommendations = {
  awareness: "Perkuat hook storytelling, segmentasi konten, dan distribusi video pendek.",
  interest: "Perjelas CTA mikro, jawab FAQ, dan buat konten interaktif.",
  consideration: "Lengkapi informasi biaya, beasiswa, prodi, trust signal, dan testimoni.",
  intent: "Sederhanakan form, optimasi CTA, dan percepat respons admin.",
  conversion: "Audit alur daftar, tracking, pembayaran, dan follow-up sampai submit.",
  advocacy: "Bangun onboarding, testimoni, referral, dan komunitas mahasiswa baru."
};

const template = {
  campaignName: "PMB UNSIQ 2026 - Campaign Gelombang 1",
  campaignPeriod: "1 Juli - 31 Agustus 2026",
  mainAudience: "Siswa kelas 12 SMA/SMK/MA, gap year, dan orang tua calon mahasiswa di Jawa Tengah dan sekitarnya.",
  persona: "Calon mahasiswa yang mencari kampus Islami, pilihan prodi relevan, biaya terjangkau, dan lingkungan akademik yang mendukung.",
  mainProblem: "Reach konten cukup tinggi, tetapi klik ke WhatsApp dan submit pendaftaran belum optimal. Banyak calon mahasiswa membutuhkan informasi biaya, beasiswa, prospek kerja, dan panduan memilih jurusan.",
  awarenessCount: 50000,
  awarenessNote: "Konten video kampus, storytelling mahasiswa, dan informasi pembukaan PMB menjangkau banyak audiens.",
  interestCount: 6200,
  interestNote: "Audiens mulai menyimpan konten, bertanya di komentar, dan mengunjungi profil PMB.",
  considerationCount: 1800,
  considerationNote: "Lead mencari informasi biaya, prodi, beasiswa, akreditasi, fasilitas, dan prospek kerja.",
  intentCount: 650,
  intentNote: "Sebagian calon mahasiswa klik WhatsApp dan tombol daftar, tetapi masih banyak yang bertanya ulang sebelum submit.",
  conversionCount: 240,
  conversionNote: "Pendaftar masuk dari WhatsApp, landing page, dan referral. Drop-off terjadi saat pengisian form dan konfirmasi berkas.",
  advocacyCount: 90,
  advocacyNote: "Sebagian pendaftar membagikan info PMB ke teman dan mengikuti grup mahasiswa baru.",
  priorityStrategy: "Optimasi fase Consideration dan Intent dengan konten biaya, beasiswa, prospek kerja, panduan jurusan, CTA konsultasi, dan follow-up WhatsApp yang lebih cepat.",
  experimentPlan: "Uji CTA 'Konsultasi Jurusan Gratis' vs 'Daftar Sekarang' pada Instagram Ads dan landing page. Uji juga konten testimoni alumni vs konten biaya/beasiswa.",
  actionPlan: "Buat 5 konten storytelling awareness, 4 konten FAQ, 3 konten comparison prodi, 2 landing page CTA, tracking UTM untuk semua channel, dan dashboard weekly funnel."
};

function renderStage(stageKey) {
  const stage = stages[stageKey];
  document.querySelector("#stagePill").textContent = stage.name;
  document.querySelector("#stageTitle").textContent = stage.title;
  document.querySelector("#stageDescription").textContent = stage.description;
  document.querySelector("#diagnosisText").textContent = stage.diagnosis;

  fillList("#contentList", stage.contents);
  fillList("#channelList", stage.channels);
  fillList("#ctaList", stage.ctas);
  fillList("#metricList", stage.metrics);

  document.querySelectorAll(".funnel-step").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.stage === stageKey);
  });
}

function fillList(selector, items) {
  const list = document.querySelector(selector);
  list.innerHTML = items.map(item => `<li>${item}</li>`).join("");
}

function renderStrategyTable() {
  const tbody = document.querySelector("#strategyTable");
  tbody.innerHTML = Object.values(stages).map(stage => `
    <tr>
      <td><strong>${stage.name}</strong></td>
      <td>${stage.title}</td>
      <td>${stage.contents.slice(0, 3).join(", ")}</td>
      <td>${stage.ctas.slice(0, 2).join(", ")}</td>
      <td>${stage.metrics.slice(0, 3).join(", ")}</td>
    </tr>
  `).join("");
}

function getNumber(name) {
  return Number(form.elements[name]?.value || 0);
}

function pct(value) {
  if (!Number.isFinite(value)) return "0%";
  return `${value.toFixed(value >= 10 ? 1 : 2)}%`;
}

function fmt(value) {
  return Number(value || 0).toLocaleString("id-ID");
}

function calculateDashboard() {
  const order = [
    ["awareness", "Awareness", getNumber("awarenessCount")],
    ["interest", "Interest", getNumber("interestCount")],
    ["consideration", "Consideration", getNumber("considerationCount")],
    ["intent", "Intent", getNumber("intentCount")],
    ["conversion", "Conversion", getNumber("conversionCount")],
    ["advocacy", "Retention / Advocacy", getNumber("advocacyCount")]
  ];

  const awareness = order[0][2];
  const conversion = order[4][2];
  const overall = awareness > 0 ? (conversion / awareness) * 100 : 0;

  document.querySelector("#statAwareness").textContent = fmt(awareness);
  document.querySelector("#statConversion").textContent = fmt(conversion);
  document.querySelector("#statOverall").textContent = pct(overall);
  document.querySelector("#heroHealth").textContent = awareness > 0 ? pct(overall) : "Belum dihitung";

  let maxDrop = -1;
  let priorityKey = "";
  let priorityName = "Belum ada data";

  const rows = order.map((current, index) => {
    const [key, name, count] = current;
    let conversionToStage = index === 0 ? 100 : 0;
    let dropOff = index === 0 ? 0 : 0;

    if (index > 0) {
      const previous = order[index - 1][2];
      conversionToStage = previous > 0 ? (count / previous) * 100 : 0;
      dropOff = previous > 0 ? ((previous - count) / previous) * 100 : 0;
      if (dropOff > maxDrop && previous > 0) {
        maxDrop = dropOff;
        priorityKey = key;
        priorityName = name;
      }
    }

    return `
      <tr>
        <td><strong>${name}</strong></td>
        <td>${fmt(count)}</td>
        <td>${index === 0 ? "-" : pct(conversionToStage)}</td>
        <td>${index === 0 ? "-" : pct(Math.max(dropOff, 0))}</td>
        <td>${recommendations[key]}</td>
      </tr>
    `;
  }).join("");

  document.querySelector("#dashboardRows").innerHTML = rows;
  document.querySelector("#statPriority").textContent = maxDrop >= 0 ? priorityName : "Belum ada data";
}

function getFormData() {
  const data = {};
  fields.forEach(field => data[field] = form.elements[field]?.value ?? "");
  return data;
}

function setFormData(data) {
  fields.forEach(field => {
    if (form.elements[field] && data[field] !== undefined) form.elements[field].value = data[field];
  });
  calculateDashboard();
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getFormData()));
  saveStatus.textContent = "Tersimpan otomatis";
  setTimeout(() => saveStatus.textContent = "Data tersimpan di browser", 1100);
}

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;
  try {
    setFormData(JSON.parse(saved));
    saveStatus.textContent = "Data terakhir dimuat";
  } catch (error) {
    console.warn(error);
  }
}

document.querySelectorAll(".funnel-step").forEach(btn => {
  btn.addEventListener("click", () => renderStage(btn.dataset.stage));
});

form.addEventListener("input", () => {
  calculateDashboard();
  saveData();
});

document.querySelector("#fillTemplate").addEventListener("click", () => {
  setFormData(template);
  saveData();
  document.querySelector("#worksheet").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#resetData").addEventListener("click", () => {
  if (!confirm("Reset semua data worksheet?")) return;
  localStorage.removeItem(STORAGE_KEY);
  form.reset();
  calculateDashboard();
  saveStatus.textContent = "Worksheet direset";
});

function exportPdf() {
  saveData();
  window.print();
}

document.querySelector("#printPage").addEventListener("click", exportPdf);
document.querySelector("#printFloating").addEventListener("click", exportPdf);
document.querySelector("#toTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

renderStage("awareness");
renderStrategyTable();
loadData();
calculateDashboard();
