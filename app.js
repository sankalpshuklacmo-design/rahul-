const PRODUCTS = [
  { id: "p1", name: "Homestyle Mango Pickle", cat: "pickles", price: 249, mrp: 299, weight: "400 g",
    img: "images/mango-pickle.jpg",
    desc: "Sun-cured raw mangoes in mustard oil, fennel and red chilli. Classic Gujarati-Punjabi style." },
  { id: "p2", name: "Mixed Vegetable Achar", cat: "pickles", price: 229, mrp: 269, weight: "400 g",
    img: "images/mixed-pickle.jpg",
    desc: "Carrot, cauliflower, turnip and green chilli — winter special mixed pickle." },
  { id: "p3", name: "Lemon & Chilli Pickle", cat: "pickles", price: 199, mrp: 239, weight: "350 g",
    img: "images/lemon-pickle.jpg",
    desc: "Tangy nimbu achar with green chillies. Perfect with paratha and khichdi." },
  { id: "p4", name: "Garlic Pickle", cat: "pickles", price: 219, mrp: 259, weight: "300 g",
    img: "images/garlic-pickle.jpg",
    desc: "Whole garlic cloves in mustard-fenugreek masala. Bold and punchy." },
  { id: "s1", name: "Haldi Powder", cat: "spices", price: 89, mrp: 110, weight: "200 g",
    img: "images/haldi.jpg",
    desc: "High-curcumin turmeric, stone-ground. Bright colour for dals and sabzis." },
  { id: "s2", name: "Lal Mirch Powder", cat: "spices", price: 99, mrp: 125, weight: "200 g",
    img: "images/lal-mirch.jpg",
    desc: "Byadgi + Guntur blend. Colour without harsh heat." },
  { id: "s3", name: "Garam Masala", cat: "spices", price: 149, mrp: 179, weight: "100 g",
    img: "images/garam-masala.jpg",
    desc: "Small-batch roast of cardamom, cinnamon, cloves, black pepper and nutmeg." },
  { id: "s4", name: "Jeera Whole", cat: "spices", price: 119, mrp: 145, weight: "200 g",
    img: "images/jeera.jpg",
    desc: "Bold cumin seeds for tadka. Aroma hits as soon as they hit hot oil." },
  { id: "s5", name: "Dhania Powder", cat: "spices", price: 79, mrp: 99, weight: "200 g",
    img: "images/dhania.jpg",
    desc: "Freshly milled coriander. Base of every North Indian gravy." },
  { id: "g1", name: "Aged Basmati Rice", cat: "groceries", price: 189, mrp: 229, weight: "1 kg",
    img: "images/basmati.jpg",
    desc: "Long-grain, aged 12 months. Fluffy biryani and everyday steamed rice." },
  { id: "g2", name: "Toor Dal", cat: "groceries", price: 159, mrp: 185, weight: "1 kg",
    img: "images/toor-dal.jpg",
    desc: "Unpolished pigeon peas. Soft cook, rich flavour for sambar and dal tadka." },
  { id: "g3", name: "Chakki Atta", cat: "groceries", price: 69, mrp: 85, weight: "1 kg",
    img: "images/atta.jpg",
    desc: "Stone-ground whole wheat. Soft rotis that stay pliable." },
  { id: "g4", name: "Kachi Ghani Mustard Oil", cat: "groceries", price: 179, mrp: 210, weight: "1 L",
    img: "images/mustard-oil.jpg",
    desc: "Cold-pressed mustard oil for pickles, fish curry and winter saag." },
  { id: "g5", name: "Organic Jaggery", cat: "groceries", price: 129, mrp: 155, weight: "900 g",
    img: "images/jaggery.jpg",
    desc: "Set gur from sugarcane. For chai, churma and festive sweets." },
  { id: "g6", name: "Assam CTC Tea", cat: "groceries", price: 199, mrp: 240, weight: "500 g",
    img: "images/tea.jpg",
    desc: "Strong cutting-chai leaf. Holds milk and adrak without going thin." }
];

const CART_KEY = "pandeys_real_taste_cart";

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}
function addToCart(id) {
  const cart = getCart();
  const found = cart.find(i => i.id === id);
  if (found) found.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart(cart);
  toast("Added to basket");
}
function setQty(id, qty) {
  let cart = getCart();
  if (qty <= 0) cart = cart.filter(i => i.id !== id);
  else cart = cart.map(i => i.id === id ? { ...i, qty } : i);
  saveCart(cart);
  if (document.getElementById("cart-list")) renderCart();
}
function cartCount() {
  return getCart().reduce((n, i) => n + i.qty, 0);
}
function updateCartCount() {
  document.querySelectorAll("[data-cart-count]").forEach(el => el.textContent = cartCount());
}
function toast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.style.display = "block";
  setTimeout(() => t.style.display = "none", 1800);
}

function productCard(p) {
  return `<article class="card">
    <img src="${p.img}" alt="${p.name}">
    <div class="body">
      <div class="tag">${p.cat}</div>
      <h3>${p.name}</h3>
      <p>${p.weight}</p>
      <div class="price">₹${p.price} <s>₹${p.mrp}</s></div>
      <button class="add" onclick="addToCart('${p.id}')">Add to basket</button>
    </div>
  </article>`;
}

function renderFeatured() {
  const el = document.getElementById("featured");
  if (!el) return;
  el.innerHTML = PRODUCTS.slice(0, 8).map(productCard).join("");
}

function renderShop() {
  const el = document.getElementById("shop-grid");
  if (!el) return;
  const q = (document.getElementById("search")?.value || "").toLowerCase();
  const cats = [...document.querySelectorAll(".f-cat:checked")].map(i => i.value);
  const list = PRODUCTS.filter(p => {
    const okCat = !cats.length || cats.includes(p.cat);
    const okQ = !q || p.name.toLowerCase().includes(q) || p.cat.includes(q);
    return okCat && okQ;
  });
  el.innerHTML = list.length ? list.map(productCard).join("") : "<p>No items match your filters.</p>";
}

function renderCart() {
  const list = document.getElementById("cart-list");
  if (!list) return;
  const cart = getCart();
  if (!cart.length) {
    list.innerHTML = `<p>Your basket is empty. <a href="shop.html">Browse the pantry →</a></p>`;
    document.getElementById("sum-sub").textContent = "₹0";
    document.getElementById("sum-ship").textContent = "₹0";
    document.getElementById("sum-total").textContent = "₹0";
    return;
  }
  let sub = 0;
  list.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    sub += p.price * item.qty;
    return `<div class="cart-item">
      <img src="${p.img}" alt="${p.name}">
      <div>
        <strong>${p.name}</strong>
        <div>${p.weight} · ₹${p.price}</div>
        <div class="qty">
          <button onclick="setQty('${p.id}', ${item.qty - 1})">−</button>
          <span>${item.qty}</span>
          <button onclick="setQty('${p.id}', ${item.qty + 1})">+</button>
        </div>
      </div>
      <div>₹${p.price * item.qty}</div>
    </div>`;
  }).join("");
  const ship = sub >= 499 ? 0 : 49;
  document.getElementById("sum-sub").textContent = "₹" + sub;
  document.getElementById("sum-ship").textContent = ship ? "₹" + ship : "Free";
  document.getElementById("sum-total").textContent = "₹" + (sub + ship);
}

function checkout() {
  if (!getCart().length) return toast("Basket is empty");
  localStorage.removeItem(CART_KEY);
  updateCartCount();
  renderCart();
  toast("Order placed! Pay on delivery.");
}

function toggleNav() {
  document.getElementById("nav-links")?.classList.toggle("open");
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderFeatured();
  renderShop();
  renderCart();
  document.getElementById("search")?.addEventListener("input", renderShop);
  document.querySelectorAll(".f-cat").forEach(el => el.addEventListener("change", renderShop));
});
