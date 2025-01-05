let panier = JSON.parse(localStorage.getItem('panier')) || [];

async function getProductsFromSheet() {
  const sheetId = '1vFod5-4hyPG5NArGzSd44qwJ-B7NZAofCU8QnNSV7F';  // Remplace par ton ID de la feuille
  const sheetRange = 'A2:D';  // Range de ta feuille (A2:D pour les colonnes A, B, C, D)
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetRange}?key=AIzaSyBnZYIO7Hvjhy-ivE_sFRUaCqXPNuWl08U`;  // Replace TON_API_KEY by your actual API key

  try {
    const response = await fetch(url);
    const data = await response.json();
    displayProducts(data.values);  // Affiche les produits récupérés
  } catch (error) {
    console.error('Erreur lors de la récupération des produits :', error);
  }
}

function displayProducts(products) {
  const container = document.getElementById('product-list');
  container.innerHTML = '';  // Clear existing products
  products.forEach(product => {
    const [name, description, imageUrl, price] = product;
    container.innerHTML += `
      <div class="product">
        <img src="${imageUrl}" alt="${name}">
        <div class="product-details">
          <p>${name} - ${price}€</p>
          <button onclick="ajouterAuPanier('${name}', ${price})">Ajouter au Panier</button>
        </div>
      </div>
    `;
  });
}

function ajouterAuPanier(name, price) {
  panier.push({ name, price });
  localStorage.setItem('panier', JSON.stringify(panier));
  displayPanier();
}

function displayPanier() {
  const panierContainer = document.getElementById('panier-list');
  panierContainer.innerHTML = '';
  panier.forEach(item => {
    panierContainer.innerHTML += `<p>${item.name} - ${item.price}€</p>`;
  });
}

async function passerCommande() {
  const clientName = prompt("Entrez votre nom pour passer la commande :");
  if (!clientName) return;

  const sheetId = '1vFod5-4hyPG5NArGzSd44qwJ-B7NZAofCU8QnNSV7F';  // Remplace par ton ID de la feuille
  const sheetRange = 'A2:D'; 
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetRange}:append?valueInputOption=RAW&key=AIzaSyBnZYIO7Hvjhy-ivE_sFRUaCqXPNuWl08U`;  // Replace TON_API_KEY by your actual API key

  const values = panier.map(item => [item.name, 1, item.price, clientName]);  // Format des données à envoyer
  const body = { values };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const result = await response.json();  // Réponse du serveur
    alert('Commande passée avec succès!');
    panier = [];
    localStorage.removeItem('panier');  // Vider le panier
    displayPanier();  // Actualiser l'affichage du panier
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la commande :', error);
  }
}

// Appel de la fonction pour afficher les produits au chargement
getProductsFromSheet();
