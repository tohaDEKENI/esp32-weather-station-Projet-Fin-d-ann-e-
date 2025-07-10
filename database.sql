

CREATE TABLE mesure (
    id_mesure INT AUTO_INCREMENT PRIMARY KEY,
    temperature FLOAT,      
    humidite FLOAT,          
    date_heure DATETIME DEFAULT CURRENT_TIMESTAMP
);
