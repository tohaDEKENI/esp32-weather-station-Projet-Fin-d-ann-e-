function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    document.getElementById("datetime").textContent = now.toLocaleString("fr-FR", options);
}

updateDateTime();
setInterval(updateDateTime, 1000);


const ctx = document.getElementById('weatherChart').getContext('2d');

const labels = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
const tempData = [12, 19, 3, 5, 2, 3, 7]; // exemple de données par jour

const humData = [ 5, 2, 3, 7,12, 19];

const weatherChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [
            {
                label: 'Température (°C)',
                data: tempData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.3
            },
            {
                label: 'Humidité (%)',
                data: humData,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.3
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { beginAtZero: true }
        }
    }
});
