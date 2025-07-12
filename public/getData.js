// Fonction pour récupérer les données de température et d'humidité depuis le serveur
async function GetData() {
    // Sélectionne les éléments HTML où afficher les valeurs
    const temperature = document.getElementById("temperature");
    const humidity = document.getElementById("humidity");
    const progressBar = document.getElementById("progressBar");
    const progressBarHum = document.getElementById("progressBarHum");

    try {
        // Appelle l'API Flask pour récupérer les nouvelles valeurs
        const response = await fetch("http://127.0.0.1:5000");
        const data = await response.json(); // Convertit la réponse en JSON
        console.log(data); // Affiche les données dans la console pour vérifier

        // Met à jour les valeurs affichées dans le HTML
        temperature.textContent = data.temperature + " °C";
        humidity.textContent = data.humidite + " %";

        // Met à jour la barre de progression pour la température
        progressBar.value = data.temperature;
        // Met à jour la barre de progression pour l'humidité
        progressBarHum.value = data.humidite;
    } catch (err) {
        console.error("Erreur de récupération :", err);

        // Si erreur, affiche "Erreur" à la place des valeurs
        temperature.textContent = "Erreur";
        humidity.textContent = "Erreur";
    }
}

// Appelle une première fois la fonction quand la page charge
GetData();
// Puis répète l'appel toutes les 5 secondes pour actualiser les données
setInterval(GetData, 5000);

/*
let progress = 0;
const progressBar = document.getElementById("progressBar");

const simulateLoading = setInterval(() => {
    if (progress >= 100) {
        clearInterval(simulateLoading);
        console.log("Chargement terminé !");
    } else {
        progress += 5;
        progressBar.value = progress;
    }
}, 100);
*/