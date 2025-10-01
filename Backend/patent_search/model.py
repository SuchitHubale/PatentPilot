import google.generativeai as genai
genai.configure(api_key="AIzaSyCf0WAAHCByOHVuSXTco8bTcRg5TXDT0tc")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(m.name)
