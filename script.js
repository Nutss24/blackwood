let cart = [];

function addToCart(productId) {
    const quantity = document.getElementById(`quantity${productId}`).value;
    const productName = document.querySelector(`#product${productId} h3`).textContent;
    const productPrice = 10; // Exemple de prix, à adapter selon vos besoins.

    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex !== -1) {
        cart[itemIndex].quantity = parseInt(quantity); // Mise à jour de la quantité
    } else {
        cart.push({ id: productId, name: productName, price: productPrice, quantity: parseInt(quantity) });
    }

    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    cart.forEach(item => {
        cartItems.innerHTML += `
            <li>
                ${item.name} - 
                Quantité : <input type="number" id="cart-quantity-${item.id}" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id})"> - 
                Total : ${item.quantity * item.price} RP
            </li>
        `;
    });

    if (cart.length === 0) {
        cartItems.innerHTML = '<li>Votre panier est vide</li>';
    }
}

function updateQuantity(productId) {
    const newQuantity = parseInt(document.getElementById(`cart-quantity-${productId}`).value);
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = newQuantity;
    }
    updateCart();
}

function checkout() {
    if (cart.length === 0) {
        alert('Votre panier est vide. Ajoutez des produits avant de passer à la commande.');
        return;
    }

    // Simuler l'envoi des données à Google Sheets ici
    console.log('Commande validée !', cart);
    alert('Commande validée et enregistrée dans Google Sheets.');
    cart = [];
    updateCart();
}
