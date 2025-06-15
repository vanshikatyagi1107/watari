import json
import random
import pickle
import nltk
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

stemmer = PorterStemmer()

with open("intents.json") as file:
    data = json.load(file)

# Prepare training data
sentences = []
labels = []
label_responses = {}

for intent in data['intents']:
    for pattern in intent['patterns']:
        sentences.append(pattern.lower())
        labels.append(intent['tag'])
    label_responses[intent['tag']] = intent['responses']

# Vectorize
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(sentences)

# Train
model = MultinomialNB()
model.fit(X, labels)

# Save model and vectorizer
with open("chatbot_model.pkl", "wb") as f:
    pickle.dump(model, f)

with open("vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

# Save responses
with open("responses.json", "w") as f:
    json.dump(label_responses, f)

print("Training complete!")
