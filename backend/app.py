# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from google import genai

# Setup Gemini API key and client
os.environ["GEMINI_KEY"] = "AIzaSyDHS7CgISTRHpEf1fPAKaoe9PajzrxuCG4"
GEMINI_KEY = os.environ.get("GEMINI_KEY")
if not GEMINI_KEY:
    raise Exception("Please set your GEMINI_KEY environment variable.")

client = genai.Client(api_key=GEMINI_KEY)
print("Sakhi (Gemini) client is ready!")

def build_refined_prompt(user_query: str) -> str:
    prompt = (
        "You are Sakhi, a compassionate and confidential assistant dedicated to helping Indian women with "
        "their judiciary rights, success stories, mental, physical, and menstrual health, safety, and overall empowerment. "
        "Your responses should be supportive, informative, and culturally sensitive. When greeting a user, start with a warm, "
        "reassuring message that emphasizes confidentiality. You only answer questions related to these topics. "
        "If a question falls outside these areas, kindly remind the user of your specialization.\n\n"
        "User question: " + user_query
    )
    return prompt

def generate_response(user_query: str) -> str:
    prompt = build_refined_prompt(user_query)
    response = client.models.generate_content(
        model="gemini-2.0-flash",  # Using Gemini model "gemini-2.0-flash"
        contents=prompt
    )
    return response.text

# Create Flask app
app = Flask(__name__)
CORS(app)  

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_query = data.get("query")
    if not user_query:
        return jsonify({"error": "No query provided"}), 400

    response_text = generate_response(user_query)
    return jsonify({"response": response_text})

if __name__ == "__main__":
    app.run(debug=True)
