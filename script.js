// Fichier : script.js

// URL de l'API Google Sheets (remplacez par votre propre URL générée via Apps Script)
const SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbyfcK6Dmau7iOKRHn7ft0BvuZU8scdir97DW7fkm57tfFTDpo_aj2EvMOAr-kVYkJDB9g/exec";

// Chargement des produits depuis Google Sheets
async function loadProducts() {
    try {
        const response = await fetch(`${SHEETS_API_URL}?action=getProducts`);
        const products = await response.json();

        const container = document.getElementById("products-container");
        container.innerHTML = ""; // Vider le conteneur avant de le remplir

        products.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product");

            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}" />
                <h3>${product.name}</h3>
                <p>${product.price} €</p>
                <button onclick="addToCart('${product.id}', '${product.name}', ${product.price})">Ajouter au panier</button>
            `;

            container.appendChild(productDiv);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des produits :", error);
    }
}

// Panier (stocké localement dans une variable)
const cart = {};

function addToCart(id, name, price) {
    if (!cart[id]) {
        cart[id] = { name, price, quantity: 1 };
    } else {
        cart[id].quantity++;
    }
    renderCart();
}

function renderCart() {
    const container = document.getElementById("cart-container");
    container.innerHTML = "";

    const items = Object.values(cart);
    if (items.length === 0) {
        container.innerHTML = "<p>Votre panier est vide.</p>";
        return;
    }

    items.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <span>${item.name} - ${item.price} € x ${item.quantity}</span>
            <button onclick="updateQuantity('${item.name}', -1)">-</button>
            <button onclick="updateQuantity('${item.name}', 1)">+</button>
        `;

        container.appendChild(cartItem);
    });
}

function updateQuantity(name, delta) {
    const item = Object.values(cart).find(i => i.name === name);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            delete cart[item.name];
        }
    }
    renderCart();
}

// Validation du panier
async function validateCart() {
    const items = Object.values(cart);
    if (items.length === 0) {
        alert("Votre panier est vide !");
        return;
    }

    try {
        const response = await fetch(SHEETS_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "submitOrder", items })
        });

        const result = await response.json();
        if (result.success) {
            alert("Commande validée avec succès !");
            Object.keys(cart).forEach(key => delete cart[key]); // Réinitialiser le panier
            renderCart();
        } else {
            alert("Erreur lors de la validation de la commande.");
        }
    } catch (error) {
        console.error("Erreur lors de la validation de la commande :", error);
    }
}

// Charger les produits au démarrage
loadProducts();

// Attacher l'événement de validation
document.getElementById("validate-cart").addEventListener("click", validateCart);
