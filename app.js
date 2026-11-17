/* Maria's Gastronomia Moderna - comportamento do site (JavaScript puro, sem dependências) */
(function () {
  "use strict";

  /* ---------- utilidades ---------- */
  var BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  function money(v) { return BRL.format(v); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }
  function icon(id, size) {
    var tpl = document.getElementById("tpl-" + id);
    var svg = tpl ? tpl.content.firstElementChild.cloneNode(true) : document.createElement("span");
    if (size) { svg.setAttribute("width", size); svg.setAttribute("height", size); }
    return svg;
  }

  /* ---------- produtos (lidos do próprio HTML) ---------- */
  var cards = $$(".product-card");
  var products = {};
  cards.forEach(function (card) {
    var name = $("h3", card).textContent.trim();
    var desc = $(".product-description", card).textContent.trim();
    products[card.dataset.id] = {
      id: card.dataset.id,
      name: name,
      category: card.dataset.category,
      price: parseFloat(card.dataset.price),
      image: $("img", card).getAttribute("src"),
      haystack: norm(name + " " + desc)
    };
  });

  /* ---------- filtros do cardápio ---------- */
  var state = { category: "Todos", query: "", price: "all" };
  var searchInput = $("#busca");
  var priceSelect = $("#filtro-preco");
  var emptyState = $("#sem-resultados");
  var categoryButtons = $$(".category");

  function matchesPrice(p) {
    if (state.price === "under50") return p.price < 50;
    if (state.price === "under250") return p.price <= 250;
    if (state.price === "over250") return p.price > 250;
    return true;
  }
  function applyFilters() {
    var q = norm(state.query);
    var visible = 0;
    cards.forEach(function (card) {
      var p = products[card.dataset.id];
      var ok = (state.category === "Todos" || p.category === state.category) &&
        (!q || p.haystack.indexOf(q) !== -1) && matchesPrice(p);
      card.hidden = !ok;
      if (ok) visible++;
    });
    emptyState.hidden = visible !== 0;
    categoryButtons.forEach(function (b) {
      var active = b.dataset.category === state.category;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }
  function setCategory(cat) { state.category = cat; applyFilters(); }

  categoryButtons.forEach(function (b) {
    b.addEventListener("click", function () { setCategory(b.dataset.category); });
  });
  searchInput.addEventListener("input", function () { state.query = searchInput.value; applyFilters(); });
  priceSelect.addEventListener("change", function () { state.price = priceSelect.value; applyFilters(); });

  var kitsLink = $("#ver-kits");
  if (kitsLink) kitsLink.addEventListener("click", function () { setCategory("Kits marmitinhas"); });

  /* ---------- janelas (sacola e checkout) ---------- */
  var cartOverlay = $("#cart-overlay");
  var checkoutOverlay = $("#checkout-overlay");
  var lastFocus = null;

  function openDialog(overlay) {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    var target = $(".close-button", overlay);
    if (target) target.focus();
  }
  function closeDialog(overlay) {
    overlay.hidden = true;
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }
  [cartOverlay, checkoutOverlay].forEach(function (overlay) {
    overlay.addEventListener("click", function (e) { if (e.target === overlay) closeDialog(overlay); });
    $$("[data-close]", overlay).forEach(function (b) {
      b.addEventListener("click", function () { closeDialog(overlay); });
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!checkoutOverlay.hidden) closeDialog(checkoutOverlay);
    else if (!cartOverlay.hidden) closeDialog(cartOverlay);
  });

  /* ---------- sacola ---------- */
  var cart = {};
  var cartItemsBox = $("#cart-items");
  var cartEmpty = $("#cart-empty");
  var cartFilled = $("#cart-filled");

  function cartCount() {
    return Object.keys(cart).reduce(function (s, id) { return s + cart[id]; }, 0);
  }
  function cartSubtotal() {
    return Object.keys(cart).reduce(function (s, id) { return s + products[id].price * cart[id]; }, 0);
  }
  function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    renderCart();
    openDialog(cartOverlay);
  }
  function changeQty(id, delta) {
    var next = Math.max(0, (cart[id] || 0) + delta);
    if (next === 0) delete cart[id]; else cart[id] = next;
    renderCart();
  }
  function qtyButton(label, child, onClick, extraClass) {
    var b = el("button", { type: "button", "aria-label": label, "class": extraClass || "" }, [child]);
    b.addEventListener("click", onClick);
    return b;
  }
  function renderCart() {
    var count = cartCount();
    var ids = Object.keys(products).filter(function (id) { return cart[id]; });
    $("#cart-count").textContent = String(count);
    $("#cart-count-title").textContent = String(count);
    cartEmpty.hidden = ids.length > 0;
    cartFilled.hidden = ids.length === 0;
    cartItemsBox.textContent = "";
    ids.forEach(function (id) {
      var p = products[id];
      var qty = el("div", { "class": "qty" }, [
        qtyButton("Diminuir quantidade de " + p.name, icon("minus", 13), function () { changeQty(id, -1); }),
        el("span", { text: String(cart[id]), "aria-live": "polite" }),
        qtyButton("Aumentar quantidade de " + p.name, icon("plus", 13), function () { changeQty(id, 1); }),
        qtyButton("Remover " + p.name, icon("trash-2", 14), function () { changeQty(id, -cart[id]); }, "remove")
      ]);
      var info = el("div", {}, [
        el("h3", { text: p.name }),
        el("strong", { text: money(p.price) }),
        qty
      ]);
      cartItemsBox.appendChild(el("div", { "class": "cart-item" }, [
        el("img", { src: p.image, alt: "", width: "74", height: "74", loading: "lazy" }),
        info
      ]));
    });
    var sub = money(cartSubtotal());
    $("#cart-subtotal").textContent = sub;
    $("#checkout-total").textContent = sub;
  }

  $$("[data-add]").forEach(function (b) {
    b.addEventListener("click", function () { addToCart(b.dataset.add); });
  });
  $("#open-cart").addEventListener("click", function () { openDialog(cartOverlay); });
  $("#cart-continue").addEventListener("click", function () { closeDialog(cartOverlay); });
  $("#go-checkout").addEventListener("click", function () {
    cartOverlay.hidden = true;
    lastFocus = $("#open-cart");
    openDialog(checkoutOverlay);
  });
  $("#send-order").addEventListener("click", function () { closeDialog(checkoutOverlay); });

  /* ---------- menu e busca no cabeçalho ---------- */
  var nav = $("#nav");
  var menuToggle = $("#menu-toggle");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  }
  menuToggle.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });

  $("#search-toggle").addEventListener("click", function () {
    var section = document.getElementById("cardapio");
    if (section) section.scrollIntoView({ behavior: "smooth" });
    searchInput.focus({ preventScroll: true });
  });

  $("#newsletter-form").addEventListener("submit", function (e) { e.preventDefault(); });

  /* ---------- registro de cliques (mesmo endpoint de antes) ---------- */
  var CLICK_ENDPOINT = "https://script.google.com/macros/s/AKfycbzNOf1W0H8qo7UEY0AGEyLIF3ksLYgj2YELKy9OytgORZ_3Zs6PmRGl_a2p9w-myqdnlg/exec";
  var SITE_ID = "mariasgastronomia";
  var NICHE = "gastronomia moderna";

  function getSessionId() {
    try {
      var key = "marias-click-session";
      var id = sessionStorage.getItem(key);
      if (!id) {
        id = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
        sessionStorage.setItem(key, id);
      }
      return id;
    } catch (e) { return ""; }
  }
  function queryParam(name) {
    try { return new URLSearchParams(window.location.search).get(name) || ""; } catch (e) { return ""; }
  }
  function cleanText(v) { return String(v).replace(/\s+/g, " ").trim().slice(0, 300); }
  function elementLabel(node) {
    var aria = node.getAttribute("aria-label");
    if (aria) return cleanText(aria);
    var title = node.getAttribute("title");
    if (title) return cleanText(title);
    return cleanText(node.textContent || "");
  }
  function elementLocation(node) {
    if (node.dataset && node.dataset.local) return node.dataset.local;
    var section = node.closest("section, header, footer, aside, main");
    if (section && section.id) return section.id;
    if (node.closest("header")) return "header";
    if (node.closest("footer")) return "footer";
    return node.tagName.toLowerCase();
  }
  function pixel(url) { try { new Image().src = url; } catch (e) { /* o registro nunca interrompe a navegação */ } }
  function registerClick(node) {
    var params = new URLSearchParams({
      site: SITE_ID,
      nicho: NICHE,
      acao: "click",
      local: elementLocation(node),
      pagina: window.location.pathname,
      titulo: document.title,
      origem: document.referrer,
      utm_source: queryParam("utm_source"),
      utm_medium: queryParam("utm_medium"),
      utm_campaign: queryParam("utm_campaign"),
      utm_term: queryParam("utm_term"),
      gclid: queryParam("gclid") ? "sim" : "",
      dispositivo: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? "celular" : "computador",
      tela: window.screen.width + "x" + window.screen.height,
      idioma: navigator.language || "",
      sessao: getSessionId(),
      detalhe: elementLabel(node)
    });
    var url = CLICK_ENDPOINT + "?" + params.toString();
    try {
      fetch(url, { method: "GET", mode: "no-cors", keepalive: true }).catch(function () { pixel(url); });
    } catch (e) { pixel(url); }
  }
  document.addEventListener("click", function (event) {
    var target = event.target;
    if (!target || !target.closest || target === document.body || target === document.documentElement) return;
    var interactive = target.closest("a, button, input, select, textarea, summary, [role='button']");
    registerClick(interactive || target);
  }, true);

  applyFilters();
  renderCart();
})();
