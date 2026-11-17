const CLICK_ENDPOINT = "https://script.google.com/macros/s/AKfycbzNOf1W0H8qo7UEY0AGEyLIF3ksLYgj2YELKy9OytgORZ_3Zs6PmRGl_a2p9w-myqdnlg/exec";
const SITE_ID = "mariasgastronomia";
const NICHE = "gastronomia moderna";

function getSessionId() {
  try {
    const key = "marias-click-session";
    let id = sessionStorage.getItem(key);
    if (!id) {
      id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(key, id);
    }
    return id;
  } catch {
    return "";
  }
}

function queryParam(name: string) {
  try {
    return new URLSearchParams(window.location.search).get(name) || "";
  } catch {
    return "";
  }
}

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 300);
}

function elementLabel(element: HTMLElement) {
  const ariaLabel = element.getAttribute("aria-label");
  if (ariaLabel) return cleanText(ariaLabel);
  const title = element.getAttribute("title");
  if (title) return cleanText(title);
  return cleanText(element.textContent || "");
}

function elementLocation(element: HTMLElement) {
  const explicit = element.dataset.local;
  if (explicit) return explicit;
  const section = element.closest("section, header, footer, aside, main") as HTMLElement | null;
  if (section?.id) return section.id;
  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";
  return element.tagName.toLowerCase();
}

function registerClick(element: HTMLElement) {
  const params = new URLSearchParams({
    site: SITE_ID,
    nicho: NICHE,
    acao: "click",
    local: elementLocation(element),
    pagina: window.location.pathname,
    titulo: document.title,
    origem: document.referrer,
    utm_source: queryParam("utm_source"),
    utm_medium: queryParam("utm_medium"),
    utm_campaign: queryParam("utm_campaign"),
    utm_term: queryParam("utm_term"),
    gclid: queryParam("gclid") ? "sim" : "",
    dispositivo: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? "celular" : "computador",
    tela: `${window.screen.width}x${window.screen.height}`,
    idioma: navigator.language || "",
    sessao: getSessionId(),
    detalhe: elementLabel(element),
  });

  const url = `${CLICK_ENDPOINT}?${params.toString()}`;
  try {
    void fetch(url, { method: "GET", mode: "no-cors", keepalive: true }).catch(() => {
      const image = new Image();
      image.src = url;
    });
  } catch {
    try {
      const image = new Image();
      image.src = url;
    } catch {
      // O registro não pode interromper a navegação ou a ação do usuário.
    }
  }
}

export function installClickTracker() {
  if (typeof document === "undefined") return;
  document.addEventListener(
    "click",
    (event) => {
      const target = event.target as HTMLElement | null;
      if (!target || target === document.body || target === document.documentElement) return;
      const interactive = target.closest("a, button, input, select, textarea, summary, [role='button']") as HTMLElement | null;
      registerClick(interactive || target);
    },
    true,
  );
}
