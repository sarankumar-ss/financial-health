import React, { useState } from "react";

// --- STATIC UI TRANSLATIONS ---
const UI_TEXT = {
  en: {
    subtitle: "Global Financial Intelligence Platform",
    upload_idle: "Upload CSV / Excel / PDF", // UPDATED
    upload_done: "Ready to Analyze",
    btn_analyze: "Run AI Analysis",
    btn_processing: "Processing Global Data...",
    l_revenue: "ANNUAL REVENUE",
    l_profit: "NET PROFIT",
    l_score: "CREDIT SCORE",
    h_health: "Financial Health",
    l_expense: "Expense Breakdown",
    l_margin: "Profit Margin",
    l_wc: "Working Capital",
    h_market: "Market Position",
    l_risk: "Risk Level",
    l_bench: "Industry Benchmark",
    h_recs: "✨ AI Strategic Recommendations",
    h_report: "Investor Executive Summary",
    btn_pdf: "Download Official PDF Report (English)",
    footer: "Secured by 256-bit Encryption"
  },
  ta: {
    subtitle: "உலகளாவிய நிதி நுண்ணறிவு தளம்",
    upload_idle: "CSV / Excel / PDF பதிவேற்றவும்", // UPDATED
    upload_done: "பகுப்பாய்வுக்குத் தயார்",
    btn_analyze: "AI பகுப்பாய்வை இயக்கவும்",
    btn_processing: "செயலாக்குகிறது...",
    l_revenue: "ஆண்டு வருவாய்",
    l_profit: "நிகர லாபம்",
    l_score: "கடன் மதிப்பீடு",
    h_health: "நிதி ஆரோக்கியம்",
    l_expense: "செலவு விவரம்",
    l_margin: "லாப விகிதம்",
    l_wc: "நடைமுறை மூலதனம்",
    h_market: "சந்தை நிலை",
    l_risk: "இடர் நிலை",
    l_bench: "தரக்குறியீடு",
    h_recs: "✨ AI மூலோபாய பரிந்துரைகள்",
    h_report: "முதலீட்டாளர் அறிக்கை",
    btn_pdf: "PDF அறிக்கையைப் பதிவிறக்கவும் (ஆங்கிலம்)",
    footer: "256-பிட் குறியாக்கத்தால் பாதுகாக்கப்பட்டது"
  },
  hi: {
    subtitle: "वैश्विक वित्तीय खुफिया मंच",
    upload_idle: "CSV / Excel / PDF अपलोड करें", // UPDATED
    upload_done: "विश्लेषण के लिए तैयार",
    btn_analyze: "AI विश्लेषण चलाएं",
    btn_processing: "प्रक्रिया चल रही है...",
    l_revenue: "वार्षिक राजस्व",
    l_profit: "शुद्ध लाभ",
    l_score: "क्रेडिट स्कोर",
    h_health: "वित्तीय स्वास्थ्य",
    l_expense: "व्यय विवरण",
    l_margin: "लाभ मार्जिन",
    l_wc: "कार्यशील पूंजी",
    h_market: "बाजार की स्थिति",
    l_risk: "जोखिम स्तर",
    l_bench: "उद्योग मानक",
    h_recs: "✨ AI रणनीतिक सुझाव",
    h_report: "निवेशक कार्यकारी सारांश",
    btn_pdf: "PDF रिपोर्ट डाउनलोड करें (अंग्रेज़ी)",
    footer: "256-बिट एन्क्रिप्शन द्वारा सुरक्षित"
  },
  ml: {
    subtitle: "ആഗോള സാമ്പത്തിക വിശകലന പ്ലാറ്റ്ഫോം",
    upload_idle: "CSV / Excel / PDF അപ്‌ലോഡ് ചെയ്യുക", // UPDATED
    upload_done: "വിശകലനത്തിന് തയ്യാറാണ്",
    btn_analyze: "AI വിശകലനം നടത്തുക",
    btn_processing: "പ്രോസസ്സ് ചെയ്യുന്നു...",
    l_revenue: "വാർഷിക വരുമാനം",
    l_profit: "അറ്റാദായം",
    l_score: "ക്രെഡിറ്റ് സ്കോർ",
    h_health: "സാമ്പത്തിക ആരോഗ്യം",
    l_expense: "ചെലവ് വിഭജനം",
    l_margin: "ലാഭ വിഹിതം",
    l_wc: "പ്രവർത്തന മൂലധനം",
    h_market: "വിപണി സ്ഥാനം",
    l_risk: "റിസ്ക് നില",
    l_bench: "വ്യവസായ നിലവാരം",
    h_recs: "✨ AI തന്ത്രപരമായ നിർദ്ദേശങ്ങൾ",
    h_report: "നിക്ഷേപക സംഗ്രഹം",
    btn_pdf: "PDF റിപ്പോർട്ട് ഡൗൺലോഡ് ചെയ്യുക (ഇംഗ്ലീഷ്)",
    footer: "256-ബിറ്റ് എൻക്രിപ്ഷൻ വഴി സുരക്ഷിതം"
  }
};

function App() {
  const [file, setFile] = useState(null);
  const [industry, setIndustry] = useState("Services");
  const [lang, setLang] = useState("en");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Helper to get current UI text
  const t = UI_TEXT[lang] || UI_TEXT["en"];

  const uploadFile = async () => {
    if (!file) return alert("Please select a file first!");
    
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("industry", industry);
    formData.append("lang", lang);

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Connection failed. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // PDF GENERATION (Strictly English)
  const downloadPDF = () => {
    const now = new Date().toLocaleString("en-US");
    const report = `
    <html>
    <head>
      <title>FinHealth Report</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; padding:50px; color: #1f2937; }
        .header { border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
        h1 { color:#312e81; margin:0; font-size: 28px; }
        .meta { color: #6b7280; font-size: 14px; margin-top: 5px; }
        table { width:100%; border-collapse:collapse; margin-top:20px; }
        td, th { border:1px solid #e5e7eb; padding:12px 15px; text-align: left; }
        tr:nth-child(even) { background-color: #f9fafb; }
        .label { font-weight: bold; background: #f3f4f6; width: 30%; }
        .rec-box { background: #f5f3ff; padding: 20px; border-radius: 8px; margin-top: 30px; border-left: 5px solid #6366f1; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>FinHealth AI – Executive Intelligence Report</h1>
        <div class="meta">Generated for Demo SME Pvt Ltd • ${now}</div>
      </div>
      
      <table>
        <tr><td class="label">Revenue</td><td>₹${result.revenue}</td></tr>
        <tr><td class="label">Expense</td><td>₹${result.expense}</td></tr>
        <tr><td class="label">Net Profit</td><td style="color:#059669; font-weight:bold">₹${result.profit}</td></tr>
        <tr><td class="label">Profit Margin</td><td>${result.profit_margin}%</td></tr>
        <tr><td class="label">Credit Score</td><td>${result.credit_score}/100</td></tr>
        <tr><td class="label">Risk Level</td><td>${result.risk_level_en}</td></tr>
        <tr><td class="label">Working Capital</td><td>₹${result.working_capital}</td></tr>
        <tr><td class="label">Industry Benchmark</td><td>${result.benchmark_status_en}</td></tr>
      </table>

      <div class="rec-box">
        <h3>Strategic Recommendations</h3>
        <ul>
          ${result.cost_suggestions_en.map(s => `<li style="margin-bottom:8px">${s}</li>`).join("")}
        </ul>
      </div>

      <h3>Investor Executive Summary</h3>
      <pre style="white-space: pre-wrap; font-family: 'Segoe UI', sans-serif; line-height: 1.6; color: #374151;">${result.investor_report_en}</pre>
    </body>
    </html>
    `;
    const win = window.open("", "_blank");
    win.document.write(report);
    win.document.close();
    win.print();
  };

  return (
    <div style={styles.container}>
      <div style={styles.orb1}></div>
      <div style={styles.orb2}></div>

      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.badge}>ENTERPRISE EDITION</div>
          <h1 style={styles.title}>FinHealth AI</h1>
          <p style={styles.subtitle}>{t.subtitle}</p>
        </div>
      </div>

      <div style={styles.controlsWrapper}>
        <div style={styles.glassPanel}>
          <div style={styles.selectGroup}>
            <select style={styles.select} onChange={(e) => setLang(e.target.value)}>
              <option value="en">🇺🇸 English (Global)</option>
              <option value="ta">🇮🇳 தமிழ் (Tamil)</option>
              <option value="hi">🇮🇳 हिंदी (Hindi)</option>
              <option value="ml">🇮🇳 മലയാളം (Malayalam)</option>
            </select>
            <select style={styles.select} onChange={(e) => setIndustry(e.target.value)}>
              <option>Services</option>
              <option>Manufacturing</option>
              <option>Retail</option>
              <option>Technology</option>
            </select>
          </div>

          <div style={styles.uploadSection}>
            <input 
              type="file" 
              id="file" 
              hidden 
              accept=".csv, .xlsx, .xls, .pdf"
              onChange={(e) => setFile(e.target.files[0])} 
            />
            <label htmlFor="file" style={file ? styles.uploadBoxActive : styles.uploadBox}>
              {file ? (
                <>
                  <span style={{fontSize:"28px"}}>✅</span> <br/>
                  <span style={{fontWeight:"600", color:"#a7f3d0", marginTop:"8px", display:"block"}}>
                     {file.name}
                  </span>
                </>
              ) : (
                <>
                  <span style={{fontSize:"28px"}}>📂</span> <br/>
                  <span style={{opacity:0.8}}>{t.upload_idle}</span>
                </>
              )}
            </label>
            
            <button 
              style={loading ? styles.analyzeBtnDisabled : styles.analyzeBtn} 
              onClick={uploadFile}
              disabled={loading}
            >
              {loading ? t.btn_processing : t.btn_analyze}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div style={styles.dashboard}>
          <div style={styles.gridThree}>
            <div style={{...styles.metricCard, background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)"}}>
              <span style={styles.cardLabel}>{t.l_revenue}</span>
              <div style={styles.cardValue}>₹{result.revenue}</div>
            </div>
            <div style={{...styles.metricCard, background: "linear-gradient(135deg, #0ea5e9 0%, #22d3ee 100%)"}}>
              <span style={styles.cardLabel}>{t.l_profit}</span>
              <div style={styles.cardValue}>₹{result.profit}</div>
            </div>
            <div style={{...styles.metricCard, background: "linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%)"}}>
              <span style={styles.cardLabel}>{t.l_score}</span>
              <div style={styles.cardValue}>{result.credit_score}<small style={{fontSize:"18px", opacity:0.8}}>/100</small></div>
            </div>
          </div>

          <div style={styles.gridTwo}>
            <div style={styles.detailCard}>
              <h3 style={styles.cardHeader}>{t.h_health}</h3>
              <div style={styles.row}>
                <span>{t.l_expense}</span> <b style={{color:"white"}}>₹{result.expense}</b>
              </div>
              <div style={styles.row}>
                <span>{t.l_margin}</span> <span style={{color:"#4ade80", fontWeight:"bold", textShadow:"0 0 10px rgba(74, 222, 128, 0.3)"}}>{result.profit_margin}%</span>
              </div>
              <div style={styles.row}>
                <span>{t.l_wc}</span> <b style={{color:"white"}}>₹{result.working_capital}</b>
              </div>
            </div>

            <div style={styles.detailCard}>
              <h3 style={styles.cardHeader}>{t.h_market}</h3>
              <div style={styles.row}>
                <span>{t.l_risk}</span> 
                <span style={{
                  backgroundColor: result.risk_level_en === "High Risk" ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.2)",
                  color: result.risk_level_en === "High Risk" ? "#fca5a5" : "#86efac",
                  padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", border: "1px solid currentColor"
                }}>
                  {result.risk_level_display}
                </span>
              </div>
              <div style={styles.row}>
                <span>{t.l_bench}</span> <b style={{color:"white"}}>{result.benchmark_status_display}</b>
              </div>
            </div>

            <div style={{...styles.detailCard, gridColumn: "1 / -1", background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)"}}>
              <h3 style={{...styles.cardHeader, color:"#a5b4fc", display:"flex", alignItems:"center", gap:"10px"}}>
                 {t.h_recs}
              </h3>
              <ul style={styles.list}>
                {result.cost_suggestions_display.map((s, i) => (
                  <li key={i} style={styles.listItem}>{s}</li>
                ))}
              </ul>
            </div>

            <div style={{...styles.detailCard, gridColumn: "1 / -1", borderTop: "1px solid rgba(99, 102, 241, 0.3)"}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: "15px", flexWrap:"wrap", gap:"10px"}}>
                <h3 style={styles.cardHeader}>{t.h_report}</h3>
                <button onClick={downloadPDF} style={styles.pdfBtn}>
                   {t.btn_pdf} ⬇
                </button>
              </div>
              <pre style={styles.reportText}>{result.investor_report_display}</pre>
            </div>
          </div>
        </div>
      )}

      <div style={styles.footer}>
        FinHealth AI • 2026 Enterprise Edition • {t.footer}
      </div>
    </div>
  );
}

// --- DARK GLASS STYLES (Unchanged) ---
const styles = {
  container: {
    background: "#0f172a",
    minHeight: "100vh",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    paddingBottom: "40px",
    color: "#e2e8f0",
    position: "relative",
    overflow: "hidden"
  },
  orb1: {
    position: "absolute",
    top: "-10%",
    left: "-10%",
    width: "600px",
    height: "600px",
    background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)",
    borderRadius: "50%",
    zIndex: 0,
    pointerEvents: "none"
  },
  orb2: {
    position: "absolute",
    top: "20%",
    right: "-5%",
    width: "500px",
    height: "500px",
    background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(0,0,0,0) 70%)",
    borderRadius: "50%",
    zIndex: 0,
    pointerEvents: "none"
  },
  header: {
    position: "relative",
    zIndex: 1,
    padding: "80px 20px 120px 20px",
    textAlign: "center",
    background: "linear-gradient(180deg, rgba(15,23,42,0) 0%, #0f172a 100%)",
  },
  badge: {
    display: "inline-block",
    padding: "6px 16px",
    borderRadius: "20px",
    background: "rgba(99, 102, 241, 0.1)",
    color: "#818cf8",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "15px",
    border: "1px solid rgba(99, 102, 241, 0.2)"
  },
  title: {
    fontSize: "4rem",
    fontWeight: "800",
    letterSpacing: "-2px",
    margin: "0 0 10px 0",
    background: "linear-gradient(to right, #fff, #94a3b8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 0 30px rgba(255,255,255,0.1)"
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#94a3b8",
    fontWeight: "300"
  },
  controlsWrapper: {
    maxWidth: "700px",
    margin: "-80px auto 50px",
    padding: "0 20px",
    position: "relative",
    zIndex: 10
  },
  glassPanel: {
    background: "rgba(30, 41, 59, 0.7)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    padding: "40px",
    borderRadius: "24px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.08)"
  },
  selectGroup: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    marginBottom: "30px"
  },
  select: {
    padding: "12px 20px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    fontSize: "14px",
    background: "#0f172a",
    color: "#e2e8f0",
    cursor: "pointer",
    outline: "none",
    width: "100%"
  },
  uploadSection: {
    textAlign: "center"
  },
  uploadBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
    border: "2px dashed rgba(255,255,255,0.2)",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.02)",
    color: "#94a3b8",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "15px",
    marginBottom: "20px"
  },
  uploadBoxActive: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
    border: "2px solid #10b981",
    borderRadius: "16px",
    background: "rgba(16, 185, 129, 0.1)",
    color: "#fff",
    cursor: "pointer",
    marginBottom: "20px",
    boxShadow: "0 0 20px rgba(16, 185, 129, 0.2)"
  },
  analyzeBtn: {
    width: "100%",
    padding: "18px",
    background: "linear-gradient(to right, #4f46e5, #7c3aed)",
    color: "white",
    border: "none",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 0 20px rgba(79, 70, 229, 0.4)",
    transition: "transform 0.2s",
    letterSpacing: "0.5px"
  },
  analyzeBtnDisabled: {
    width: "100%",
    padding: "18px",
    background: "#334155",
    color: "#94a3b8",
    border: "none",
    borderRadius: "14px",
    fontSize: "16px",
    cursor: "not-allowed"
  },
  dashboard: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 20px",
    position: "relative",    zIndex: 5
  },
  gridThree: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginBottom: "20px"
  },
  metricCard: {
    padding: "30px",
    borderRadius: "20px",
    color: "white",
    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "150px",
    border: "1px solid rgba(255,255,255,0.1)"
  },
  cardLabel: {
    fontSize: "12px",
    fontWeight: "700",
    opacity: 0.9,
    letterSpacing: "1px"
  },
  cardValue: {
    fontSize: "2.5rem",
    fontWeight: "800",
    marginTop: "5px",
    textShadow: "0 2px 10px rgba(0,0,0,0.2)"
  },
  gridTwo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "20px"
  },
  detailCard: {
    background: "rgba(30, 41, 59, 0.6)",
    backdropFilter: "blur(12px)",
    padding: "30px",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.05)"
  },
  cardHeader: {
    margin: "0 0 20px 0",
    fontSize: "18px",
    color: "#fff",
    fontWeight: "600",
    letterSpacing: "-0.5px"
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    color: "#94a3b8",
    fontSize: "15px"
  },
  list: {
    paddingLeft: "20px",
    color: "#cbd5e1",
    lineHeight: "1.7"
  },
  listItem: {
    marginBottom: "12px"
  },
  reportText: {
    whiteSpace: "pre-wrap",
    fontFamily: "'Inter', sans-serif",
    lineHeight: "1.8",
    color: "#cbd5e1",
    background: "rgba(0,0,0,0.2)",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.05)",
    fontSize: "14px"
  },
  pdfBtn: {
    padding: "10px 20px",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "background 0.2s"
  },
  footer: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#64748b",
    fontSize: "13px",
    letterSpacing: "1px",
    textTransform: "uppercase"
  }
};

export default App;
