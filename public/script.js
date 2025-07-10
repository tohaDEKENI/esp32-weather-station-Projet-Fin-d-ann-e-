function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    document.getElementById("datetime").textContent = now.toLocaleString("fr-FR", options);
}

updateDateTime();
setInterval(updateDateTime, 1000);

const ctx = document.getElementById('weatherChart').getContext('2d');

let weatherChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Température (°C)',
        data: [],  // vide au départ
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3
      },
      {
        label: 'Humidité (%)',
        data: [],  // vide au départ
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

async function GetDataAndUpdateChart() {
  try {
    const response = await fetch("http://127.0.0.1:5000/getData");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    console.log(data)

    const tempData = [];
    const humData = [];
    const labels = [];

    data.forEach(el => {
      tempData.push(el.temperature);
      humData.push(el.humidite);
      labels.push(el.date_heure.split(" ")[4] + "h")
    });

    // Met à jour les données du graphique
    weatherChart.data.labels = labels;
    weatherChart.data.datasets[0].data = tempData;
    weatherChart.data.datasets[1].data = humData;

    weatherChart.update();

  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
}

// Appelle la première fois puis toutes les secondes
GetDataAndUpdateChart();
setInterval(GetDataAndUpdateChart, 5000);
