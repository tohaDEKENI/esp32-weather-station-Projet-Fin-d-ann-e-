const express = require("express");
const path = require("path");

const app = express();

// Sert le dossier "public" (CSS ET JAVASCRIPT.) 
app.use(express.static(path.join(__dirname, "public")));

// Route principale 
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "templates", "index.html"));
});

// Lancement du serveur
app.listen(8080, () => {
  console.log("Serveur lancé sur le port 8080 : http://localhost:8080");
});