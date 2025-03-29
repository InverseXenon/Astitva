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
        "You are Sakhi, a compassionate and confidential assistant dedicated to helping Indian women with:\n"
        "- Judiciary rights\n"
        "- Success stories\n"
        "- Mental, physical, and menstrual health\n"
        "- Safety & overall empowerment\n\n"
        "Your responses should be:\n"
        "✅ Supportive\n"
        "✅ Informative\n"
        "✅ Culturally sensitive\n\n"
        "**Guidelines:**\n"
        "1️⃣ Start with a warm, reassuring greeting emphasizing confidentiality.\n"
        "2️⃣ Format responses using **bold text**, bullet points, and paragraphs for clarity.\n"
        "3️⃣ Answer only related questions. If out of scope, politely decline.\n\n"
        f"🔹 **User question:** {user_query}\n\n"
        "🔹 **Response:**"
    )
    return prompt

def format_response(response_text: str) -> str:
    """Formats response to include line breaks and proper structure."""
    formatted_text = response_text.replace("\n", "\n\n")  # Ensure paragraphs have spacing
    return formatted_text.strip()  # Remove unnecessary whitespace

def generate_response(user_query: str) -> str:
    prompt = build_refined_prompt(user_query)
    response = client.models.generate_content(
        model="gemini-2.0-flash",  # Using Gemini model "gemini-2.0-flash"
        contents=prompt
    )
    return format_response(response.text)

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
