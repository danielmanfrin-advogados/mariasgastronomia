# Maria's Gastronomia Moderna

Site em HTML puro, sem etapa de build. O que está na raiz do repositório é o que vai ao ar.

## Arquivos do site

- `index.html`: a página inicial, com todo o conteúdo (cardápio, textos, preços) escrito direto no HTML.
- `styles.css`: aparência.
- `app.js`: busca, filtros, sacola, checkout e registro de cliques.
- `404.html`: página mostrada quando o endereço não existe.
- `robots.txt` e `sitemap.xml`: orientações para o Google.
- `googledeb63b46b132aa54.html`: arquivo de verificação do Google Search Console. Não apagar, não renomear.
- `images/`, `*.webp`, `*.png`, `favicon.ico`: imagens e ícones.

## Como alterar

- Texto, preço ou produto: edite o `index.html`. Cada produto é um bloco `<article class="product-card">`; o preço aparece no texto e no atributo `data-price`.
- Domínio: se o site passar a usar um domínio próprio, troque `https://mariasgastronomia.vercel.app` por ele em `index.html` (canonical, og:url, og:image, dados estruturados), `robots.txt` e `sitemap.xml`.

## Pasta react-original

Guarda a versão anterior (React, Express, tRPC), mantida só como arquivo. Não é publicada (veja `.vercelignore`).
