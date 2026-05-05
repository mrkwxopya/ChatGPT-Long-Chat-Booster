// ==UserScript==
// @name         ChatGPT Long Chat Booster
// @namespace    https://github.com/mrkwxopya
// @version      2.0.0
// @description  Long ChatGPT conversations için eski mesajları, kod bloklarını, tabloları ve medya öğelerini optimize ederek arayüz kasmasını azaltır.
// @author       mrkwxopya
// @license      MIT
// @homepageURL  https://github.com/mrkwxopya/chatgpt-long-chat-booster
// @supportURL   https://github.com/mrkwxopya/chatgpt-long-chat-booster/issues
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const SCRIPT_ID = "cgb";
  const STORAGE_KEY = "mrkwxopya.chatgpt.long.chat.booster.v2";

  const DEFAULTS = {
    enabled: true,
    keepTurns: 18,
    aggressiveMode: false,
    compactCode: true,
    compactTables: true,
    mediaLightMode: true,
    reduceMotion: true,
    optimizeSidebar: true,
    pauseWhileScrolling: true,
    panelMinimized: false
  };

  let settings = loadSettings();
  let panelEl = null;
  let applyTimer = null;
  let scrollTimer = null;
  let observer = null;
  let lastUrl = location.href;
  let expandedAll = false;
  let isScrolling = false;
  let isApplying = false;
  let eventsAttached = false;

  function loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

      return normalizeSettings({
        ...DEFAULTS,
        ...saved
      });
    } catch {
      return { ...DEFAULTS };
    }
  }

  function normalizeSettings(value) {
    return {
      enabled: Boolean(value.enabled),
      keepTurns: clamp(Number(value.keepTurns) || DEFAULTS.keepTurns, 6, 80),
      aggressiveMode: Boolean(value.aggressiveMode),
      compactCode: Boolean(value.compactCode),
      compactTables: Boolean(value.compactTables),
      mediaLightMode: Boolean(value.mediaLightMode),
      reduceMotion: Boolean(value.reduceMotion),
      optimizeSidebar: Boolean(value.optimizeSidebar),
      pauseWhileScrolling: Boolean(value.pauseWhileScrolling),
      panelMinimized: Boolean(value.panelMinimized)
    };
  }

  function saveSettings() {
    settings = normalizeSettings(settings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function runIdle(callback) {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(callback, { timeout: 1200 });
    } else {
      window.setTimeout(callback, 250);
    }
  }

  function isChatGenerating() {
    return Boolean(
      document.querySelector(
        [
          'button[data-testid="stop-button"]',
          'button[aria-label*="Stop"]',
          'button[aria-label*="Durdur"]',
          'button[aria-label*="Regenerate"]'
        ].join(",")
      )
    );
  }

  function scheduleApply() {
    clearTimeout(applyTimer);

    if (settings.pauseWhileScrolling && isScrolling) {
      applyTimer = setTimeout(scheduleApply, 350);
      return;
    }

    const delay = isChatGenerating() ? 700 : 260;

    applyTimer = setTimeout(() => {
      runIdle(applyBoost);
    }, delay);
  }

  function injectStyle() {
    if (document.getElementById(`${SCRIPT_ID}-style`)) return;

    const style = document.createElement("style");
    style.id = `${SCRIPT_ID}-style`;

    style.textContent = `
      body.cgb-enabled main article {
        content-visibility: auto !important;
        contain-intrinsic-size: 260px !important;
      }

      body.cgb-enabled main article.cgb-old {
        content-visibility: auto !important;
        contain-intrinsic-size: 180px !important;
      }

      body.cgb-enabled main article.cgb-collapsed {
        display: flex !important;
        align-items: center !important;
        min-height: 32px !important;
        max-height: 32px !important;
        overflow: hidden !important;
        contain: layout style paint !important;
        content-visibility: visible !important;
        margin-top: 5px !important;
        margin-bottom: 5px !important;
        padding: 0 12px !important;
        border: 1px dashed rgba(148, 163, 184, 0.26) !important;
        border-radius: 11px !important;
        opacity: 0.64 !important;
        cursor: pointer !important;
        user-select: none !important;
      }

      body.cgb-enabled main article.cgb-collapsed:hover {
        opacity: 0.9 !important;
        border-color: rgba(129, 140, 248, 0.45) !important;
      }

      body.cgb-enabled main article.cgb-collapsed > * {
        display: none !important;
      }

      body.cgb-enabled main article.cgb-collapsed::before {
        content: attr(data-cgb-label);
        display: block;
        max-width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 12px;
        line-height: 1;
        color: rgba(226, 232, 240, 0.86);
      }

      body.cgb-reduce-motion *,
      body.cgb-reduce-motion *::before,
      body.cgb-reduce-motion *::after {
        animation-duration: 0.001s !important;
        animation-delay: 0s !important;
        transition-duration: 0.001s !important;
        scroll-behavior: auto !important;
      }

      body.cgb-media-light main img,
      body.cgb-media-light main video,
      body.cgb-media-light main canvas,
      body.cgb-media-light main iframe {
        content-visibility: auto !important;
        contain: layout paint !important;
      }

      body.cgb-compact-code main article pre {
        max-height: 460px !important;
        overflow: auto !important;
        contain: layout paint !important;
      }

      body.cgb-compact-code main article.cgb-old pre {
        max-height: 96px !important;
        overflow: auto !important;
      }

      body.cgb-compact-tables main article table {
        display: block !important;
        max-height: 360px !important;
        overflow: auto !important;
        contain: layout paint !important;
      }

      body.cgb-compact-tables main article.cgb-old table {
        max-height: 130px !important;
      }

      body.cgb-aggressive main article.cgb-old pre {
        max-height: 58px !important;
        overflow: hidden !important;
      }

      body.cgb-aggressive main article.cgb-old table {
        max-height: 74px !important;
        overflow: hidden !important;
      }

      body.cgb-aggressive main article.cgb-old img,
      body.cgb-aggressive main article.cgb-old video,
      body.cgb-aggressive main article.cgb-old canvas,
      body.cgb-aggressive main article.cgb-old iframe {
        max-height: 120px !important;
        object-fit: cover !important;
        overflow: hidden !important;
        opacity: 0.78 !important;
      }

      body.cgb-sidebar-optimized aside,
      body.cgb-sidebar-optimized nav[aria-label],
      body.cgb-sidebar-optimized [data-testid="history-list"],
      body.cgb-sidebar-optimized [data-testid="conversation-history"] {
        content-visibility: auto !important;
        contain-intrinsic-size: 320px 800px !important;
      }

      #cgb-panel {
        position: fixed;
        right: 14px;
        bottom: 14px;
        z-index: 2147483647;
        width: 282px;
        color: #e5e7eb;
        background: rgba(2, 6, 23, 0.9);
        border: 1px solid rgba(148, 163, 184, 0.24);
        border-radius: 15px;
        box-shadow: 0 16px 50px rgba(0, 0, 0, 0.48);
        backdrop-filter: blur(12px);
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 12px;
        overflow: hidden;
      }

      #cgb-panel.cgb-mini {
        width: auto;
      }

      #cgb-panel * {
        box-sizing: border-box;
      }

      #cgb-panel button,
      #cgb-panel input {
        font: inherit;
      }

      .cgb-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 9px 10px;
        background: rgba(15, 23, 42, 0.96);
        border-bottom: 1px solid rgba(148, 163, 184, 0.16);
      }

      .cgb-title {
        font-weight: 800;
        letter-spacing: 0.2px;
      }

      .cgb-version {
        color: rgba(203, 213, 225, 0.58);
        font-size: 11px;
        font-weight: 600;
      }

      .cgb-body {
        padding: 10px;
        display: grid;
        gap: 8px;
      }

      .cgb-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .cgb-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 7px;
      }

      .cgb-muted {
        color: rgba(203, 213, 225, 0.68);
        line-height: 1.35;
      }

      .cgb-btn {
        border: 1px solid rgba(148, 163, 184, 0.22);
        background: rgba(30, 41, 59, 0.86);
        color: #e5e7eb;
        border-radius: 9px;
        padding: 6px 8px;
        cursor: pointer;
        text-align: center;
      }

      .cgb-btn:hover {
        background: rgba(51, 65, 85, 0.98);
      }

      .cgb-btn-primary {
        background: rgba(79, 70, 229, 0.88);
        border-color: rgba(129, 140, 248, 0.42);
      }

      .cgb-btn-danger {
        background: rgba(127, 29, 29, 0.82);
        border-color: rgba(248, 113, 113, 0.32);
      }

      .cgb-input {
        width: 68px;
        border: 1px solid rgba(148, 163, 184, 0.22);
        background: rgba(15, 23, 42, 0.92);
        color: #e5e7eb;
        border-radius: 8px;
        padding: 5px 6px;
      }

      .cgb-check {
        display: flex;
        align-items: center;
        gap: 7px;
        min-height: 20px;
      }

      .cgb-check input {
        margin: 0;
      }

      .cgb-separator {
        height: 1px;
        background: rgba(148, 163, 184, 0.14);
        margin: 2px 0;
      }

      #cgb-panel.cgb-mini .cgb-body {
        display: none;
      }

      #cgb-panel.cgb-mini .cgb-head {
        border-bottom: 0;
      }
    `;

    document.documentElement.appendChild(style);
  }

  function createPanel() {
    if (document.getElementById("cgb-panel")) {
      panelEl = document.getElementById("cgb-panel");
      return;
    }

    panelEl = document.createElement("div");
    panelEl.id = "cgb-panel";

    if (settings.panelMinimized) {
      panelEl.classList.add("cgb-mini");
    }

    panelEl.innerHTML = `
      <div class="cgb-head">
        <div>
          <div class="cgb-title">ChatGPT Booster</div>
          <div class="cgb-version">v2.0.0 · mrkwxopya</div>
        </div>
        <button class="cgb-btn" data-cgb-action="minimize">—</button>
      </div>

      <div class="cgb-body">
        <label class="cgb-check">
          <input type="checkbox" data-cgb-field="enabled">
          Aktif
        </label>

        <div class="cgb-row">
          <span>Son açık mesaj</span>
          <input class="cgb-input" type="number" min="6" max="80" step="2" data-cgb-field="keepTurns">
        </div>

        <label class="cgb-check">
          <input type="checkbox" data-cgb-field="aggressiveMode">
          Aggressive Mode
        </label>

        <div class="cgb-separator"></div>

        <label class="cgb-check">
          <input type="checkbox" data-cgb-field="compactCode">
          Eski kod bloklarını kısalt
        </label>

        <label class="cgb-check">
          <input type="checkbox" data-cgb-field="compactTables">
          Eski tabloları kısalt
        </label>

        <label class="cgb-check">
          <input type="checkbox" data-cgb-field="mediaLightMode">
          Medya yükünü azalt
        </label>

        <label class="cgb-check">
          <input type="checkbox" data-cgb-field="reduceMotion">
          Animasyonları azalt
        </label>

        <label class="cgb-check">
          <input type="checkbox" data-cgb-field="optimizeSidebar">
          Sidebar optimizasyonu
        </label>

        <label class="cgb-check">
          <input type="checkbox" data-cgb-field="pauseWhileScrolling">
          Scroll sırasında bekle
        </label>

        <div class="cgb-separator"></div>

        <div class="cgb-grid">
          <button class="cgb-btn" data-cgb-action="toggleOld">Eskiyi aç/kapat</button>
          <button class="cgb-btn" data-cgb-action="clearPins">Pin temizle</button>
          <button class="cgb-btn cgb-btn-primary" data-cgb-action="bottom">Alta git</button>
          <button class="cgb-btn" data-cgb-action="apply">Yenile</button>
        </div>

        <button class="cgb-btn cgb-btn-danger" data-cgb-action="reset">Ayarları sıfırla</button>

        <div class="cgb-muted" data-cgb-status>Hazır.</div>

        <div class="cgb-muted">
          Kısayol: Alt + B aktif/pasif · Alt + [ / ] mesaj sayısı
        </div>
      </div>
    `;

    document.body.appendChild(panelEl);
    syncPanelFields();
  }

  function syncPanelFields() {
    if (!panelEl) return;

    const fields = panelEl.querySelectorAll("[data-cgb-field]");

    fields.forEach((field) => {
      const key = field.getAttribute("data-cgb-field");

      if (!(key in settings)) return;

      if (field.type === "checkbox") {
        field.checked = Boolean(settings[key]);
      } else {
        field.value = String(settings[key]);
      }
    });
  }

  function setStatus(text) {
    const statusEl = panelEl?.querySelector("[data-cgb-status]");
    if (statusEl) statusEl.textContent = text;
  }

  function applyBodyClasses() {
    document.body.classList.toggle("cgb-enabled", settings.enabled);
    document.body.classList.toggle("cgb-aggressive", settings.enabled && settings.aggressiveMode);
    document.body.classList.toggle("cgb-compact-code", settings.enabled && settings.compactCode);
    document.body.classList.toggle("cgb-compact-tables", settings.enabled && settings.compactTables);
    document.body.classList.toggle("cgb-media-light", settings.enabled && settings.mediaLightMode);
    document.body.classList.toggle("cgb-reduce-motion", settings.enabled && settings.reduceMotion);
    document.body.classList.toggle("cgb-sidebar-optimized", settings.enabled && settings.optimizeSidebar);
  }

  function getMainRoot() {
    return document.querySelector("main") || document.body;
  }

  function getTurns() {
    const root = getMainRoot();

    const selectors = [
      'article[data-testid^="conversation-turn"]',
      'article[data-testid*="conversation-turn"]'
    ];

    let turns = [];

    for (const selector of selectors) {
      turns = Array.from(root.querySelectorAll(selector));

      if (turns.length > 0) break;
    }

    if (turns.length === 0) {
      const roleNodes = Array.from(root.querySelectorAll("[data-message-author-role]"));

      turns = roleNodes
        .map((node) => node.closest("article") || node)
        .filter(Boolean);
    }

    if (turns.length === 0) {
      turns = Array.from(root.querySelectorAll("article"));
    }

    return Array.from(new Set(turns)).filter((turn) => {
      if (!(turn instanceof Element)) return false;
      if (turn.closest("#cgb-panel")) return false;

      const text = (turn.textContent || "").trim();

      return text.length > 0;
    });
  }

  function getRole(turn) {
    const roleNode = turn.querySelector("[data-message-author-role]");
    const role = roleNode?.getAttribute("data-message-author-role");

    if (role === "user") return "Sen";
    if (role === "assistant") return "ChatGPT";
    if (role) return role;

    return "Mesaj";
  }

  function getSnippet(turn) {
    const text = (turn.textContent || "")
      .replace(/\s+/g, " ")
      .trim();

    if (!text) return "Katlanmış mesaj";

    return text.length > 96 ? `${text.slice(0, 96)}…` : text;
  }

  function collapseTurn(turn, index) {
    const role = getRole(turn);
    const snippet = getSnippet(turn);

    turn.classList.add("cgb-collapsed");
    turn.setAttribute("data-cgb-label", `#${index + 1} ${role}: ${snippet}`);
    turn.setAttribute("title", "Açmak için tıkla");
    turn.setAttribute("aria-expanded", "false");
  }

  function expandTurn(turn) {
    turn.classList.remove("cgb-collapsed");
    turn.removeAttribute("data-cgb-label");
    turn.removeAttribute("title");
    turn.setAttribute("aria-expanded", "true");
  }

  function optimizeOldTurnElements(turn, isOld) {
    if (!settings.enabled) return;

    const mediaNodes = turn.querySelectorAll("img, video, iframe");

    mediaNodes.forEach((node) => {
      if (node.tagName === "IMG" || node.tagName === "IFRAME") {
        node.setAttribute("loading", "lazy");
      }

      if (node.tagName === "VIDEO" && isOld) {
        node.setAttribute("preload", "metadata");
      }
    });
  }

  function applyBoost() {
    if (isApplying) return;

    isApplying = true;

    try {
      applyBodyClasses();

      const turns = getTurns();
      const keepTurns = clamp(settings.keepTurns, 6, 80);
      const collapseUntil = Math.max(0, turns.length - keepTurns);

      if (!settings.enabled) {
        turns.forEach((turn) => {
          turn.classList.remove("cgb-old");
          expandTurn(turn);
        });

        setStatus("Booster pasif.");
        return;
      }

      turns.forEach((turn, index) => {
        const isOld = index < collapseUntil;
        const isPinned = turn.dataset.cgbPinned === "1";

        turn.classList.toggle("cgb-old", isOld);
        optimizeOldTurnElements(turn, isOld);

        if (expandedAll || !isOld || isPinned) {
          expandTurn(turn);
        } else {
          collapseTurn(turn, index);
        }
      });

      const collapsedCount = turns.filter((turn) =>
        turn.classList.contains("cgb-collapsed")
      ).length;

      const mode = settings.aggressiveMode ? "Aggressive" : "Normal";

      setStatus(`${mode}: ${turns.length} mesaj, ${collapsedCount} katlandı.`);
    } finally {
      isApplying = false;
    }
  }

  function attachEvents() {
    if (eventsAttached) return;
    eventsAttached = true;

    document.addEventListener(
      "click",
      (event) => {
        const target = event.target instanceof Element ? event.target : null;

        if (!target) return;
        if (panelEl?.contains(target)) return;

        const collapsedTurn = target.closest("article.cgb-collapsed");

        if (!collapsedTurn) return;

        collapsedTurn.dataset.cgbPinned = "1";
        expandTurn(collapsedTurn);
        setStatus("Mesaj açıldı. Tekrar katlamak için Pin temizle.");
      },
      true
    );

    document.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();

      if (event.altKey && key === "b") {
        settings.enabled = !settings.enabled;
        saveSettings();
        syncPanelFields();
        expandedAll = false;
        scheduleApply();
      }

      if (event.altKey && event.key === "[") {
        settings.keepTurns = clamp(settings.keepTurns - 2, 6, 80);
        saveSettings();
        syncPanelFields();
        scheduleApply();
      }

      if (event.altKey && event.key === "]") {
        settings.keepTurns = clamp(settings.keepTurns + 2, 6, 80);
        saveSettings();
        syncPanelFields();
        scheduleApply();
      }
    });

    window.addEventListener(
      "scroll",
      () => {
        if (!settings.pauseWhileScrolling) return;

        isScrolling = true;
        clearTimeout(scrollTimer);

        scrollTimer = setTimeout(() => {
          isScrolling = false;
          scheduleApply();
        }, 320);
      },
      { passive: true }
    );

    panelEl?.addEventListener("change", (event) => {
      const target = event.target instanceof HTMLInputElement ? event.target : null;

      if (!target) return;

      const field = target.getAttribute("data-cgb-field");

      if (!field || !(field in settings)) return;

      if (target.type === "checkbox") {
        settings[field] = target.checked;
      } else if (field === "keepTurns") {
        settings.keepTurns = clamp(Number(target.value) || DEFAULTS.keepTurns, 6, 80);
      }

      saveSettings();
      expandedAll = false;
      scheduleApply();
    });

    panelEl?.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;

      if (!target) return;

      const action = target.getAttribute("data-cgb-action");

      if (!action) return;

      if (action === "minimize") {
        settings.panelMinimized = !settings.panelMinimized;
        panelEl.classList.toggle("cgb-mini", settings.panelMinimized);
        saveSettings();
      }

      if (action === "toggleOld") {
        expandedAll = !expandedAll;
        scheduleApply();
      }

      if (action === "clearPins") {
        getTurns().forEach((turn) => {
          delete turn.dataset.cgbPinned;
        });

        expandedAll = false;
        scheduleApply();
      }

      if (action === "bottom") {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "auto"
        });
      }

      if (action === "apply") {
        expandedAll = false;
        scheduleApply();
      }

      if (action === "reset") {
        settings = { ...DEFAULTS };
        saveSettings();
        syncPanelFields();
        expandedAll = false;
        scheduleApply();
      }
    });
  }

  function observePage() {
    if (observer) observer.disconnect();

    observer = new MutationObserver((mutations) => {
      const hasUsefulMutation = mutations.some((mutation) => {
        const target = mutation.target instanceof Element ? mutation.target : null;

        if (!target) return true;
        if (panelEl?.contains(target)) return false;

        return true;
      });

      if (hasUsefulMutation) {
        scheduleApply();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setInterval(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        expandedAll = false;

        getTurns().forEach((turn) => {
          delete turn.dataset.cgbPinned;
          turn.classList.remove("cgb-old", "cgb-collapsed");
        });

        scheduleApply();
      }
    }, 1000);
  }

  function init() {
    if (!document.body) {
      setTimeout(init, 300);
      return;
    }

    injectStyle();
    createPanel();
    attachEvents();
    observePage();
    scheduleApply();
  }

  init();
})();
