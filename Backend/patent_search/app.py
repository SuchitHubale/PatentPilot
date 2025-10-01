from flask import Flask, render_template, request, jsonify
import json
import time # Import time for sleep in retry logic
from google.api_core import exceptions # Import exceptions for specific error handling

from bert import * # Assumes bert.py contains s_v, indx, model, index, df
from flask_paginate import Pagination, get_page_parameter # Pagination is imported but not used in provided routes
import google.generativeai as genai
import os

# ✅ Direct Gemini API key configuration
# It's highly recommended to use environment variables for API keys in production
# For example: genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
genai.configure(api_key="AIzaSyCf0WAAHCByOHVuSXTco8bTcRg5TXDT0tc")

app = Flask(__name__)

@app.route('/')
def msg():
    return render_template('index.html')

@app.route('/api/bert_search', methods=['POST'])
def api_bert_search():
    data = request.get_json()
    user_idea = data.get('idea', '')
    if not user_idea:
        return jsonify({'error': 'No idea provided'}), 400

    D, I = s_v([user_idea], model, index, num_results=5)
    similar_patents = indx(df, I)
    similar_patents = [item for sublist in similar_patents for item in sublist]

    return jsonify({'similar_patents': similar_patents})

@app.route('/api/gemini_suggest', methods=['POST'])
def api_gemini_suggest():
    data = request.get_json()
    user_idea = data.get('idea', '')
    similar_patents = data.get('similar_patents', [])

    if not user_idea or not similar_patents:
        return jsonify({'error': 'Missing idea or similar_patents'}), 400

    # Build patent information for the prompt
    patent_info = ""
    for i, patent in enumerate(similar_patents, 1):
        title = patent.get('title', 'N/A')
        abstract = patent.get('abstract', 'N/A')
        patent_number = patent.get('publication_number', '')
        date = patent.get('date', 'N/A')
        patent_info += f"{i}. **{title}**\n   - Patent Number: {patent_number}\n   - Date: {date}\n   - Abstract: {abstract}\n\n"

    prompt = f"""You are an expert patent analyst AI assistant. Analyze the user's invention idea against similar patents found through semantic search.

**User's Invention Idea:**
{user_idea}

**Similar Patents Found ({len(similar_patents)}):**
{patent_info}

**Instructions:**
Provide a comprehensive patent analysis in the following structured format. Use clear headings and professional language.

## 📊 Patent Landscape Analysis

Provide a brief overview of how the user's idea relates to the existing patent landscape.

## 🔍 Key Overlaps with Existing Patents

Identify and explain the main areas where the user's idea overlaps with the similar patents listed above. Reference specific patent titles or numbers.

## ✨ Novelty & Unique Aspects

Highlight what is **new, unique, or different** in the user's idea that is NOT covered by the existing patents. Be specific about the innovative elements.

## 💡 Recommendations to Strengthen Patentability

Suggest 3-5 concrete improvements or modifications that would:
- Increase the novelty of the invention
- Make it more defensible as a patent
- Differentiate it from prior art

## ⚖️ Patentability Assessment

Provide a brief assessment of the overall patentability potential (High/Medium/Low) with reasoning.

**Important Guidelines:**
- Be concise and professional
- Use bullet points for clarity
- Reference specific patents when making comparisons
- Focus on actionable insights
- Do not include disclaimers about missing information
"""

    # DEBUGGING LOG
    print("Sending prompt to Gemini:\n", prompt)

    # --- Start of Gemini API call with retry logic ---
    model_name = 'models/gemini-2.5-flash' 
    max_retries = 5
    initial_delay = 1 # seconds
    
    for attempt in range(max_retries):
        try:
            print(f"Attempt {attempt + 1}/{max_retries} to call Gemini API with model: {model_name}")
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)

            # DEBUGGING LOG
            print("Gemini Response: ", response)

            # Check if the response has text content
            suggestion = response.text if hasattr(response, 'text') else str(response)
            return jsonify({'suggestion': suggestion})

        except exceptions.ResourceExhausted as e:
            # Handle 429 Quota Exceeded error
            print(f"Quota exceeded for model {model_name}. Retrying in {initial_delay} seconds...")
            time.sleep(initial_delay)
            initial_delay *= 2 # Exponential backoff
        except exceptions.NotFound as e:
            # Handle 404 Not Found error (model name issue)
            print(f"Model '{model_name}' not found or not supported. Error: {e}")
            print("Please check the model name or your API key's permissions.")
            return jsonify({'error': f"Model '{model_name}' not found or supported: {str(e)}"}), 500
        except Exception as e:
            # Catch any other unexpected errors
            print("Error in Gemini API call:", str(e))
            return jsonify({'error': str(e)}), 500
    
    # If all retries fail
    print(f"Failed to get a response from Gemini after {max_retries} attempts due to quota limits.")
    return jsonify({'error': 'Failed to get a response from Gemini due to repeated quota limits.'}), 500
    # --- End of Gemini API call with retry logic ---


# 🚀 Run Flask app
if __name__ == '__main__':
    app.run(port=8080)
