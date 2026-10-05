/* ============================================================
   Fungsi bersama untuk halaman siswa & guru
   ============================================================ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const FILE_TYPES = {
  image: ["jpg", "jpeg", "png", "gif", "webp"],
  audio: ["mp3", "wav", "ogg", "m4a", "aac"],
  video: ["mp4", "webm", "mov", "mkv"],
  pdf: ["pdf"],
  doc: ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"]
};
const KIND_LABEL = { image: "Gambar", audio: "Audio", video: "Video", pdf: "PDF", doc: "Dokumen" };
const KIND_SHORT = { image: "IMG", audio: "AUD", video: "VID", pdf: "PDF", doc: "DOC" };

function extOf(name) { return String(name || "").split(".").pop().toLowerCase(); }
function kindOf(name) {
  const e = extOf(name);
  for (const k in FILE_TYPES) if (FILE_TYPES[k].includes(e)) return k;
  return "doc";
}
function isAllowed(name) { return Object.values(FILE_TYPES).flat().includes(extOf(name)); }

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function fmtSize(b) {
  b = Number(b) || 0;
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  if (b < 1073741824) return (b / 1048576).toFixed(1) + " MB";
  return (b / 1073741824).toFixed(2) + " GB";
}
function fmtWaktu(w) {
  const m = String(w || "").match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
  return m ? `${m[3]}/${m[2]}/${m[1]} ${m[4]}:${m[5]}` : (w || "-");
}
function driveUrls(id) {
  return {
    view: `https://drive.google.com/file/d/${id}/view`,
    preview: `https://drive.google.com/file/d/${id}/preview`,
    download: `https://drive.google.com/uc?export=download&id=${id}`,
    thumb: `https://drive.google.com/thumbnail?id=${id}&sz=w160`,
    big: `https://drive.google.com/thumbnail?id=${id}&sz=w1600`
  };
}
function apiReady() { return CONFIG.API_URL && !CONFIG.API_URL.includes("PASTE_URL"); }

/* Semua permintaan memakai text/plain agar tidak memicu preflight CORS di Apps Script */
async function api(payload) {
  if (!apiReady()) throw new Error("URL server belum diisi. Buka config.js dan isi API_URL.");
  const res = await fetch(CONFIG.API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Server menjawab dengan kode " + res.status);
  return res.json();
}

function toast(msg, type = "info") {
  let box = $("#toasts");
  if (!box) { box = document.createElement("div"); box.id = "toasts"; document.body.appendChild(box); }
  const t = document.createElement("div");
  t.className = "toast " + type;
  t.textContent = msg;
  box.appendChild(t);
  setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 300); }, 3800);
}

/* ---------- Dekorasi 3D + jaringan (internet / AI) ---------- */
function cubeHTML(cls = "") {
  return `<div class="cube ${cls}"><i></i><i></i><i></i><i></i><i></i><i></i></div>`;
}

function initDecor() {
  const grid = document.createElement("div");
  grid.className = "grid-floor";
  const shapes = document.createElement("div");
  shapes.className = "shapes";
  shapes.innerHTML = `
    <div class="sh sh1">${cubeHTML("s-md")}</div>
    <div class="sh sh2"><div class="sphere"></div></div>
    <div class="sh sh3"><div class="ring r1"></div><div class="ring r2"></div></div>
    <div class="sh sh4">${cubeHTML("s-sm alt")}</div>`;
  const canvas = document.createElement("canvas");
  canvas.id = "net";
  document.body.prepend(shapes);
  document.body.prepend(grid);
  document.body.prepend(canvas);

  document.addEventListener("mousemove", e => {
    shapes.style.setProperty("--mx", (e.clientX / innerWidth - .5).toFixed(3));
    shapes.style.setProperty("--my", (e.clientY / innerHeight - .5).toFixed(3));
  });

  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w, h, nodes = [];
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    const n = Math.round(Math.min(70, Math.max(24, innerWidth / 22)));
    nodes = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .35 * dpr, vy: (Math.random() - .5) * .35 * dpr,
      r: (Math.random() * 1.4 + .8) * dpr
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    const maxD = 150 * (w / innerWidth);
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      if (!reduce) {
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
      }
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < maxD) {
          ctx.strokeStyle = `rgba(34,228,255,${(1 - d / maxD) * .22})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.fillStyle = "rgba(139,92,246,.8)";
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.283); ctx.fill();
    }
    if (!reduce) requestAnimationFrame(draw);
  }
  resize(); draw();
  addEventListener("resize", () => { resize(); if (reduce) draw(); });
}
document.addEventListener("DOMContentLoaded", initDecor);
