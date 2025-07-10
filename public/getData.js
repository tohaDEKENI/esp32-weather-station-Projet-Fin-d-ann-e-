

async function GetData() {
    const temperature = document.getElementById("temperature");
    const humidity = document.getElementById("humidity");
    const progressBar = document.getElementById("progressBar");
    const progressBarHum =document.getElementById("progressBarHum")
    try {
        const response = await fetch("http://127.0.0.1:5000");
        const data = await response.json();
        console.log(data);
        temperature.textContent = data.temperature + " °C";
        humidity.textContent = data.humidite + " %";
        progressBar.value = data.temperature
        progressBarHum.value = data.humidite
    } catch (err) {
        console.error("Erreur de récupération :", err);
        temperature.textContent = "Erreur";
        humidity.textContent = "Erreur";
    }
}
GetData()
setInterval(GetData,5000);


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