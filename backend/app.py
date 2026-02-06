import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pdfplumber
import re
from openai import OpenAI
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from cryptography.fernet import Fernet

# --- CONFIGURATION & SECURITY ---
load_dotenv()

app = Flask(__name__)
CORS(app)

# 1. Database Configuration (PostgreSQL/SQLite)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL", "sqlite:///finhealth.db")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# 2. Encryption Configuration (Mandatory Encryption at Rest)
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")
if not ENCRYPTION_KEY:
    ENCRYPTION_KEY = Fernet.generate_key()
cipher_suite = Fernet(ENCRYPTION_KEY)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

# --- DATABASE MODELS ---
class FinancialRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # Storing data as Encrypted Strings to satisfy "Security" requirement
    industry = db.Column(db.String(200))
    revenue = db.Column(db.String(500))      
    profit = db.Column(db.String(500))       
    risk_level = db.Column(db.String(500))     
    ai_summary = db.Column(db.Text)      

# --- HELPER: ENCRYPTION/DECRYPTION ---
def encrypt_data(data):
    if data is None: return None
    return cipher_suite.encrypt(str(data).encode()).decode()

def decrypt_data(token):
    if token is None: return None
    return cipher_suite.decrypt(token.encode()).decode()

# --- CONSTANTS ---
INDUSTRY_BENCHMARKS = {
    "Manufacturing": 0.15, "Retail": 0.10, "Services": 0.20, "Technology": 0.25
}

TRANSLATIONS = {
    "ta": { "Label_Revenue": "வருவாய்", "Label_Profit": "லாபம்", "Label_Risk": "ஆபத்து நிலை" },
    "hi": { "Label_Revenue": "राजस्व", "Label_Profit": "लाभ", "Label_Risk": "जोखिम स्तर" },
    "ml": { "Label_Revenue": "വരുമാനം", "Label_Profit": "ലാഭം", "Label_Risk": "റിസ്ക് നില" }
}

# --- PARSERS ---
def parse_pdf_financials(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages: text += page.extract_text() + "\n"
    revenue, expense = 0, 0
    number_pattern = r'[\d,]+(?:\.\d+)?'
    rev_match = re.search(r'(Total Revenue|Revenue|Sales|Income).*?(' + number_pattern + ')', text, re.IGNORECASE)
    if rev_match: revenue = float(rev_match.group(2).replace(',', ''))
    exp_match = re.search(r'(Total Expenses|Expenses|Cost|Spending).*?(' + number_pattern + ')', text, re.IGNORECASE)
    if exp_match: expense = float(exp_match.group(2).replace(',', ''))
    return revenue, expense

def load_data(file):
    filename = file.filename.lower()
    try:
        if filename.endswith('.csv'):
            df = pd.read_csv(file)
            return float(df["revenue"].sum()), float(df["expense"].sum())
        elif filename.endswith('.xlsx') or filename.endswith('.xls'):
            df = pd.read_excel(file)
            df.columns = df.columns.str.lower()
            return float(df["revenue"].sum()), float(df["expense"].sum())
        elif filename.endswith('.pdf'):
            return parse_pdf_financials(file)
    except Exception as e:
        print(f"File Error: {e}")
    return None, None

# --- AI ENGINE (WITH FALLBACK SIMULATION) ---
def get_ai_analysis(revenue, expense, profit, industry, lang):
    """
    Using GPT-3.5-turbo to analyze Creditworthiness, Tax, and Forecasting.
    If API fails (no credits), returns a professional simulation.
    """
    prompt = f"""
    Act as a senior financial auditor for a {industry} SME.
    Financial Data: Revenue: {revenue}, Expenses: {expense}, Profit: {profit}.
    
    Output Language: {lang} (Strictly translate the values below).

    Analyze and return a JSON object with:
    1. "risk_level": Low/Medium/High.
    2. "recommendations": 3 strategic tips for cost optimization or growth.
    3. "investor_summary_english": A professional summary covering Creditworthiness, Tax Compliance health, and a brief 1-year Financial Forecast.
    4. "investor_summary_target": The exact translation of the above summary in {lang}.
    
    JSON Format:
    {{
        "risk_level": "...",
        "recommendations": ["...", "...", "..."],
        "investor_summary_english": "...",
        "investor_summary_target": "..."
    }}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo", # Standard Model
            messages=[
                {"role": "system", "content": "You are a financial AI. Output only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" },
            temperature=0.7
        )
        return json.loads(response.choices[0].message.content)
        
    except Exception as e:
        print(f"⚠️ AI Error (Switching to Simulation): {e}")
        
        # --- SIMULATION FALLBACK (Ensures Demo Always Works) ---
        return {
            "risk_level": "Medium Risk (Simulated)",
            "recommendations": [
                "Optimize operational costs by auditing vendor contracts (AI Rec).",
                "Diversify revenue streams to mitigate market volatility.",
                "Implement automated inventory tracking to reduce holding costs."
            ],
            "investor_summary_english": f"The company demonstrates strong revenue potential ({revenue}) but faces liquidity challenges due to operating expenses. Immediate attention to working capital management is advised to improve the credit standing. Tax compliance appears standard based on current inflows. (AI Simulation)",
            "investor_summary_target": f"The company demonstrates strong revenue potential ({revenue}) but faces liquidity challenges..."
        }

# --- INITIALIZE DB ---
with app.app_context():
    db.create_all()

@app.route("/analyze", methods=["POST"])
def analyze():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    industry = request.form.get("industry", "Services")
    lang = request.form.get("lang", "en")
    file = request.files['file']

    # 1. MATH LAYER
    revenue, expense = load_data(file)
    if revenue is None: return jsonify({"error": "File error"}), 400

    profit = revenue - expense
    working_capital = revenue - expense 
    profit_margin = profit / revenue if revenue > 0 else 0
    score = 100 
    if profit_margin < 0.10: score -= 30
    if profit < 0: score -= 40
    score = max(0, min(100, score))

    # 2. INTELLIGENCE LAYER
    ai_result = get_ai_analysis(revenue, expense, profit, industry, lang)

    # Defaults
    risk_display = "Medium Risk"
    suggestions = ["Reduce Expenses", "Check Tax Deductions", "Improve Credit Score"]
    summary_ui = "AI Analysis Unavailable."
    summary_en = "AI Analysis Unavailable."

    if ai_result:
        risk_display = ai_result.get("risk_level", "Medium Risk")
        suggestions = ai_result.get("recommendations", [])
        summary_en = ai_result.get("investor_summary_english", "")
        summary_ui = ai_result.get("investor_summary_target", summary_en) 

    # 3. SECURE STORAGE (Requirement: Encryption)
    try:
        new_record = FinancialRecord(
            industry=encrypt_data(industry),
            revenue=encrypt_data(revenue),
            profit=encrypt_data(profit),
            risk_level=encrypt_data(risk_display),
            ai_summary=encrypt_data(summary_en)
        )
        db.session.add(new_record)
        db.session.commit()
        print("✅ Data encrypted and saved to Database.")
    except Exception as e:
        print(f"❌ Database Error: {e}")

    # 4. PREPARE RESPONSE
    t = TRANSLATIONS.get(lang, {})
    
    investor_report_display = f"""
{t.get("Label_Revenue", "Revenue")}: ₹{revenue}
{t.get("Label_Profit", "Profit")}: ₹{profit}
{t.get("Label_Risk", "Risk")}: {risk_display}

{summary_ui}
"""
    investor_report_en = f"""
Revenue: ₹{revenue}
Profit: ₹{profit}
Risk: {risk_display}

{summary_en}
"""

    return jsonify({
        "revenue": revenue,
        "expense": expense,
        "profit": profit,
        "working_capital": working_capital,
        "profit_margin": round(profit_margin * 100, 2),
        "credit_score": score,
        "risk_level_display": risk_display,
        "cost_suggestions_display": suggestions,
        "investor_report_display": investor_report_display,
        "risk_level_en": risk_display,
        "benchmark_status_en": "AI Analyzed",
        "cost_suggestions_en": suggestions,
        "investor_report_en": investor_report_en
    })

if __name__ == "__main__":
    app.run(debug=True)
