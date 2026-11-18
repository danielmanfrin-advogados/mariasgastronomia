(function () {
  "use strict";
  var endpoint = "https://script.google.com/macros/s/AKfycbzNOf1W0H8qo7UEY0AGEyLIF3ksLYgj2YELKy9OytgORZ_3Zs6PmRGl_a2p9w-myqdnlg/exec";
  var session = "";
  try { session = sessionStorage.getItem("marias-click-session") || Math.random().toString(36).slice(2, 10); sessionStorage.setItem("marias-click-session", session); } catch (e) {}
  function param(name) { try { return new URLSearchParams(location.search).get(name) || ""; } catch (e) { return ""; } }
  function track(node) {
    var q = new URLSearchParams({site:"mariasgastronomia", nicho:"gastronomia moderna", acao:"click", local:"produto", pagina:location.pathname, titulo:document.title, origem:document.referrer, utm_source:param("utm_source"), utm_medium:param("utm_medium"), utm_campaign:param("utm_campaign"), utm_term:param("utm_term"), gclid:param("gclid") ? "sim" : "", dispositivo:/Mobi|Android|iPhone/i.test(navigator.userAgent) ? "celular" : "computador", tela:screen.width+"x"+screen.height, idioma:navigator.language || "", sessao:session, detalhe:(node.getAttribute("aria-label") || node.textContent || "").replace(/\s+/g," ").trim().slice(0,300)});
    var url = endpoint + "?" + q.toString();
    try { fetch(url, {method:"GET", mode:"no-cors", keepalive:true}).catch(function(){ new Image().src=url; }); } catch (e) { try { new Image().src=url; } catch (ignore) {} }
  }
  document.addEventListener("click", function (event) { var node = event.target.closest("a,button"); if (node) track(node); }, true);
}());
