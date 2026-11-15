/* =========================================================
   Ernest Win Montes — Portfolio interactions
   ========================================================= */
(() => {
  "use strict";
  document.documentElement.classList.remove("no-js");

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Certificate data ---------- */
  const CERTS = [
    {
      img: "assets/certs/certiport-html-css.jpg",
      title: "Information Technology Specialist: HTML and CSS",
      kind: "Certification",
      issuer: "Certiport · Pearson",
      date: "October 29, 2026",
      verify: "w9W8q-FaSY",
      feature: true,
    },
    {
      img: "assets/certs/wadhwani-jobready-ai.jpg",
      title: "Employability Skills: JobReady (With AI), Advanced Level",
      kind: "Skill readiness · 75 hours",
      issuer: "Wadhwani Foundation",
      date: "November 4, 2026",
    },
    {
      img: "assets/certs/database-101.jpg",
      title: "Database 101: Data Storage, SQL and Query Optimization",
      kind: "Training",
      issuer: "UpskillTechPH",
      date: "August 21, 2026",
    },
    {
      img: "assets/certs/ai-tools-101.jpg",
      title: "AI Tools 101: How to Use Google Gemini Like a Pro",
      kind: "Training",
      issuer: "UpskillTechPH",
      date: "August 22, 2026",
    },
    {
      img: "assets/certs/learning-advocate-2026.jpg",
      title: "Learning Advocate 2026 Series: Emerging IT Innovations",
      kind: "Training",
      issuer: "UpskillTechPH",
      date: "August 22, 2026",
    },
    {
      img: "assets/certs/it-training-summit-2024.jpg",
      title: "3rd International Training Summit and Research Conference on IT",
      kind: "Conference",
      issuer: "NEUST · College of ICT",
      date: "November 20–21, 2024",
    },
    {
      img: "assets/certs/tesda-estem.jpg",
      title: "English for Science, Technology, Engineering and Mathematics (eSTEM)",
      kind: "Course completion",
      issuer: "TESDA Online Program",
      date: "September 6, 2023",
    },
  ];

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function renderCerts() {
    const host = $("#certs");
    if (!host) return;
    host.innerHTML = CERTS.map((c, i) => `
      <button type="button" class="cert glass reveal${c.feature ? " cert--feature" : ""}" data-index="${i}" aria-label="View certificate: ${esc(c.title)}">
        <span class="cert__thumb"><img src="${esc(c.img)}" alt="" loading="lazy" decoding="async"></span>
        <span class="cert__body">
          <span class="cert__kind">${esc(c.kind)}</span>
          <span class="cert__title">${esc(c.title)}</span>
          <span class="cert__meta">${esc(c.issuer)} · ${esc(c.date)}</span>
          ${c.verify ? `<span class="cert__verify">Verify at verify.certiport.com · <code>${esc(c.verify)}</code></span>` : ""}
        </span>
      </button>`).join("");
    $$(".cert", host).forEach((btn) => btn.addEventListener("click", () => Viewer.open(+btn.dataset.index)));
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const items = $$(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        // stagger siblings that enter together
        const siblings = $$(".reveal", el.parentElement).filter((s) => !s.classList.contains("is-in"));
        const delay = Math.max(0, siblings.indexOf(el)) * 70;
        el.style.transitionDelay = `${Math.min(delay, 350)}ms`;
        el.classList.add("is-in");
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach((el) => io.observe(el));
  }

  /* ---------- Active nav link ---------- */
  function initNav() {
    const links = $$(".nav__links a");
    const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const sections = [...map.keys()].map((id) => document.getElementById(id)).filter(Boolean);
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const link = map.get(e.target.id);
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.remove("is-current"));
          if (link && !link.classList.contains("nav__cta")) link.classList.add("is-current");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => io.observe(s));
  }

  /* ---------- Project filters ---------- */
  function initFilters() {
    const chips = $$(".filters .chip");
    const cards = $$(".project");
    chips.forEach((chip) => chip.addEventListener("click", () => {
      const f = chip.dataset.filter;
      chips.forEach((c) => {
        const on = c === chip;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", on);
      });
      cards.forEach((card) => {
        const show = f === "all" || card.dataset.cat === f;
        card.classList.toggle("is-hidden", !show);
        if (show && !reduceMotion) {
          card.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }],
            { duration: 450, easing: "cubic-bezier(.2,.7,.2,1)" });
        }
      });
    }));
  }

  /* ---------- Habit tracker art (deterministic grid) ---------- */
  function drawHabitArt() {
    const g = $(".habit-grid");
    if (!g) return;
    const ns = "http://www.w3.org/2000/svg";
    let seed = 7;
    const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const cols = 14, rows = 5, size = 15, gap = 5;
    const x0 = (320 - (cols * (size + gap) - gap)) / 2;
    const y0 = (150 - (rows * (size + gap) - gap)) / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const rect = document.createElementNS(ns, "rect");
        const streak = c > 4 && rand() > 0.18;
        const op = streak ? 0.35 + rand() * 0.55 : rand() * 0.18 + 0.07;
        rect.setAttribute("x", x0 + c * (size + gap));
        rect.setAttribute("y", y0 + r * (size + gap));
        rect.setAttribute("width", size);
        rect.setAttribute("height", size);
        rect.setAttribute("rx", 4);
        rect.setAttribute("fill-opacity", op.toFixed(2));
        g.appendChild(rect);
      }
    }
  }

  /* ---------- GitHub contribution calendar ---------- */
  async function loadContributions() {
    const host = $("#contrib");
    const totalEl = $("#contrib-total");
    if (!host) return;
    const user = "lolgamebot";
    try {
      const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`);
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      const days = data.contributions || [];
      if (!days.length) throw new Error("empty");
      const total = data.total && (data.total.lastYear ?? Object.values(data.total)[0]);
      totalEl.textContent = (total ?? days.reduce((n, d) => n + d.count, 0)).toLocaleString();

      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const frag = document.createDocumentFragment();
      const first = new Date(days[0].date + "T00:00:00");
      const lead = first.getDay(); // pad so weeks start on Sunday
      const cells = Array(lead).fill(null).concat(days);
      const weeks = Math.ceil(cells.length / 7);
      let lastMonth = -1;

      for (let w = 0; w < weeks; w++) {
        const week = cells.slice(w * 7, w * 7 + 7);
        const firstReal = week.find(Boolean);
        const label = document.createElement("span");
        label.className = "m";
        label.style.gridColumn = w + 1;
        if (firstReal) {
          const m = new Date(firstReal.date + "T00:00:00").getMonth();
          if (m !== lastMonth && w < weeks - 1) { label.textContent = months[m]; lastMonth = m; }
        }
        frag.appendChild(label);
        for (let d = 0; d < 7; d++) {
          const day = week[d];
          const cell = document.createElement("span");
          cell.className = "d" + (day ? "" : " pad");
          cell.style.gridColumn = w + 1;
          cell.style.gridRow = d + 2;
          if (day) {
            cell.dataset.l = day.level;
            const when = new Date(day.date + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
            cell.title = `${day.count} contribution${day.count === 1 ? "" : "s"} on ${when}`;
          }
          frag.appendChild(cell);
        }
      }
      host.replaceChildren(frag);
      // show most recent weeks first on narrow screens
      const scroller = host.parentElement;
      scroller.scrollLeft = scroller.scrollWidth;
    } catch (err) {
      totalEl.textContent = "—";
      host.innerHTML = `<p class="contrib-empty">The activity graph couldn't load right now. <a class="link-arrow" href="https://github.com/${user}" target="_blank" rel="noopener">See it on GitHub</a></p>`;
      host.style.display = "block";
    }
  }

  /* ---------- Certificate viewer (zoom / pan / pinch) ---------- */
  const Viewer = (() => {
    const root = $("#viewer");
    const stage = $("#viewer-stage");
    const img = $("#viewer-img");
    const title = $("#viewer-title");
    const count = $("#viewer-count");
    let index = 0, scale = 1, tx = 0, ty = 0, lastFocus = null;
    const pointers = new Map();
    let pinchStart = null, dragStart = null;

    const apply = () => { img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`; };
    const reset = () => { scale = 1; tx = 0; ty = 0; apply(); };

    function zoomAt(newScale, cx, cy) {
      const rect = stage.getBoundingClientRect();
      const px = cx - rect.left - rect.width / 2;
      const py = cy - rect.top - rect.height / 2;
      newScale = Math.min(6, Math.max(1, newScale));
      const k = newScale / scale;
      tx = px - (px - tx) * k;
      ty = py - (py - ty) * k;
      scale = newScale;
      if (scale === 1) { tx = 0; ty = 0; }
      apply();
    }

    function show(i) {
      index = (i + CERTS.length) % CERTS.length;
      const c = CERTS[index];
      img.src = c.img;
      img.alt = `Certificate: ${c.title}`;
      title.textContent = c.title;
      count.textContent = `${index + 1} / ${CERTS.length}`;
      reset();
    }

    function open(i) {
      lastFocus = document.activeElement;
      root.hidden = false;
      document.body.style.overflow = "hidden";
      show(i);
      $("[data-close].viewer__btn", root).focus();
    }

    function close() {
      root.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }

    $$("[data-close]", root).forEach((el) => el.addEventListener("click", close));
    $("#viewer-prev").addEventListener("click", () => show(index - 1));
    $("#viewer-next").addEventListener("click", () => show(index + 1));

    document.addEventListener("keydown", (e) => {
      if (root.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(index - 1);
      else if (e.key === "ArrowRight") show(index + 1);
      else if (e.key === "+" || e.key === "=") { const r = stage.getBoundingClientRect(); zoomAt(scale * 1.25, r.left + r.width / 2, r.top + r.height / 2); }
      else if (e.key === "-") { const r = stage.getBoundingClientRect(); zoomAt(scale / 1.25, r.left + r.width / 2, r.top + r.height / 2); }
      else if (e.key === "0") reset();
      else if (e.key === "Tab") {
        // simple focus trap
        const f = $$("button", root);
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    stage.addEventListener("wheel", (e) => {
      e.preventDefault();
      zoomAt(scale * Math.exp(-e.deltaY * 0.0015), e.clientX, e.clientY);
    }, { passive: false });

    stage.addEventListener("dblclick", (e) => {
      if (scale > 1) reset(); else zoomAt(2.5, e.clientX, e.clientY);
    });

    stage.addEventListener("pointerdown", (e) => {
      stage.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchStart = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale };
        dragStart = null;
      } else if (pointers.size === 1) {
        dragStart = { x: e.clientX - tx, y: e.clientY - ty };
        stage.classList.add("is-dragging");
      }
    });

    stage.addEventListener("pointermove", (e) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2 && pinchStart) {
        const [a, b] = [...pointers.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        zoomAt(pinchStart.scale * (dist / pinchStart.dist), (a.x + b.x) / 2, (a.y + b.y) / 2);
      } else if (dragStart && scale > 1) {
        tx = e.clientX - dragStart.x;
        ty = e.clientY - dragStart.y;
        apply();
      }
    });

    const endPointer = (e) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchStart = null;
      if (pointers.size === 1) {
        const p = [...pointers.values()][0];
        dragStart = { x: p.x - tx, y: p.y - ty };
      } else if (pointers.size === 0) {
        // swipe to change certificate when not zoomed
        if (dragStart && scale === 1) {
          const dx = e.clientX - (dragStart.x + tx);
          if (Math.abs(dx) > 60) show(index + (dx < 0 ? 1 : -1));
        }
        dragStart = null;
        stage.classList.remove("is-dragging");
      }
    };
    stage.addEventListener("pointerup", endPointer);
    stage.addEventListener("pointercancel", endPointer);

    return { open };
  })();

  /* ---------- Copy email ---------- */
  function initCopy() {
    const btn = $("#copy-email");
    const toast = $("#toast");
    if (!btn) return;
    let timer;
    btn.addEventListener("click", async () => {
      const email = btn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        toast.textContent = "Email copied to clipboard.";
      } catch {
        toast.textContent = email;
      }
      clearTimeout(timer);
      timer = setTimeout(() => { toast.textContent = ""; }, 2600);
    });
  }

  /* ---------- Hero parallax (mouse only) ---------- */
  function initHeroParallax() {
    const hero = $(".hero");
    const stage = $("#stage");
    if (!hero || !stage || reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
    const chips = $$("[data-depth]", stage);
    const portrait = $(".portrait", stage);
    let raf = 0, tx = 0, ty = 0;
    const apply = () => {
      raf = 0;
      chips.forEach((c) => {
        const d = parseFloat(c.dataset.depth) || 1;
        c.style.setProperty("--px", `${(tx * 10 * d).toFixed(1)}px`);
        c.style.setProperty("--py", `${(ty * 10 * d).toFixed(1)}px`);
      });
      // Tilt is rendered flat (no shared 3D space), so it can never cut through the card behind.
      portrait.style.transform = `perspective(900px) rotateY(${(tx * 5).toFixed(2)}deg) rotateX(${(-ty * 5).toFixed(2)}deg) rotate(-3deg)`;
    };
    hero.addEventListener("pointermove", (e) => {
      const r = stage.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width * 1.2)));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height * 1.2)));
      if (!raf) raf = requestAnimationFrame(apply);
    });
    hero.addEventListener("pointerleave", () => { tx = 0; ty = 0; portrait.style.transform = ""; if (!raf) raf = requestAnimationFrame(apply); });
  }

  /* ---------- Boot ---------- */
  $("#year").textContent = new Date().getFullYear();
  renderCerts();
  drawHabitArt();
  initReveal();
  initNav();
  initFilters();
  initCopy();
  initHeroParallax();
  loadContributions();
})();
