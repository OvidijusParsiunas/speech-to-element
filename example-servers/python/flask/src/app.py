from requests.exceptions import ConnectionError
from dotenv import load_dotenv
from flask_cors import CORS
from client import Client
from flask import Flask

# ------------------ SETUP ------------------

load_dotenv()

app = Flask(__name__)

# this will need to be reconfigured before taking the app to production
cors = CORS(app)

# ------------------ EXCEPTION HANDLERS ------------------

@app.errorhandler(Exception)
def handle_exception(e):
    print(e)
    return str(e), 500

@app.errorhandler(ConnectionError)
def handle_exception(e):
    print(e)
    return {"error": "Internal service error"}, 500


# ------------------ CONTROLLER ------------------

client = Client()

@app.route("/token", methods=["GET"])
def request_speech_token():
    return client.request_speech_token()

# ------------------ START SERVER ------------------

if __name__ == "__main__":
    app.run(port=8080)
