import { useMemo, useState } from "react";
import { Search, ShoppingBag, Menu, X, Plus, Minus, Trash2, ArrowRight, MapPin, CreditCard, Clock3, Truck, Instagram, ChevronDown } from "lucide-react";

type Product = { id: string; name: string; category: string; price: number; description: string; image: string; badge?: string };

const images = {
  hero: "/manus-storage/async-images/Wqty53LX7Rgg4IHsMv7GkO/image-1.webp",
  p1: "/manus-storage/async-images/Wqty53LX7Rgg4IHsMv7GkO/image-2.webp",
  p2: "/manus-storage/async-images/Wqty53LX7Rgg4IHsMv7GkO/image-3.webp",
  p3: "/manus-storage/async-images/Wqty53LX7Rgg4IHsMv7GkO/image-4.webp",
  p4: "/manus-storage/async-images/Wqty53LX7Rgg4IHsMv7GkO/image-5.webp",
  p5: "/manus-storage/async-images/IvntRuVTIS8ckKiZ9KR0Cm/image-1.webp",
  p6: "/manus-storage/async-images/IvntRuVTIS8ckKiZ9KR0Cm/image-2.webp",
  p7: "/manus-storage/async-images/IvntRuVTIS8ckKiZ9KR0Cm/image-3.webp",
  p8: "/manus-storage/async-images/IvntRuVTIS8ckKiZ9KR0Cm/image-4.webp",
};

const products: Product[] = [
  { id: "kit-italia", name: "Kit La Mia Italia — 10 marmitinhas", category: "Kits marmitinhas", price: 145, description: "Desfrute do KIT La Mia Italia com 10 marmitinhas italianas variadas. Experimente fusilli, parmegiana, panqueca e mais. Garanta já o seu!", image: images.p1, badge: "Mais pedido" },
  { id: "kit-fit", name: "Kit Fit Emagreça com Sabor — 16 marmitinhas", category: "Kits marmitinhas", price: 235, description: "Descubra o KIT FIT com 16 marmitinhas variadas, saudáveis e práticas. Emagreça com sabor e praticidade no seu dia a dia. Peça já o seu!", image: images.p2, badge: "Fit" },
  { id: "kit-dia", name: "Kit Dia a Dia — 30 marmitinhas", category: "Kits marmitinhas", price: 440, description: "Aproveite o KIT Dia a Dia com 30 marmitinhas variadas, práticas e saudáveis. Solução ideal para refeições rápidas. Garanta já o seu!", image: images.p3, badge: "Frete grátis" },
  { id: "kit-mais", name: "Kit As Mais Pedidas — 20 marmitinhas", category: "Kits marmitinhas", price: 290, description: "Aproveite o KIT Mais Pedidas com 20 marmitinhas deliciosas. Praticidade e variedade para suas refeições. Garanta já o seu!", image: images.p4 },
  { id: "strogonoff", name: "Strogonoff de frango — 350g", category: "Marmitas variadas", price: 14.75, description: "Strogonoff de frango cremoso com arroz e batatas sauté, pronto para aquecer. Experimente o sabor irresistível e praticidade em cada porção!", image: images.p5 },
  { id: "frango-colorido", name: "Frango colorido — 350g", category: "Marmitas variadas", price: 14.75, description: "Experimente o Frango Colorido: filé de frango, legumes e arroz integral. Sabor, equilíbrio e praticidade. Peça já e desfrute de uma refeição saudável!", image: images.p6 },
  { id: "parmegiana", name: "Filé de frango à parmegiana — 350g", category: "Marmitas variadas", price: 14.75, description: "Filé de frango à parmegiana com arroz branco, molho de tomate e queijo. Experimente esse clássico prático! Peça agora e aproveite o sabor.", image: images.p7 },
  { id: "ragu", name: "Espaguete com ragu de linguiça fresca — 350g", category: "Marmitas variadas", price: 14.75, description: "Experimente o espaguete com ragu de linguiça fresca, molho rústico e sabor marcante. Pronto para aquecer! Peça já o seu.", image: images.p8 },
];

const categories = ["Todos", "Marmitas variadas", "Marmitas fitness", "Vegetariano", "Kits marmitinhas", "Sopas e caldos"];
const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const filtered = useMemo(() => products.filter((p) => {
    const matchesCategory = activeCategory === "Todos" || p.category === activeCategory;
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase());
    const matchesPrice = priceFilter === "all" || (priceFilter === "under50" && p.price < 50) || (priceFilter === "under250" && p.price <= 250) || (priceFilter === "over250" && p.price > 250);
    return matchesCategory && matchesQuery && matchesPrice;
  }), [activeCategory, query, priceFilter]);

  const cartItems = products.filter((p) => cart[p.id]);
  const cartCount = Object.values(cart).reduce((sum, n) => sum + n, 0);
  const subtotal = cartItems.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);
  const addToCart = (id: string) => { setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 })); setCartOpen(true); };
  const changeQty = (id: string, delta: number) => setCart((current) => { const next = Math.max(0, (current[id] || 0) + delta); const copy = { ...current }; if (next === 0) delete copy[id]; else copy[id] = next; return copy; });

  return (
    <div className="site-shell">
      <div className="topline">Frete grátis nas compras acima de R$ 345,00 <span>·</span> Aqueça de 5 a 6 min no micro-ondas <span>·</span> Pague com PIX, cartão, VR ou VA</div>
      <header className="header">
        <a className="brand" href="#inicio" aria-label="Maria's Gastronomia Moderna"><img className="full-logo" src="/marias-logo-cropped.webp" alt="Maria's Gastronomia Moderna" /></a>
        <nav className={mobileMenu ? "nav open" : "nav"}>
          <a href="#cardapio" onClick={() => setMobileMenu(false)}>Cardápio</a>
          <a href="#kits" onClick={() => setMobileMenu(false)}>Kits</a>
          <a href="#nossa-cozinha" onClick={() => setMobileMenu(false)}>Nossa cozinha</a>
          <a href="#contato" onClick={() => setMobileMenu(false)}>Contato</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button search-toggle" onClick={() => document.getElementById("cardapio")?.scrollIntoView({ behavior: "smooth" })} aria-label="Buscar"><Search size={19} /></button>
          <button className="cart-button" onClick={() => setCartOpen(true)}><ShoppingBag size={18} /><span>Sacola</span><b>{cartCount}</b></button>
          <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Abrir menu">{mobileMenu ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main id="inicio">
        <section className="hero">
          <img src={images.hero} alt="Marmitinhas artesanais Maria's" />
          <div className="hero-shade" />
          <div className="hero-copy">
            <p className="eyebrow">COMIDA DE VERDADE, DO NOSSO JEITO</p>
            <h1>O sabor que<br /><em>abraça</em> a rotina.</h1>
            <p>Receitas afetivas, porções práticas e ingredientes escolhidos para deixar seus dias mais leves — sem abrir mão do prazer de comer bem.</p>
            <a className="primary-button" href="#cardapio">Explorar cardápio <ArrowRight size={17} /></a>
          </div>
          <div className="hero-stamp"><span>feito com<br /><strong>carinho</strong></span><i>✦</i></div>
        </section>

        <section className="benefits" aria-label="Benefícios">
          <div><Truck size={25} /><span><strong>Entrega especial</strong><small>Para São Paulo capital</small></span></div>
          <div><CreditCard size={25} /><span><strong>Do seu jeito</strong><small>Cartão, PIX, VR e VA</small></span></div>
          <div><Clock3 size={25} /><span><strong>Pronto rapidinho</strong><small>Aqueça em 5 a 6 minutos</small></span></div>
        </section>

        <section className="intro" id="nossa-cozinha"><div><p className="eyebrow">A COZINHA DA MARIA</p><h2>Comida gostosa<br /><em>simplifica</em> a vida.</h2></div><p>Da nossa cozinha para a sua mesa: pratos ultracongelados com tempero caseiro, montados para caber na sua rotina e lembrar que comer bem pode ser simples.</p></section>

        <section className="catalog-section" id="cardapio">
          <div className="section-heading"><div><p className="eyebrow">PARA TODOS OS DIAS</p><h2>Escolha seu próximo<br /><em>momento gostoso.</em></h2></div><div className="catalog-filters"><div className="search-box"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar no cardápio" /></div><label className="price-filter"><span>Preço</span><select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}><option value="all">Todos</option><option value="under50">Até R$ 50</option><option value="under250">Até R$ 250</option><option value="over250">Acima de R$ 250</option></select><ChevronDown size={14} /></label></div></div>
          <div className="category-row">{categories.map((category) => <button key={category} className={activeCategory === category ? "category active" : "category"} onClick={() => setActiveCategory(category)}>{category}</button>)}</div>
          <div className="product-grid">{filtered.map((product) => <article className="product-card" key={product.id}><div className="product-image"><img src={product.image} alt={product.name} />{product.badge && <span className="badge">{product.badge}</span>}<button className="add-float" onClick={() => addToCart(product.id)} aria-label={`Adicionar ${product.name}`}><Plus size={19} /></button></div><div className="product-info"><p className="product-category">{product.category}</p><h3>{product.name}</h3><p className="product-description">{product.description}</p><div className="product-bottom"><strong>{money(product.price)}</strong><button onClick={() => addToCart(product.id)}>Adicionar</button></div></div></article>)}</div>
          {filtered.length === 0 && <div className="empty-state">Nenhum prato encontrado. Tente outra busca ou categoria.</div>}
        </section>

        <section className="kits-banner" id="kits"><div className="kits-content"><p className="eyebrow">SEMANA ORGANIZADA, CORAÇÃO TRANQUILO</p><h2>Tem kit para cada<br /><em>fase da vida.</em></h2><p>Escolha seu ritmo: kits montados com as receitas mais queridas da casa, para você ter praticidade sem cair na mesmice.</p><a className="outline-button" href="#cardapio" onClick={() => setActiveCategory("Kits marmitinhas")}>Ver kits disponíveis <ArrowRight size={17} /></a></div><div className="kit-orbit"><div className="orbit-word">MARIA'S · MARIA'S · MARIA'S ·</div><img src={images.p3} alt="Kit de marmitinhas" /></div></section>

        <section className="newsletter" id="contato"><div><p className="eyebrow">FICA POR PERTO</p><h2>Novidades gostosas<br />na sua caixa de entrada.</h2></div><form onSubmit={(e) => e.preventDefault()}><input type="email" placeholder="Seu melhor e-mail" aria-label="Seu melhor e-mail" /><button type="submit">Quero receber <ArrowRight size={17} /></button></form></section>
      </main>

      <footer className="footer"><div className="footer-brand"><a className="brand" href="#inicio"><img className="full-logo footer-logo" src="/marias-logo-cropped.webp" alt="Maria's Gastronomia Moderna" /></a><p>Comida afetiva para a vida real.</p></div><div><p className="footer-title">Navegue</p><a href="#cardapio">Cardápio</a><a href="#kits">Kits</a><a href="#nossa-cozinha">Nossa cozinha</a></div><div><p className="footer-title">Fale com a gente</p><a href="https://wa.me/5511914162432">(11) 91416-2432</a><a href="mailto:oi@mariasgastronomia.com.br">oi@mariasgastronomia.com.br</a><a href="#contato">Instagram <Instagram size={14} /></a></div><div><p className="footer-title">Do seu jeito</p><p>Crédito, débito, PIX,<br />VR e VA.</p></div><div className="footer-bottom">© 2026 Maria's Gastronomia Moderna <span>Feito para comer bem.</span></div></footer>

      {cartOpen && <div className="drawer-overlay" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-header"><div className="drawer-brand"><img className="drawer-logo" src="/marias-logo-cropped.webp" alt="Maria's Gastronomia Moderna" /><p className="eyebrow">SEU PEDIDO</p><h2>Sacola <span>({cartCount})</span></h2></div><button className="close-button" onClick={() => setCartOpen(false)}><X /></button></div>{cartItems.length === 0 ? <div className="cart-empty"><ShoppingBag size={34} /><p>Sua sacola está esperando por algo gostoso.</p><button className="primary-button" onClick={() => setCartOpen(false)}>Ver cardápio</button></div> : <><div className="cart-items">{cartItems.map((p) => <div className="cart-item" key={p.id}><img src={p.image} alt="" /><div><h3>{p.name}</h3><strong>{money(p.price)}</strong><div className="qty"><button onClick={() => changeQty(p.id, -1)}><Minus size={13} /></button><span>{cart[p.id]}</span><button onClick={() => changeQty(p.id, 1)}><Plus size={13} /></button><button className="remove" onClick={() => changeQty(p.id, -cart[p.id])}><Trash2 size={14} /></button></div></div></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><small>Frete calculado no checkout.</small><button className="primary-button full" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>Continuar para checkout <ArrowRight size={17} /></button></div></>}</aside></div>}
      {checkoutOpen && <div className="modal-overlay" onClick={() => setCheckoutOpen(false)}><div className="checkout-modal" onClick={(e) => e.stopPropagation()}><button className="close-button" onClick={() => setCheckoutOpen(false)}><X /></button><img className="checkout-logo" src="/marias-logo-cropped.webp" alt="Maria's Gastronomia Moderna" /><p className="eyebrow">ÚLTIMO PASSO</p><h2>Vamos finalizar<br /><em>seu pedido.</em></h2><div className="checkout-grid"><label>Seu nome<input placeholder="Como podemos te chamar?" /></label><label>WhatsApp<input placeholder="(11) 00000-0000" /></label><label className="wide">Endereço de entrega<input placeholder="Rua, número, complemento" /></label><label>Forma de pagamento<select defaultValue=""><option value="" disabled>Escolha uma opção</option><option>PIX</option><option>Cartão de crédito</option><option>VR / VA</option></select><ChevronDown size={15} /></label></div><div className="checkout-total"><span>Total do pedido</span><strong>{money(subtotal)}</strong></div><button className="primary-button full" onClick={() => setCheckoutOpen(false)}>Enviar pedido <ArrowRight size={17} /></button><p className="secure-note">Seu pedido será confirmado pelo WhatsApp.</p></div></div>}
    </div>
  );
}
