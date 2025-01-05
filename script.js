// Exemple de produits
const products = [
    { id: 1, name: 'Bière', price: 5 },
    { id: 2, name: 'Cocktail', price: 8 },
    { id: 3, name: 'Whisky', price: 10 }
];

const productContainer = document.getElementById('product-list');
const cartContainer = document.getElementById('cart-list');

let cart = [];

// Afficher les produits
function displayProducts() {
    products.forEach(product => {
        const productItem = document.createElement('li');
        productItem.innerHTML = `
            ${product.name} - ${product.price}€
            <button onclick="addToCart(${product.id})">Ajouter au panier</button>
        `;
        productContainer.appendChild(productItem);
    });
}

// Ajouter au panier
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingProduct = cart.find(p => p.id === product.id);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    displayCart();
}

// Afficher le panier
function displayCart() {
    cartContainer.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.innerHTML = `
            ${item.name} - ${item.price}€ x ${item.quantity}
            <button onclick="removeFromCart(${item.id})">Retirer</button>
        `;
        cartContainer.appendChild(cartItem);
    });
}

// Supprimer du panier
function removeFromCart(productId) {
    cart = cart.filter(p => p.id !== productId);
    displayCart();
}

// Valider le panier et envoyer les commandes au Google Sheets
document.getElementById('checkout').addEventListener('click', () => {
    // Appel API Google Sheets ici
    console.log('Commande validée !', cart);

    // TODO: Intégrer Google Sheets API pour envoyer les données
});

// Initialisation
displayProducts();


// Attacher l'événement de validation
document.getElementById("validate-cart").addEventListener("click", validateCart);
