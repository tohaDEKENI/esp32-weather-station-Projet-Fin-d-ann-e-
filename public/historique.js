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

const ctxx = document.getElementById('weatherChart2')
ctxx.getContext('2d');

let weatherChart2 = new Chart(ctxx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Température (°C)',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.3
            },
            {
                label: 'Humidité (%)',
                data: [],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.3
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } }
    }
});

async function getHistorique() {
    const jour = document.getElementById("datePicker").value;
    if (!jour) {
        alert("Veuillez sélectionner une date !");
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:5000/historique_par_jour?jour=${jour}`);
        if (!response.ok) {
            throw new Error(`Erreur dans la requête : ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Données récupérées :", data);

        // Préparation des données pour Chart.js
        const temp = [];
        const hum = [];
        const labels = [];

        data.valeurs_distinctes.forEach((element, index) => {
            temp.push(element.temperature);
            hum.push(element.humidite);
            labels.push(`Point ${index + 1}`); // Labels automatiques
        });

        // Mettre à jour les données du graphique
        weatherChart2.data.labels = labels;
        weatherChart2.data.datasets[0].data = temp;
        weatherChart2.data.datasets[1].data = hum;
        weatherChart2.update();

        // Création dynamique du tableau
        const tableHTML = `
    <table border="1" cellpadding="8" cellspacing="0" class="table">
        <tr>
            <th>Jour</th>
            <th>Température moyenne (°C)</th>
            <th>Humidité moyenne (%)</th>
        </tr>
        <tr>
            <td>${data.jour}</td>
            <td>${data.temperature_moyenne}</td>
            <td>${data.humidite_moyenne}</td>
        </tr>
    </table>
`;

        // Remplace le contenu du bloc "data" par le tableau
        document.getElementById("data").innerHTML = tableHTML;

    } catch (err) {
        console.error("❌ Erreur :", err);
        document.getElementById("data").textContent = "Erreur lors de la récupération";
    }
}