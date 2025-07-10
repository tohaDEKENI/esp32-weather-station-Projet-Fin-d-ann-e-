from flask import Flask, jsonify,request
from flask_cors import CORS
import pymysql
import random

app = Flask(__name__)
CORS(app)

# Configuration de la BDD
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "to70ha22",
    "database": "station_meteo"
}

data = {"humidite":None,"temperature":None}

@app.route("/")
def generate_and_store():
    global data
    # Générer des valeurs aléatoires
    #temperature = round(random.uniform(20, 30), 2)
    #humidite = round(random.uniform(60, 85), 2)

    temperature = data["temperature"]
    humidite = data["humidite"]

    try:
        # Ouvrir une nouvelle connexion à chaque requête
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()
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

@app.route('/getData')
def get_data():
    try:
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()
        cursor.execute("SELECT temperature, humidite ,date_heure FROM mesure ORDER BY date_heure DESC LIMIT 10")
        rows = cursor.fetchall()
        connection.close()

        data = [
            {
                "temperature": row[0],
                "humidite": row[1],
                "date_heure":row[2]
            }
            for row in rows
        ]

        return jsonify(data)

    except Exception as e:
        print("❌ Erreur dans /getData :", e)
        return jsonify({"error": str(e)}), 500


@app.route('/receive', methods=['POST'])
def receive():
    global data
    dataDHT = request.json
    data = dataDHT
    print("✅ Données reçues :", data)
    return {"status": "ok"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000,debug=True)


'''
now = datetime.now()

# Formater en chaîne de caractères : "YYYY-MM-DD HH:MM:SS"
timestamp = now.strftime("%Y-%m-%d %H:%M:%S")

'''