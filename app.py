import warnings
from cryptography.utils import CryptographyDeprecationWarning
warnings.simplefilter('ignore', DeprecationWarning)
warnings.simplefilter('ignore', CryptographyDeprecationWarning)
from flask import Flask, request, jsonify
from flask_cors import CORS
import pymongo
import sys

# Replace the placeholder data with your Atlas connection string. Be sure it includes
# a valid username and password! Note that in a production environment,
# you should not store your password in plain-text here.
app = Flask(__name__)
CORS(app)

try:
  client = pymongo.MongoClient("mongodb+srv://saswath_06:iloveharry@tai.srn9l.mongodb.net/?retryWrites=true&w=majority&appName=tAi")
  
# return a friendly error if a URI error is thrown 
except pymongo.errors.ConfigurationError:
  print("An Invalid URI host error was received. Is your Atlas host name correct in your connection string?")
  sys.exit(1)

# use a database named "myDatabase"
db = client.tAi

# use a collection named "recipes"

# MongoDB connection
users = db["users"]

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = users.find_one({
        "username": data['username'],
        "password": data['password']  # In production, use password hashing!
    })
    if user:
        return jsonify({"status": "success", "message": "Login successful"})
    return jsonify({"status": "error", "message": "Invalid credentials"}), 401

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    # Check if username already exists
    if users.find_one({"username": data['username']}):
        return jsonify({"status": "error", "message": "Username already exists"}), 400
    
    # Insert new user
    users.insert_one({
        "username": data['username'],
        "password": data['password']  # In production, use password hashing!
    })
    return jsonify({"status": "success", "message": "Registration successful"})

# Flask backend (app.py)
@app.route('/api/all-users', methods=['GET'])
def get_all_users():
    all_users = list(users.find({}, {"_id": 0}))  # Removed the print statement
    return jsonify({"status": "success", "users": all_users})

if __name__ == '__main__':
    app.run(debug=True)