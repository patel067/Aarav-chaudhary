const bubbleHost = document.getElementById("bubbles");
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
let lastDomRipple = 0;
document.addEventListener(
  "pointermove",
  (event) => {
    if (event.pointerType === "touch") return;
    const now = performance.now();
    if (now - lastDomRipple < 85) return;
    lastDomRipple = now;
    const ripple = document.createElement("span");
    ripple.className = "cursor-ripple";
    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;
    document.body.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), {
      once: true,
    });
  },
  { passive: true },
);
if (bubbleHost) {
  const bubbleCount = 26;
  for (let i = 0; i < bubbleCount; i += 1) {
    const bubble = document.createElement("span");
    bubble.className = "bubble";
    const size = 8 + Math.random() * 42;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDuration = `${12 + Math.random() * 20}s`;
    bubble.style.animationDelay = `${-Math.random() * 28}s`;
    bubble.style.opacity = (0.2 + Math.random() * 0.5).toFixed(2);
    bubbleHost.appendChild(bubble);
  }
}
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menuBtn");
if (nav && menuBtn) {
  menuBtn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.textContent = isOpen ? "✕" : "☰";
  });
  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.textContent = "☰";
    }),
  );
}
const details = {
  Projects:
    "A collection of school assignments, experiments and creative ideas. Replace these sample cards with real projects as they are completed.",
  Skills:
    "A growing list of subjects and skills. Add new things here whenever a new skill is practised.",
  Hobbies:
    "Games, reading, drawing, science and all the activities that make learning fun.",
  Achievements:
    "Certificates, school awards, completed challenges and special milestones can be added here.",
};
const backdrop = document.getElementById("modalBackdrop");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
function closeModal() {
  if (backdrop) backdrop.classList.remove("show");
}
document.querySelectorAll("[data-modal]").forEach((card) =>
  card.addEventListener("click", () => {
    const key = card.dataset.modal;
    if (modalTitle) modalTitle.textContent = key;
    if (modalText)
      modalText.textContent =
        details[key] ||
        "This section will grow as new ideas and experiences are added.";
    if (backdrop) backdrop.classList.add("show");
  }),
);
document.getElementById("closeModal")?.addEventListener("click", closeModal);
document.getElementById("modalOkay")?.addEventListener("click", closeModal);
backdrop?.addEventListener("click", (event) => {
  if (event.target === backdrop) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});
const photoInput = document.getElementById("photoInput");
const studentPhoto = document.getElementById("studentPhoto");
const photoWrap = document.querySelector(".photo-wrap");
photoInput?.addEventListener("change", () => {
  const file = photoInput.files && photoInput.files[0];
  if (!file || !file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = () => {
    if (studentPhoto) studentPhoto.src = String(reader.result || "");
    photoWrap?.classList.add("has-photo");
    const placeholder = document.getElementById("photoPlaceholder");
    if (placeholder) placeholder.style.display = "none";
  };
  reader.readAsDataURL(file);
});
const roles = [
  "A Creative Student",
  "A Curious Explorer",
  "A Future Creator",
  "A Young Problem Solver",
];
let roleIndex = 0;
let charIndex = roles[0].length;
let deleting = true;
const typingText = document.getElementById("typingText");
function typeRole() {
  if (!typingText) return;
  const word = roles[roleIndex];
  if (deleting) {
    charIndex -= 1;
    typingText.textContent = word.slice(0, Math.max(0, charIndex));
    if (charIndex <= 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  } else {
    const next = roles[roleIndex];
    charIndex += 1;
    typingText.textContent = next.slice(0, charIndex);
    if (charIndex >= next.length) {
      deleting = true;
      window.setTimeout(typeRole, 1400);
      return;
    }
  }
  window.setTimeout(typeRole, deleting ? 42 : 75);
}
window.setTimeout(typeRole, 1800);
const canvas = document.getElementById("waveCanvas");
const ctx = canvas?.getContext("2d", { alpha: true });
let canvasWidth = 0;
let canvasHeight = 0;
let pixelRatio = 1;
let ripples = [];
let lastRipple = 0;
let lastTouchRipple = 0;
function resizeCanvas() {
  if (!canvas || !ctx) return;
  const viewport = window.visualViewport;
  canvasWidth = Math.max(1, Math.round(viewport?.width || window.innerWidth));
  canvasHeight = Math.max(
    1,
    Math.round(viewport?.height || window.innerHeight),
  );
  pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);
  canvas.width = Math.round(canvasWidth * pixelRatio);
  canvas.height = Math.round(canvasHeight * pixelRatio);
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas, { passive: true });
window.visualViewport?.addEventListener("resize", resizeCanvas, {
  passive: true,
});
function addRipple(x, y, strength = 0.34) {
  ripples.push({ x, y, radius: 2, alpha: strength });
  if (ripples.length > 26) ripples.shift();
}
document.addEventListener(
  "pointerdown",
  (event) => {
    if (event.pointerType === "touch" || event.pointerType === "pen") {
      addRipple(event.clientX, event.clientY, 0.55);
      lastTouchRipple = performance.now();
    }
  },
  { passive: true },
);
document.addEventListener(
  "pointermove",
  (event) => {
    const now = performance.now();
    if (event.pointerType === "touch") {
      if (now - lastTouchRipple > 45) {
        addRipple(event.clientX, event.clientY, 0.38);
        lastTouchRipple = now;
      }
      return;
    }
    if (now - lastRipple > 65) {
      addRipple(event.clientX, event.clientY, 0.34);
      lastRipple = now;
    }
  },
  { passive: true },
);
function drawAmbientWaves(time) {
  if (!ctx) return;
  const startY = canvasHeight * 0.67;
  const waveCount = 7;
  for (let line = 0; line < waveCount; line += 1) {
    const baseY = startY + line * Math.max(11, canvasHeight * 0.018);
    const amplitude = 4 + line * 1.25;
    ctx.beginPath();
    for (let x = -8; x <= canvasWidth + 8; x += 8) {
      const phase = reduceMotion ? 0 : time * (0.00022 + line * 0.000012);
      const y =
        baseY +
        Math.sin(x * (0.007 + line * 0.0004) + phase + line * 0.72) *
          amplitude +
        Math.sin(x * 0.0026 - phase * 0.62) * (2.5 + line * 0.3);
      if (x === -8) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    const alpha = 0.065 + line * 0.008;
    ctx.strokeStyle = `rgba(132, 222, 255, ${alpha})`;
    ctx.lineWidth = line === 0 ? 1.25 : 0.8;
    ctx.shadowBlur = line < 3 ? 7 : 2;
    ctx.shadowColor = "rgba(84, 193, 255, 0.16)";
    ctx.stroke();
  }
  ctx.beginPath();
  const surfaceY = canvasHeight * 0.78;
  for (let x = -8; x <= canvasWidth + 8; x += 8) {
    const phase = reduceMotion ? 0 : time * 0.00016;
    const y =
      surfaceY +
      Math.sin(x * 0.004 + phase) * 10 +
      Math.sin(x * 0.0018 - phase) * 5;
    if (x === -8) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = "rgba(119, 215, 255, 0.10)";
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 14;
  ctx.shadowColor = "rgba(75, 190, 255, 0.17)";
  ctx.stroke();
  ctx.shadowBlur = 0;
}
function drawWaves(now) {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawAmbientWaves(now);
  ripples = ripples.filter((ripple) => ripple.alpha > 0.018);
  ripples.forEach((ripple) => {
    for (let ring = 0; ring < 3; ring += 1) {
      const radius = ripple.radius - ring * 7;
      if (radius <= 0) continue;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${ring === 1 ? "181, 220, 255" : "121, 218, 255"}, ${Math.max(0, ripple.alpha - ring * 0.07)})`;
      ctx.lineWidth = ring === 0 ? 1.5 : 1;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(100, 210, 255, 0.6)";
      ctx.stroke();
    }
    if (!reduceMotion) {
      ripple.radius += 1.45;
      ripple.alpha *= 0.975;
    } else {
      ripple.alpha *= 0.94;
    }
  });
  ctx.shadowBlur = 0;
  window.requestAnimationFrame(drawWaves);
}
window.requestAnimationFrame(drawWaves);
const tiltItems = document.querySelectorAll(".tile, .project, .hero-card");
tiltItems.forEach((element) => {
  element.addEventListener("pointermove", (event) => {
    if (window.matchMedia("(hover: none)").matches || reduceMotion) return;
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    element.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg) translateY(-3px)`;
  });
  element.addEventListener("pointerleave", () => {
    element.style.transform = "";
  });
});
document.getElementById("themeBtn")?.addEventListener("click", () => {
  document.body.classList.toggle("lilac");
  const button = document.getElementById("themeBtn");
  const lilac = document.body.classList.contains("lilac");
  if (button) {
    button.textContent = lilac ? "◑" : "◐";
    button.setAttribute("aria-pressed", String(lilac));
  }
});
const soundButton = document.getElementById("soundBtn");
const musicSelect = document.getElementById("musicSelect");
const backgroundMusic = new Audio();
backgroundMusic.preload = "none";
backgroundMusic.volume = 0.22;
if (soundButton && musicSelect) {
  backgroundMusic.src = musicSelect.value;
  musicSelect.classList.remove("show");
  soundButton.addEventListener("click", async () => {
    if (backgroundMusic.paused) {
      try {
        await backgroundMusic.play();
        soundButton.textContent = "♫ On";
        soundButton.setAttribute("aria-pressed", "true");
        musicSelect.classList.add("show");
      } catch (error) {
        console.error("Music play nahi hua:", error);
        soundButton.textContent = "♫";
        musicSelect.classList.remove("show");
      }
    } else {
      backgroundMusic.pause();
      soundButton.textContent = "♫";
      soundButton.setAttribute("aria-pressed", "false");
      musicSelect.classList.remove("show");
    }
  });
  musicSelect.addEventListener("change", async () => {
    const wasPlaying = !backgroundMusic.paused;
    backgroundMusic.pause();
    backgroundMusic.src = musicSelect.value;
    backgroundMusic.currentTime = 0;
    if (wasPlaying) {
      try {
        await backgroundMusic.play();
        soundButton.textContent = "♫ On";
      } catch (error) {
        soundButton.textContent = "♫";
        soundButton.setAttribute("aria-pressed", "false");
        musicSelect.classList.remove("show");
        console.error("Selected music play nahi hua:", error);
      }
    }
  });
}
document
  .getElementById("backTop")
  ?.addEventListener("click", () =>
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth"
    })
  );
let lastScrollWave = 0;
window.addEventListener(
  "scroll",
  () => {
    if (reduceMotion) return;
    const ocean = document.querySelector(".ocean");
    if (ocean) {
      const y = window.scrollY;
      ocean.style.backgroundPosition =
        `${y * 0.025}px ${y * 0.06}px, ${-y * 0.02}px ${y * 0.035}px, center ${y * 0.08}px, center`;
    }
    if (window.matchMedia("(hover: none)").matches) {
      const now = performance.now();
      if (now - lastScrollWave > 90) {
        const x = window.innerWidth * (0.25 + Math.random() * 0.5);
        const y = window.innerHeight * 0.72;
        addRipple(x, y, 0.4);
        lastScrollWave = now;
      }
    }
  },
  { passive: true }
);
