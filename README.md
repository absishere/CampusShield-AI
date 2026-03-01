<div align="center">
  <img src="https://img.icons8.com/nolan/256/shield.png" width="100"/>
  <h1>🛡️ CampusShield AI</h1>
  <p><strong>A Privacy-First Digital Immune System for University Campuses</strong></p>
  <i>Powered by AMD Ryzen™ AI & ONNX Runtime</i>
</div>

<br />

## 🚀 The Mission
University students lose thousands of dollars every semester to sophisticated phishing attacks targeting campus portals, tuition payments, and hostel fees. **CampusShield AI** intercepts these threats directly in the browser *before* the damage is done.

Built with an offline-first architecture, CampusShield AI analyzes web pages locally—preventing exposing sensitive browsing history to cloud servers.

## ✨ Core Features
- 🧠 **Dynamic Threat Engine**: Combines Levenshtein domain distance checking, Suspicious TLD spotting, Keyword urgency scanning, and a trained **ONNX Machine Learning Classification Pipeline**.
- ⚡ **AMD Accelerated Latency**: The ML Model runs blazingly fast on local edge hardware with real-time `time.perf_counter()` benchmarking via ONNX Runtime.
- 📉 **Campus-Wide Threat Radar**: A React dashboard powered by a scalable PostgreSQL database that aggregates live scam clusters across the university network.
- 🎮 **Gamified Cyber Hygiene**: An interactive Chrome Extension that penalizes unsafe behavior with immediate Teach-Back explanations and rewards XP for confirming lessons learned. 
- 📸 **QR Redirect Scanner**: Scan flyers around campus right from the dashboard to unmask malicious embedded links.
- 🔒 **Privacy-Preserving Logs**: Safe queries are discarded. Only hashed URLs are saved to the database.

---

## 🛠️ Tech Stack & Architecture
- **Backend**: FastAPI, Python 3.12, Uvicorn, PostgreSQL (Docker)
- **AI/ML**: Scikit-Learn (TF-IDF + Logistic Regression), Pandas, `skl2onnx`, ONNX Runtime
- **Frontend Dashboard**: React, Vite, TailwindCSS, Recharts, Lucide Icons
- **Browser Extension**: Manifest V3, HTML/CSS/Vanilla JS

> For detailed insights into our hardware optimizations, please refer to the [`AMD_INTEGRATION_GUIDE.md`](./AMD_INTEGRATION_GUIDE.md).

---

## 💻 Running the Project Locally

To run the entire ecosystem on your local machine, follow these steps.

### 1. Start the Database (Docker)
Ensure Docker is running, then spin up the PostgreSQL instance:
```bash
docker run --name campus-db -e POSTGRES_PASSWORD=123456 -p 5432:5432 -d postgres
```

### 2. Start the FastAPI AI Engine
Open a new terminal window:
```powershell
cd backend/
# Create and activate a virtual environment (if not already done)
python -m venv .venv
.\.venv\Scripts\activate

# Install dependencies (We use pre-compiled binaries for speed)
pip install -r requirements.txt

# (Optional) Export the Phishing Model Pipeline from Kaggle CSV
python train_model.py

# Start the Server
uvicorn main:app --reload
```
*The API will be live at `http://localhost:8000/docs`*

### 3. Start the React SOC Dashboard
Open a second terminal window:
```powershell
cd dashboard/
npm install
npm run dev
```
*The Dashboard will be live at `http://localhost:5173/`*

### 4. Install the Chrome Companion Extension
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Toggle **Developer mode** in the top-right corner.
3. Click **Load unpacked** in the top-left corner.
4. Select the `extension/` folder from this repository.
5. Pin the "CampusShield AI" extension to your toolbar. As you navigate the web, the extension will actively monitor and gamify your safety!

---

## 🤝 The Team
- **Abbas Sangameshwari (Backend & Machine Learning)**: Responsible for `train_model.py` Kaggle ingests, ONNX export workflows, the FastAPI Threat Engine orchestration, and AMD Hardware mapping optimizations.
- **Atharv Wadekar (Frontend & Extension UX)**: Responsible for the Vite React Enterprise Dashboard, gamification workflows in `popup.js`, TailwindCSS styling, and Recharts integration.
