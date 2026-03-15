class CongresoCarousel {
  constructor(root, opts = {}) {
    this.root = root;
    this.viewport = root.querySelector(".congresoCarousel-viewport");
    this.track = root.querySelector(".congresoCarousel-track");
    this.slides = Array.from(root.querySelectorAll(".congresoCarousel-slide"));
    this.prevBtn = root.querySelector(".congresoCarousel-prev");
    this.nextBtn = root.querySelector(".congresoCarousel-next");
    this.pagination = root.querySelector(".congresoCarousel-pagination");
    this.progressBar = root.querySelector(".congresoCarousel-progressBar");

    this.n = this.slides.length;
    this.state = {
      index: 0,
      pos: 0,
      width: 0,
      height: 0,
      gap: 28,
      dragging: false,
      pointerId: null,
      x0: 0,
      v: 0,
      t0: 0,
      animating: false,
      hovering: false,
      startTime: 0,
      pausedAt: 0,
      rafId: 0
    };

    this.opts = Object.assign(
      {
        gap: 28,
        peek: 0.12,
        rotateY: 32,
        zDepth: 140,
        scaleDrop: 0.08,
        blurMax: 1.5,
        activeLeftBias: 0.3,
        interval: 5000,
        transitionMs: 900,
        keyboard: true,
        breakpoints: [
          {
            mq: "(max-width: 1200px)",
            gap: 24,
            peek: 0.1,
            rotateY: 28,
            zDepth: 120,
            scaleDrop: 0.075,
            activeLeftBias: 0.28
          },
          {
            mq: "(max-width: 1000px)",
            gap: 20,
            peek: 0.08,
            rotateY: 24,
            zDepth: 100,
            scaleDrop: 0.07,
            activeLeftBias: 0.26
          },
          {
            mq: "(max-width: 768px)",
            gap: 16,
            peek: 0.06,
            rotateY: 18,
            zDepth: 80,
            scaleDrop: 0.065,
            activeLeftBias: 0.24
          },
          {
            mq: "(max-width: 560px)",
            gap: 12,
            peek: 0.04,
            rotateY: 12,
            zDepth: 60,
            scaleDrop: 0.055,
            activeLeftBias: 0.22
          }
        ]
      },
      opts
    );

    this._init();
  }

  _init() {
    this._setupDots();
    this._bind();
    this._preloadImages();
    this._measure();
    this.goTo(0, false);
    this._startCycle();
    this._loop();
  }

  _preloadImages() {
    this.slides.forEach((sl) => {
      const card = sl.querySelector(".congresoCard");
      const bg = getComputedStyle(card).getPropertyValue("--congresoCard-bg");
      const m = /url\((?:'|")?([^'")]+)(?:'|")?\)/.exec(bg);
      if (m && m[1]) {
        const img = new Image();
        img.src = m[1];
      }
    });
  }

  _setupDots() {
    this.pagination.innerHTML = "";
    this.dots = this.slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "congresoCarousel-dot";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", `Ir a diapositiva ${i + 1}`);
      b.setAttribute("aria-selected", i === 0 ? "true" : "false");
      b.addEventListener("click", () => {
        this.goTo(i);
      });
      this.pagination.appendChild(b);
      return b;
    });
  }

  _bind() {
    this.prevBtn.addEventListener("click", () => this.prev());
    this.nextBtn.addEventListener("click", () => this.next());

    if (this.opts.keyboard) {
      this.root.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") this.prev();
        if (e.key === "ArrowRight") this.next();
      });
    }

    const pe = this.viewport;
    pe.addEventListener("pointerdown", (e) => this._onDragStart(e));
    pe.addEventListener("pointermove", (e) => this._onDragMove(e));
    pe.addEventListener("pointerup", (e) => this._onDragEnd(e));
    pe.addEventListener("pointercancel", (e) => this._onDragEnd(e));

    this.root.addEventListener("mouseenter", () => {
      this.state.hovering = true;
      this.state.pausedAt = performance.now();
    });

    this.root.addEventListener("mouseleave", () => {
      if (this.state.pausedAt) {
        this.state.startTime += performance.now() - this.state.pausedAt;
        this.state.pausedAt = 0;
      }
      this.state.hovering = false;
    });

    this.ro = new ResizeObserver(() => this._measure());
    this.ro.observe(this.viewport);

    this.opts.breakpoints.forEach((bp) => {
      const m = window.matchMedia(bp.mq);
      const apply = () => {
        Object.keys(bp).forEach((k) => {
          if (k !== "mq") this.opts[k] = bp[k];
        });
        this._measure();
        this._render();
      };
      if (m.addEventListener) m.addEventListener("change", apply);
      else m.addListener(apply);
      if (m.matches) apply();
    });

    this.viewport.addEventListener("pointermove", (e) => this._onTilt(e));
    window.addEventListener("orientationchange", () =>
      setTimeout(() => this._measure(), 250)
    );
  }

  _measure() {
    const viewRect = this.viewport.getBoundingClientRect();
    const rootRect = this.root.getBoundingClientRect();
    const pagRect = this.pagination.getBoundingClientRect();
    const bottomGap = Math.max(
      12,
      Math.round(rootRect.bottom - pagRect.bottom)
    );
    const pagSpace = pagRect.height + bottomGap;
    const availH = viewRect.height - pagSpace;
    const cardH = Math.max(340, Math.min(720, Math.round(availH)));

    this.state.width = viewRect.width;
    this.state.height = viewRect.height;
    this.state.gap = this.opts.gap;
    this.slideW = Math.min(920, this.state.width * (1 - this.opts.peek * 2));

    this.root.style.setProperty("--congresoPagH", `${pagSpace}px`);
    this.root.style.setProperty("--congresoCardH", `${cardH}px`);
  }

  _onTilt(e) {
    const r = this.viewport.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width - 0.5;
    const my = (e.clientY - r.top) / r.height - 0.5;
    this.root.style.setProperty("--congresotTiltX", (my * -5).toFixed(3));
    this.root.style.setProperty("--congresotTiltY", (mx * 5).toFixed(3));
  }

  _onDragStart(e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    this.state.dragging = true;
    this.state.pointerId = e.pointerId;
    this.viewport.setPointerCapture(e.pointerId);
    this.state.x0 = e.clientX;
    this.state.t0 = performance.now();
    this.state.v = 0;
    this.state.pausedAt = performance.now();
  }

  _onDragMove(e) {
    if (!this.state.dragging || e.pointerId !== this.state.pointerId) return;
    const dx = e.clientX - this.state.x0;
    const dt = Math.max(16, performance.now() - this.state.t0);
    this.state.v = dx / dt;
    const slideSpan = this.slideW + this.state.gap;
    this.state.pos = this._mod(this.state.index - dx / slideSpan, this.n);
    this._render();
  }

  _onDragEnd(e) {
    if (!this.state.dragging || (e && e.pointerId !== this.state.pointerId))
      return;
    this.state.dragging = false;
    try {
      if (this.state.pointerId != null)
        this.viewport.releasePointerCapture(this.state.pointerId);
    } catch {}
    this.state.pointerId = null;

    if (this.state.pausedAt) {
      this.state.startTime += performance.now() - this.state.pausedAt;
      this.state.pausedAt = 0;
    }

    const v = this.state.v;
    const threshold = 0.15;
    let target = Math.round(
      this.state.pos - Math.sign(v) * (Math.abs(v) > threshold ? 0.5 : 0)
    );
    this.goTo(this._mod(target, this.n));
  }

  _startCycle() {
    this.state.startTime = performance.now();
    this._renderProgress(0);
  }

  _loop() {
    const step = (t) => {
      if (
        !this.state.dragging &&
        !this.state.hovering &&
        !this.state.animating
      ) {
        const elapsed = t - this.state.startTime;
        const p = Math.min(1, elapsed / this.opts.interval);
        this._renderProgress(p);
        if (elapsed >= this.opts.interval) this.next();
      }
      this.state.rafId = requestAnimationFrame(step);
    };
    this.state.rafId = requestAnimationFrame(step);
  }

  _renderProgress(p) {
    this.progressBar.style.transform = `scaleX(${p})`;
  }

  prev() {
    this.goTo(this._mod(this.state.index - 1, this.n));
  }

  next() {
    this.goTo(this._mod(this.state.index + 1, this.n));
  }

  goTo(i, animate = true) {
    const start = this.state.pos || this.state.index;
    const end = this._nearest(start, i);
    const dur = animate ? this.opts.transitionMs : 0;
    const t0 = performance.now();
    const ease = (x) => 1 - Math.pow(1 - x, 4);

    this.state.animating = true;

    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      const p = dur ? ease(t) : 1;
      this.state.pos = start + (end - start) * p;
      this._render();
      if (t < 1) requestAnimationFrame(step);
      else this._afterSnap(i);
    };

    requestAnimationFrame(step);
  }

  _afterSnap(i) {
    this.state.index = this._mod(Math.round(this.state.pos), this.n);
    this.state.pos = this.state.index;
    this.state.animating = false;
    this._render(true);
    this._startCycle();
  }

  _nearest(from, target) {
    let d = target - Math.round(from);
    if (d > this.n / 2) d -= this.n;
    if (d < -this.n / 2) d += this.n;
    return Math.round(from) + d;
  }

  _mod(i, n) {
    return ((i % n) + n) % n;
  }

  _render(markActive = false) {
    const span = this.slideW + this.state.gap;
    const tiltX = parseFloat(
      this.root.style.getPropertyValue("--congresotTiltX") || 0
    );
    const tiltY = parseFloat(
      this.root.style.getPropertyValue("--congresotTiltY") || 0
    );

    for (let i = 0; i < this.n; i++) {
      let d = i - this.state.pos;
      if (d > this.n / 2) d -= this.n;
      if (d < -this.n / 2) d += this.n;

      const weight = Math.max(0, 1 - Math.abs(d) * 2);
      const biasActive = -this.slideW * this.opts.activeLeftBias * weight;
      const tx = d * span + biasActive;
      const depth = -Math.abs(d) * this.opts.zDepth;
      const rot = -d * this.opts.rotateY;
      const scale = 1 - Math.min(Math.abs(d) * this.opts.scaleDrop, 0.45);
      const blur = Math.min(Math.abs(d) * this.opts.blurMax, this.opts.blurMax);
      const z = Math.round(1000 - Math.abs(d) * 10);

      const s = this.slides[i];
      s.style.transform = `translate3d(${tx}px,-50%,${depth}px) rotateY(${rot}deg) scale(${scale})`;
      s.style.filter = `blur(${blur}px)`;
      s.style.zIndex = z;

      if (markActive)
        s.dataset.state =
          Math.round(this.state.index) === i ? "active" : "rest";

      const card = s.querySelector(".congresoCard");
      const parBase = Math.max(-1, Math.min(1, -d));
      const parX = parBase * 40 + tiltY * 1.5;
      const parY = tiltX * -1.2;
      const bgX = parBase * -56 + tiltY * -2.0;

      card.style.setProperty("--congresoParX", `${parX.toFixed(2)}px`);
      card.style.setProperty("--congresoParY", `${parY.toFixed(2)}px`);
      card.style.setProperty("--congresoParBgX", `${bgX.toFixed(2)}px`);
      card.style.setProperty("--congresoParBgY", `${(parY * 0.35).toFixed(2)}px`);
    }

    const active = this._mod(Math.round(this.state.pos), this.n);
    this.dots.forEach((d, i) =>
      d.setAttribute("aria-selected", i === active ? "true" : "false")
    );
  }

  destroy() {
    cancelAnimationFrame(this.state.rafId);
    if (this.ro) this.ro.disconnect();
  }
}

// Inicializar carrusel
document.addEventListener("DOMContentLoaded", () => {
  const carousel = new CongresoCarousel(
    document.getElementById("congresoCarousel"),
    {
      transitionMs: 900,
      interval: 5000
    }
  );

  // Cleanup on page unload
  window.addEventListener("beforeunload", () => carousel.destroy());
});
