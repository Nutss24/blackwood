// Fonction pour récupérer les produits depuis Google Sheets
async function fetchProducts() {
  const SHEET_ID = '1vFod5-4hyPG5NArGzSd44qwJ-B7NZAofCU8QnNSV7F'; // Remplacez par votre GSheet ID
  const API_URL = `https://script.google.com/macros/s/AKfycbyfcK6Dmau7iOKRHn7ft0BvuZU8scdir97DW7fkm57tfFTDpo_aj2EvMOAr-kVYkJDB9g/exec`;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const products = data.values;
    let html = '';

    products.forEach((product, index) => {
      html += `
        <div class="product-card">
          <img src="${product[2]}" alt="${product[0]}">
          <h3>${product[0]}</h3>
          <p>${product[1]}</p>
          <input type="number" class="quantity" data-index="${index}" min="1" value="1">
          <button class="add-to-cart" data-index="${index}">Ajouter</button>
        </div>
      `;
    });

    document.getElementById('product-list').innerHTML = html;

    // Add event listeners for adding to cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', addToCart);
    });

  } catch (error) {
    console.error("Erreur lors du chargement des produits :", error);
  }
}

// Gestion du panier
let cart = [];
let totalAmount = 0;

function addToCart(event) {
  const index = event.target.dataset.index;
  const quantity = parseInt(document.querySelector(`.quantity[data-index="${index}"]`).value);
  const product = {
    name: document.querySelector(`.product-card img[data-index="${index}"]`).alt,
    quantity: quantity,
  };

  cart.push(product);
  updateCart();
}

function updateCart() {
  let html = '';
  totalAmount = 0;

  cart.forEach(product => {
    html += `<p>${product.name} x${product.quantity}</p>`;
    totalAmount += product.quantity * 5; // Exemple de calcul du prix unitaire (ajuster selon tes données)
  });

  document.getElementById('cart-items').innerHTML = html;
  document.getElementById('total').textContent = totalAmount;
}

// Enregistrement des commandes
document.getElementById('checkout').addEventListener('click', async () => {
  const SHEET_ID = 'votre-id-de-fiche'; // Remplacez par votre GSheet ID
  const API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Orders!A1:append?valueInputOption=RAW&key=VOTRE-CLÉ-API`;

  const orderData = cart.map(product => [product.name, product.quantity, totalAmount]);
  
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: orderData }),
    });
    alert('Commande enregistrée avec succès !');
    cart = [];
    updateCart();
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des données :", error);
  }
});

// Charger les produits lors du chargement de la page
fetchProducts();

// Attacher l'événement de validation
document.getElementById("validate-cart").addEventListener("click", validateCart);
