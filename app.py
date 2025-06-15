from flask import Flask, render_template, request, jsonify
import pickle
import json
import random

app = Flask(__name__)

with open("chatbot_model.pkl", "rb") as f:
    model = pickle.load(f)

with open("vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

with open("responses.json", "r") as f:
    responses = json.load(f)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chatbot_response():
    user_input = request.json["message"]
    user_vec = vectorizer.transform([user_input.lower()])
    tag = model.predict(user_vec)[0]
    response = random.choice(responses[tag])
    return jsonify({"response": response})


if __name__ == "__main__":
    app.run(debug=True)
