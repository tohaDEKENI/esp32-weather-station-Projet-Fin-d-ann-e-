// Fonction pour afficher l'heure et la date en direct
function updateDateTime() {
    const now = new Date(); // Récupère la date et l'heure actuelles
    const options = { weekday: 'long', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    // Affiche sous forme : lundi, 14:30:15
    document.getElementById("datetime").textContent = now.toLocaleString("fr-FR", options);
}

// Met à jour l'heure une première fois
updateDateTime();
// Puis la met à jour toutes les secondes (1000 ms)
setInterval(updateDateTime, 1000);

// ----------------- GRAPHIQUE -----------------

// Récupère le contexte du canvas pour dessiner le graphique
const ctx = document.getElementById('weatherChart')
ctx.getContext('2d');

// Création du graphique vide au départ
let weatherChart = new Chart(ctx, {
  type: 'line', // Type de graphique : courbe
  data: {
    labels: [], // Étiquettes pour l'axe X (ex : les heures)
    datasets: [
      {
        label: 'Température (°C)',
        data: [],  // Données de température
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3 // Courbe lissée
      },
      {
        label: 'Humidité (%)',
        data: [],  // Données d'humidité
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.3
      }
    ]
  },
  options: {
    responsive: true, // S'adapte à la taille de l'écran
    maintainAspectRatio: false, // Permet d'étirer si besoin
    scales: { y: { beginAtZero: true } } // L'axe Y commence à 0
  }
});

// Fonction pour récupérer les données du serveur et mettre à jour le graphique
async function GetDataAndUpdateChart() {
  try {
    const response = await fetch("http://127.0.0.1:5000/getData"); // Appel à l'API Flask
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json(); // Récupère les données en JSON
    console.log(data); // Affiche dans la console pour vérifier

    const tempData = []; // Liste pour stocker les températures
    const humData = [];  // Liste pour stocker les humidités
    const labels = [];   // Liste pour stocker les horaires (affichage X)

    data.forEach(el => {
      tempData.push(el.temperature);     // Ajoute la température de chaque mesure
      humData.push(el.humidite);         // Ajoute l'humidité
      labels.push(el.date_heure.split(" ")[4] + "h"); // Formatage de l'heure pour l'affichage
    });

    // Met à jour les données du graphique avec les nouvelles valeurs
    weatherChart.data.labels = labels;
    weatherChart.data.datasets[0].data = tempData;
    weatherChart.data.datasets[1].data = humData;

    weatherChart.update(); // Rafraîchit le graphique

  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
}

// Premier appel pour remplir le graphique au début
GetDataAndUpdateChart();
// Puis relance toutes les 5 secondes pour mettre à jour les données
setInterval(GetDataAndUpdateChart, 5000);





//+=====================================================================================================================================================


