// Définir l'ID de la feuille Google Sheets
const sheetId = '1vFod5-4hyPG5NArGzSd44qwJ-B7NZAofCU8QnNSV7F'; // Remplacez par votre ID de Sheet
const range = 'A:C'; // Colonne de données (nom du produit, image, prix)

// Fonction pour charger les produits depuis Google Sheets
async function loadProducts() {
    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=AIzaSyBnZYIO7Hvjhy-ivE_sFRUaCqXPNuWl08U`); // Replace with your Google Sheets API Key
        const data = await response.json();
        const products = data.values;
        displayProducts(products);
    } catch (error) {
        console.error('Erreur lors du chargement des produits :', error);
    }
}

// Fonction pour afficher les produits sur la page
function displayProducts(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Nettoyer la liste avant d'ajouter de nouveaux produits

    products.forEach(product => {
        const [name, image, price] = product; // Nom, image, prix du produit
        const productElement = `
            <div class="product">
                <img src="${image}" alt="${name}">
                <p>${name}</p>
                <p>Prix : ${price}</p>
                <input type="number" min="1" placeholder="Quantité" data-name="${name}" data-price="${price}">
                <button class="add-to-cart" data-name="${name}" data-price="${price}">Ajouter au panier</button>
            </div>
        `;
        productList.innerHTML += productElement;
    });

    // Ajouter des écouteurs d'événements pour les boutons "Ajouter au panier"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Gestion du panier
function addToCart(event) {
    const button = event.target;
    const name = button.dataset.name;
    const price = button.dataset.price;
    const quantityInput = button.previousElementSibling;
    const quantity = quantityInput.value;

    if (quantity && quantity > 0) {
        const cartItem = { name, price, quantity };
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    } else {
        alert('Veuillez entrer une quantité valide.');
    }
}

// Mise à jour de l'affichage du panier
function updateCartDisplay() {
    const cartList = document.getElementById('cartList');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartList.innerHTML = '';

    cart.forEach(item => {
        const cartItemElement = `
            <li>
                ${item.name} - ${item.quantity} x ${item.price}€
            </li>
        `;
        cartList.innerHTML += cartItemElement;
    });
}

// Charger les produits au chargement de la page
document.addEventListener('DOMContentLoaded', loadProducts);
