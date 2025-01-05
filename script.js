document.addEventListener('DOMContentLoaded', () => {
  const productListElement = document.getElementById('product-list');
  const cartElement = document.getElementById('cart');
  
  let products = [];
  let cart = [];

  fetch('https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/products?key=YOUR_API_KEY')
    .then(response => response.json())
    .then(data => {
      products = data.values;
      displayProducts();
    })
    .catch(error => console.error('Erreur de chargement des produits :', error));

  function displayProducts() {
    productListElement.innerHTML = products.map((product, index) => `
      <div class="product-item">
        <img src="${product[2]}" alt="${product[1]}">
        <h3>${product[1]}</h3>
        <button onclick="addToCart(${index})">Ajouter au panier</button>
      </div>
    `).join('');
  }

  function addToCart(index) {
    const product = products[index];
    cart.push(product);
    updateCart();
  }

  function updateCart() {
    cartElement.innerHTML = `
      <h2>Panier</h2>
      <ul>
        ${cart.map((product, index) => `
          <li class="cart-item">
            ${product[1]} - Quantité : 1
          </li>
        `).join('')}
        <button onclick="checkout()">Valider le panier</button>
      </ul>
    `;
  }

  function checkout() {
    fetch('https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/cart!A1:append?key=YOUR_API_KEY', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: cart })
    })
    .then(response => response.json())
    .then(data => {
      alert('Commande validée et enregistrée!');
      cart = [];
      updateCart();
    })
    .catch(error => console.error('Erreur de validation du panier :', error));
  }
});

// Charger les produits lors du chargement de la page
fetchProducts();

// Attacher l'événement de validation
document.getElementById("validate-cart").addEventListener("click", validateCart);
