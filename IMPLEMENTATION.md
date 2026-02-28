this is my project idea

🛡 Project Name

CampusShield AI – Real-Time Student Digital Safety Infrastructure

1️⃣ Proper Project Description (Clear + Real)

CampusShield AI is a real-time, privacy-first digital safety system designed specifically for university campuses.

It protects students from:



Phishing emails

Fake internship/job portals

Scholarship scams

UPI/QR code payment fraud

Typosquatted university domains

Malicious event registration sites

Suspicious account login behavior

Unlike generic antivirus or email filters, CampusShield is:



Student-context aware

Explainable (tells students why something is risky)

Privacy-preserving (no raw data stored)

Deployable by university IT departments

It functions as a Digital Immune System for campuses, combining:



Browser-level threat detection

AI-powered phishing classification

Domain impersonation detection

Behavioral anomaly detection

Campus-wide scam trend intelligence

This is not a demo tool.



It is infrastructure.

2️⃣ How Implementation Will Actually Look (Real Architecture)

We build a deployable, modular system.

🔹 Component 1: Browser Extension (Student Layer)

Purpose:



Intercepts URLs visited

Monitors clicked links

Detects QR code redirects

Optionally scans email links (client-side)

Flow:



Student clicks link

Extension extracts:

URL

Page title

Meta description

Sends lightweight features to backend

Receives:

Risk score

Threat classification

Explanation

Displays alert popup

No heavy processing in browser.



Fast. Clean.

🔹 Component 2: AI Threat Engine (Backend)

This is the core brain.



It performs:

A) URL & Domain Analysis

Levenshtein similarity to official university domains

Domain age check

SSL certificate validation

Suspicious TLD detection

B) NLP-Based Phishing Detection

Input:



Page content snippets

Email text samples (if permitted)

Model:



TF-IDF + Logistic Regression (fast)



OR

DistilBERT (if GPU available)

Output:



Probability of phishing

C) Risk Scoring Engine

Combine:

Risk Score =



(Phishing probability × 0.4) +



(Domain similarity × 0.25) +



(Domain age factor × 0.15) +



(Keyword urgency signals × 0.1) +



(SSL anomaly × 0.1)

Final score: 0–100

D) Explainability Engine

Generates simple explanation like:

"This domain was created 2 days ago and closely resembles your university portal. It requests urgent payment and OTP verification."

This is rule-based explanation synthesis.



Fast and deterministic.

🔹 Component 3: Campus Admin Intelligence Dashboard

Purpose:



View aggregated scam patterns

Detect trending phishing campaigns

Push real-time alerts to all students

View anonymized risk heatmaps

Data stored:



Hashed URLs

Risk categories

Time distribution

No raw personal data

🔹 Component 4: Student Digital Hygiene Engine (Unique Feature #1)

Each student gets:



Risk behavior score

Alerts for repeated risky clicks

Password hygiene reminders (via integration prompt)

Public exposure check (detect if email appears in breaches via API)

This makes it proactive, not reactive.

🔹 Component 5: QR Code Fraud Detector (Unique Feature #2)

Students scan QR codes during fests.

System:



Extracts embedded URL

Runs same risk engine

Detects malicious redirection

This is highly relevant in India.

Very practical.

🔹 Component 6: Scam Trend AI (Unique Feature #3)

Model clusters similar phishing campaigns.

Example:



300 students clicked similar internship scam domain

Admin gets alert:



"Emerging internship scam targeting CSE students."

This goes beyond expectations.

3️⃣ Fixed Tech Stack (Final — No Changing)

This is realistic for a 24 hour build.

🔸 Frontend (Student Extension)

JavaScript

Chrome Extension Manifest V3

HTML + CSS

Chrome APIs

🔸 Backend

Python

FastAPI

Uvicorn

🔸 AI Layer

Scikit-learn

TF-IDF Vectorizer

Logistic Regression

Isolation Forest (for anomaly detection)

Python-Levenshtein

HuggingFace Transformers (DistilBERT)

🔸 Database

PostgreSQL (production)

🔸 Dashboard

React + FastAPI

🔸 Deployment

Docker

Nginx

4️⃣ AMD Products / Solutions Integration

This must be legitimate.

🔴 1. AMD Ryzen AI (On-Device Inference)

If using AMD laptop:



Run phishing model locally

Use ONNX Runtime optimized for AMD

Demonstrate:

Lower latency

Edge processing

No cloud dependency

Highlight:



Privacy + low latency via AMD Ryzen AI acceleration.

🔴 2. AMD ROCm Platform

If AMD GPU available:



Train phishing classifier on ROCm

Run batch inference acceleration

Benchmark CPU vs GPU

Demonstrates:



High-throughput model training and inference.

🔴 3. AMD EPYC (Campus Deployment Model)

Explain deployment:

CampusShield backend can run on:



AMD EPYC servers

High core-count parallel inference

Energy-efficient campus-wide security layer

🔴 4. ONNX Runtime + AMD Optimization

Convert trained model to ONNX.



Run optimized inference.

This shows hardware awareness.

5️⃣ Unique Features That Make It Stand Out

Most teams will:



“Detect phishing.”

You will:

🔥 Feature 1: Explainable Risk Breakdown

Students see:



Exact reason

Risk score

Confidence level

Trust-building AI.

🔥 Feature 2: Campus-Wide Threat Radar

Admin sees:



Live scam clusters

Heatmaps

Targeted department attacks

Infrastructure-level thinking.

🔥 Feature 3: QR Scam Detection

Very India-relevant.



Very practical.

🔥 Feature 4: Digital Hygiene Score

Gamified but serious.

Makes students conscious of risk.

🔥 Feature 5: Context-Aware Domain Impersonation

Hard-coded official campus domains.



Detect near matches.

High real-world usefulness.

🔥 Feature 6: Privacy-First Architecture

No raw email stored

No browsing history stored

Only risk features logged

Matches theme exactly.

Below is the phase-wise implementation plan for the project, strictly follow this -

Phase 1: Infrastructure Scaffolding & Boilerplate (Hours 0 - 4)
Goal: Establish the foundation so both of you can work independently without blocking each other.

Dev 1 (You - Backend & DB):

Database: Spin up a PostgreSQL instance (use Docker to save time: docker run --name campus-db -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres).

ORM Setup: Configure FastAPI with SQLAlchemy (or SQLModel). Define the core tables: Users, ThreatLogs, and ScamClusters.

API Stubs: Create empty FastAPI routes for /api/scan-url, /api/scan-qr, and /api/dashboard/stats. Hardcode dummy JSON responses so Dev 2 can start building the UI immediately.

Dev 2 (Friend - Frontend & Extension):

Dashboard: Initialize the React app using Vite (npm create vite@latest dashboard --template react-ts) and install Tailwind CSS for rapid styling.

Extension: Set up the Chrome Extension Manifest V3 structure. Create the background worker to listen for tab updates and a basic HTML popup.

Integration: Write the API fetch services in both React and the Extension to hit the dummy FastAPI endpoints.

Phase 2: The Threat Engine & Extension Pipeline (Hours 4 - 10)
Goal: The core product works. The extension catches a bad link, the backend processes it, and the database logs it.

Dev 1 (You - AI & Backend):

Model Pipeline: Train your TF-IDF + Logistic Regression model on a phishing dataset. Crucial: Immediately export this model to ONNX format.

Inference: Write the FastAPI logic to run the ONNX model using onnxruntime. This is where you lock in the "AMD-Ready" requirement.

Risk Engine: Implement the rule-based checks (Levenshtein distance against official campus domains, keyword urgency). Combine this with the ONNX model output for the final 0-100 score.

Database Logging: Ensure every scanned URL is hashed and logged into PostgreSQL with its risk score and timestamp.

Dev 2 (Friend - Frontend & Extension):

Extension UI: Build the dynamic popup state. If the API returns safe, show green. If risky, display the exact "Explainability" string and the Risk Score gauge.

Interception: Complete the background script logic to capture the active tab URL and send it to the FastAPI /api/scan-url endpoint seamlessly.

Digital Hygiene: Implement local storage logic in the extension to track the user's "Hygiene Score" (e.g., deduct points if they bypass a warning).

Phase 3: Enterprise Dashboard & Advanced Modules (Hours 10 - 18)
Goal: Build the "Campus Infrastructure" aspect that proves this scales to administrators.

Dev 1 (You - Backend Data Aggregation):

Dashboard APIs: Write the PostgreSQL aggregation queries. You need endpoints that return data for charts (e.g., Threats by Hour, Top Impersonated Domains, Latest Scam Clusters).

QR Scanner: Implement the backend logic to decode QR image payloads and run the extracted URLs through your existing Threat Engine.

Trend Clustering: Write a background task or simple SQL logic that groups recent threat logs by similarities (e.g., same top-level domain) to simulate the "Scam Trend AI."

Dev 2 (Friend - Dashboard UI):

Data Visualization: Use a library like Recharts or Chart.js in React to consume the aggregation APIs. Build the "Threat Radar" heatmaps and trend graphs.

Admin View: Create a sleek, dark-mode data table displaying real-time threat logs coming in from the campus.

Extension Addition: Add the UI element in the extension popup allowing students to upload or scan a QR code.

Phase 4: Hardware Optimization, Polish, & Pitch (Hours 18 - 24)
Goal: Make it bulletproof, ensure the AMD integration story is clear, and prepare for the demo.

Dev 1 (You - Architecture & Optimization):

Hardware Mapping: Finalize the ONNX pipeline. In your code and documentation, explicitly note that using ONNX Runtime allows the inference to run directly on AMD Ryzen AI (laptop NPUs) for privacy-first local processing, while the backend database/APIs scale on AMD EPYC servers.

Edge Cases: Handle timeouts. If the PostgreSQL DB connection drops, ensure the FastAPI endpoints degrade gracefully.

Dev 2 (Friend - UX Polish):

Enterprise Feel: Refine the React dashboard styling. Ensure it looks like a legitimate administrative tool (consistent padding, clear typography, professional color palette).

Extension Flow: Test the extension across different types of sites to ensure it doesn't break normal browsing.

Both: End-to-end testing. Run a fake phishing link, watch the extension block it, and verify it instantly appears on the React dashboard.
