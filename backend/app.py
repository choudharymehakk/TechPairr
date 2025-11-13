from flask import Flask, jsonify
from model.modell import get_top_matches

app = Flask(__name__)

@app.route('/api/matches', methods=['GET'])
def matches():
    data = get_top_matches(top_n=3)
    return jsonify(data)