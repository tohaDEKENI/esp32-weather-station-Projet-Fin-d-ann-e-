from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql
import random

app = Flask(__name__)
CORS(app)  # Autorise les requêtes depuis d'autres origines (ex : frontend)

# Configuration de la base de données
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "to70ha22",
    "database": "station_meteo"
}

data = {"humidite": None, "temperature": None}  # Stockage temporaire des données reçues

#==================================================================================================================================================================
# Route principale : génère température + humidité, stocke si changement
@app.route("/")
def generate_and_store():
    temperature = round(random.uniform(20, 30), 2)  # Génère température aléatoire entre 29 et 30
    humidite = round(random.uniform(60, 85), 2)     # Génère humidité aléatoire entre 84 et 85

    try:
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()

        # Récupère la dernière mesure insérée
        cursor.execute("SELECT temperature, humidite FROM mesure ORDER BY id_mesure DESC LIMIT 1")
        last = cursor.fetchone()

        if last:
            last_temperature, last_humidite = last
            # Compare avec la nouvelle valeur
            if temperature == last_temperature and humidite == last_humidite:
                connection.close()
                # Si identique, ne rien insérer
                return jsonify({
                    "temperature": temperature,
                    "humidite": humidite
                })

        # Si changement, insère dans la base
        cursor.execute(
            "INSERT INTO mesure (temperature, humidite) VALUES (%s, %s)",
            (temperature, humidite)
        )
        connection.commit()
        connection.close()

    except Exception as e:
        print("❌ Erreur MySQL :", e)
        return jsonify({"error": str(e)}), 500

    return jsonify({
        "temperature": temperature,
        "humidite": humidite
    })

#=========================================================================================================================================================================

# Route qui renvoie les 10 dernières mesures pour afficher sur la courbe
@app.route('/getData')
def get_data():
    try:
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()
        cursor.execute("SELECT temperature, humidite, date_heure FROM mesure ORDER BY date_heure DESC LIMIT 10")
        rows = cursor.fetchall()
        connection.close()

        data = [
            {
                "temperature": row[0],
                "humidite": row[1],
                "date_heure": row[2]
            }
            for row in rows
        ]

        return jsonify(data)

    except Exception as e:
        print("❌ Erreur dans /getData :", e)
        return jsonify({"error": str(e)}), 500
    
#=================================================================================================================================================================

@app.route('/historique_par_jour')
def historique_par_jour():
    jour = request.args.get('jour')  # Récupère la date passée en paramètre dans l'URL

    if not jour:
        return jsonify({"error": "Veuillez fournir une date au format AAAA-MM-JJ en paramètre, ex: ?jour=2025-07-10"}), 400

    try:
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()

        # Requête pour moyenne température et humidité
        query_moyenne = """
            SELECT 
                ROUND(AVG(temperature), 2) AS temperature_moyenne,
                ROUND(AVG(humidite), 2) AS humidite_moyenne
            FROM 
                mesure
            WHERE 
                DATE(date_heure) = %s
        """
        cursor.execute(query_moyenne, (jour,))
        moyenne_row = cursor.fetchone()

        # Requête pour récupérer toutes les températures distinctes du jour
        query_distinct = """
            SELECT DISTINCT temperature, humidite
            FROM mesure
            WHERE DATE(date_heure) = %s
            ORDER BY temperature, humidite
        """
        cursor.execute(query_distinct, (jour,))
        distinct_rows = cursor.fetchall()

        connection.close()

        if moyenne_row and moyenne_row[0] is not None:
            result = {
                "jour": jour,
                "temperature_moyenne": moyenne_row[0],
                "humidite_moyenne": moyenne_row[1],
                "valeurs_distinctes": [
                    {"temperature": row[0], "humidite": row[1]} for row in distinct_rows
                ]
            }
            return jsonify(result)
        else:
            return jsonify({"message": f"Aucune donnée trouvée pour le {jour}"}), 404

    except Exception as e:
        print("❌ Erreur dans /historique_par_jour :", e)
        return jsonify({"error": str(e)}), 500


#====================================================================================================================================================================================


# Route qui reçoit des données envoyées depuis un capteur 
@app.route('/receive', methods=['POST'])
def receive():
    global data
    dataDHT = request.json  # Récupère les données envoyées en JSON
    data = dataDHT
    print("✅ Données reçues :", data)
    return {"status": "ok"}

# Démarrage du serveur Flask
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)


'''
Exemple pour récupérer l'heure actuelle :
now = datetime.now()
timestamp = now.strftime("%Y-%m-%d %H:%M:%S")
'''
