from flask import Flask, request, jsonify
from flask_cors import CORS

from util import BlunderExplainer

app = Flask(__name__)
CORS(app)
explainer = BlunderExplainer("stockfish.exe")

@app.route("/analysis", methods=['GET'])
def analyze():
    # load game from pgn
    pgn = request.args.get("pgn")
    positions = explainer.get_positions(pgn)
    
    return jsonify([position.encode() for position in positions])

if __name__ == '__main__':
    app.run(debug=True)