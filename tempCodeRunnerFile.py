from flask import Flask, request, jsonify, send_from_directory
import requests

app = Flask(__name__)
app.static_folder = 'static'

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

@app.route('/index.html')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/chatbot.html')
def chatbot():
    return send_from_directory('.', 'chatbot.html')

SDG_PROMPTS = {
    1: "You are SDG 1 Expert (No Poverty). Only answer poverty-related questions. For other SDGs, say: 'Please select the relevant SDG from dropdown.'",
    2: "You are SDG 2 Expert (Zero Hunger). Only answer food security and hunger related queries.",
    3: "You are SDG 3 Expert (Good Health and Well-being). Answer health and wellbeing questions.",
    4: "You are SDG 4 Expert (Quality Education). Answer education-related queries.",
    5: "You are SDG 5 Expert (Gender Equality). Talk only about gender equality.",
    6: "You are SDG 6 Expert (Clean Water and Sanitation). Focus only on water, hygiene, sanitation topics.",
    7: "You are SDG 7 Expert (Affordable and Clean Energy). Energy-related solutions only.",
    8: "You are SDG 8 Expert (Decent Work and Economic Growth). Employment and economy topics only.",
    9: "You are SDG 9 Expert (Industry, Innovation and Infrastructure). Innovation, infra, industries.",
    10: "You are SDG 10 Expert (Reduced Inequalities). Only focus on reducing inequalities.",
    11: "You are SDG 11 Expert (Sustainable Cities and Communities). Sustainable cities talk only.",
    12: "You are SDG 12 Expert (Responsible Consumption and Production). Focus on consumption and production practices.",
    13: "You are SDG 13 Expert (Climate Action). Talk only about climate-related actions.",
    14: "You are SDG 14 Expert (Life Below Water). Only marine life protection topics.",
    15: "You are SDG 15 Expert (Life on Land). Forests, land ecosystems, biodiversity only.",
    16: "You are SDG 16 Expert (Peace, Justice and Strong Institutions). Only peace, law, governance discussions.",
    17: "You are SDG 17 Expert (Partnerships for the Goals). Discuss partnerships, collaborations, teamwork for SDGs."
}

@app.route('/ask', methods=['POST'])
def ask():
    if not request.is_json:
        return jsonify({'reply': 'Invalid request format. JSON required.'}), 400

    data = request.get_json()
    try:
        sdg_number = int(data['sdg'])
        user_message = data['message']
    except (KeyError, ValueError):
        return jsonify({'reply': 'Missing or invalid data.'}), 400

    if not is_question_relevant(sdg_number, user_message):
        return jsonify({'reply': "This question doesn't match the selected SDG. Please choose the correct SDG or ask a relevant question."})

    # Build prompt for LLM
    prompt = f"{SDG_PROMPTS[sdg_number]}\nUser: {user_message}\nAssistant:"
    payload = {
        "model": "phi3:3.8b-mini-128k-instruct-q4_K_M",
        "prompt": prompt,
        "stream": False
    }

    headers = { "Content-Type": "application/json" }

    # Direct call to Ollama's API
    ollama_url = "http://localhost:11434/api/generate"
    try:
        response = requests.post(ollama_url, headers=headers, json=payload)
        if response.status_code == 200:
            result = response.json()
            reply = result.get('response', '').strip()
            return jsonify({'reply': reply})
        else:
            return jsonify({'reply': f"Error from LLM: {response.status_code} - {response.text}"})
    except requests.exceptions.RequestException as e:
        return jsonify({'reply': f"Failed to reach LLM: {str(e)}"})

def is_question_relevant(sdg_number, question):
    keywords = {
        1: ['poverty', 'poor', 'income', 'inequality', 'social protection', 'vulnerable', 'basic needs', 'financial inclusion', 'economic opportunity', 'unemployment', 'social safety net', 'extreme poverty', 'livelihood', 'minimum wage', 'subsistence', 'deprivation', 'poverty line', 'food insecurity', 'homeless', 'marginalized', 'social welfare'],
        2: ['hunger', 'food', 'nutrition', 'malnutrition', 'undernourished', 'agriculture', 'food security', 'crop', 'farming', 'livestock', 'food access', 'food production', 'sustainable agriculture', 'food systems', 'food supply', 'food waste', 'food bank', 'starvation', 'child nutrition', 'food aid'],
        3: ['health', 'well-being', 'medicine', 'disease', 'illness', 'healthcare', 'hospital', 'doctor', 'nurse', 'mental health', 'child mortality', 'maternal health', 'vaccination', 'epidemic', 'pandemic', 'HIV', 'AIDS', 'malaria', 'sanitation', 'universal health coverage'],
        4: ['education', 'school', 'learning', 'teacher', 'student', 'literacy', 'numeracy', 'primary education', 'secondary education', 'higher education', 'inclusive education', 'quality education', 'curriculum', 'educational access', 'scholarship', 'educational resources', 'dropout', 'enrollment', 'educational equity', 'lifelong learning'],
        5: ['gender', 'equality', 'women', 'girls', 'discrimination', 'empowerment', 'gender-based violence', 'female', 'male', 'gender parity', 'gender gap', 'women rights', 'girls education', 'sexual harassment', 'gender mainstreaming', 'equal pay', 'women leadership', 'patriarchy', 'gender roles', 'gender justice'],
        6: ['water', 'sanitation', 'hygiene', 'clean water', 'safe water', 'drinking water', 'wastewater', 'water quality', 'water scarcity', 'water access', 'toilet', 'latrine', 'handwashing', 'sewage', 'waterborne', 'water supply', 'freshwater', 'water management', 'water pollution', 'water infrastructure'],
        7: ['energy', 'electricity', 'renewable', 'clean energy', 'solar', 'wind', 'hydro', 'power', 'energy efficiency', 'sustainable energy', 'energy access', 'energy grid', 'bioenergy', 'energy poverty', 'energy transition', 'green energy', 'energy infrastructure', 'off-grid', 'energy technology', 'affordable energy'],
        8: ['work', 'jobs', 'employment', 'economic growth', 'labor', 'decent work', 'unemployment', 'entrepreneurship', 'productivity', 'workforce', 'youth employment', 'job creation', 'informal sector', 'job security', 'wages', 'economic opportunity', 'workplace safety', 'fair employment', 'inclusive growth', 'economic development'],
        9: ['industry', 'innovation', 'infrastructure', 'manufacturing', 'technology', 'research', 'engineering', 'industrialization', 'transport', 'logistics', 'supply chain', 'industrial growth', 'digital infrastructure', 'internet access', 'telecommunications', 'industrial policy', 'industrial sector', 'smart infrastructure', 'sustainable industry', 'innovation hub'],
        10: ['inequality', 'discrimination', 'equal opportunity', 'social inclusion', 'marginalized', 'minorities', 'disability', 'income disparity', 'social justice', 'equal rights', 'gender gap', 'economic inequality', 'inclusive policies', 'social protection', 'migration', 'refugee', 'ethnic inequality', 'anti-discrimination', 'wealth gap', 'universal access'],
        11: ['city', 'urban', 'community', 'sustainable city', 'urbanization', 'housing', 'public transport', 'urban planning', 'resilience', 'urban sprawl', 'slum', 'urban safety', 'green space', 'urban infrastructure', 'municipality', 'urban services', 'city management', 'urban mobility', 'waste management', 'sustainable communities'],
        12: ['consumption', 'production', 'sustainability', 'waste', 'recycling', 'resource efficiency', 'sustainable consumption', 'sustainable production', 'supply chain', 'eco-friendly', 'responsible consumption', 'responsible production', 'circular economy', 'green products', 'material footprint', 'sustainable procurement', 'waste reduction', 'sustainable lifestyle', 'energy efficiency', 'environmental impact'],
        13: ['climate', 'global warming', 'carbon', 'greenhouse gas', 'climate change', 'emissions', 'climate action', 'climate adaptation', 'climate mitigation', 'carbon footprint', 'renewable energy', 'climate policy', 'climate resilience', 'sea level rise', 'climate disaster', 'climate finance', 'carbon neutrality', 'climate risk', 'climate science', 'climate solution'],
        14: ['ocean', 'marine', 'sea', 'marine life', 'marine pollution', 'fisheries', 'coral reef', 'ocean acidification', 'marine biodiversity', 'overfishing', 'coastal', 'marine conservation', 'marine ecosystem', 'sustainable fisheries', 'marine resources', 'seaweed', 'marine protected area', 'marine research', 'plastic pollution', 'marine debris', 'aqua'],
        15: ['forest', 'land', 'biodiversity', 'ecosystem', 'deforestation', 'land degradation', 'wildlife', 'habitat', 'conservation', 'afforestation', 'reforestation', 'land restoration', 'soil', 'desertification', 'sustainable land', 'flora', 'fauna', 'protected area', 'forest management', 'species extinction'],
        16: ['peace', 'justice', 'law', 'governance', 'human rights', 'rule of law', 'corruption', 'violence', 'crime', 'legal system', 'judiciary', 'public institution', 'inclusive society', 'freedom', 'access to justice', 'civil rights', 'conflict resolution', 'political participation', 'democracy', 'transparency'],
        17: ['partnership', 'collaboration', 'teamwork', 'global partnership', 'international cooperation', 'financing', 'capacity building', 'trade', 'technology transfer', 'multi-stakeholder', 'public private partnership', 'resource mobilization', 'south-south cooperation', 'data sharing', 'global goals', 'policy coherence', 'development aid', 'shared objectives', 'alliances', 'joint action']
    }
    if len(question.split()) < 5:
        return True
    return any(word in question.lower() for word in keywords.get(sdg_number, []))

if __name__ == '__main__':
    app.run(debug=True, port=8080)
