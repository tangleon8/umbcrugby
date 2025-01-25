# app.py
from flask import Flask, request, jsonify
from port import RugbyAssistant

app = Flask(__name__)
rugby_ai = RugbyAssistant()

@app.route("/ask_rugby", methods=["POST"])
def ask_rugby():
    data = request.get_json()
    question = data.get("question", "")
    if not question:
        return jsonify({"error": "No question provided"}), 400

    # For simplicity, do a single-shot response (no streaming)
    answer = rugby_ai.ask_rugby(question, stream=False)
    return jsonify({"answer": answer})

if __name__ == "__main__":
    app.run(debug=True)
