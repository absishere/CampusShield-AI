# CampusShield AI – Real-Time Student Digital Safety Infrastructure

CampusShield AI is a real-time, privacy-first digital safety system designed specifically for university campuses. It functions as a Digital Immune System combining browser-level threat detection, AI-powered phishing classification, domain impersonation detection, and behavioral anomaly detection.

## Project Structure
This repository will contain both the Backend (Dev 1) and Frontend/Extension (Dev 2) codebases.
Dev 2 operates on the `Dev2` branch while Dev 1 operates on `main`.

- `/backend` - FastAPI Python Server, PostgreSQL integration, and AI Threat Engine.
- `/dashboard` - React + Tailwind Dashboard (Vite).
- `/extension` - Chrome Extension (Manifest V3).

## Prerequisites (Dev 1 - Backend & Database)
To run the backend infrastructure locally, ensure you have the following installed:
1. **Docker & Docker Compose**: For spinning up the PostgreSQL database (`campus-db`).
2. **Python 3.9+**: For running the FastAPI backend and AI model training scripts.
3. **Git**: Version control.

## Setup Instructions - Backend
1. Spin up the Database:
   ```bash
   docker run --name campus-db -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres
   ```
2. Navigate to the `backend` directory, create a virtual environment, and install dependencies (instructions pending completion of boilerplate).

## Features
- **Explainable Risk Breakdown**: See exact reasons for a risk score.
- **Campus-Wide Threat Radar**: Live scam clusters and heatmaps.
- **QR Scam Detection**: Scan QR codes and identify embedded URL threats.
- **Privacy-First Architecture**: No raw email or browsing history stored.

*Note: Models will utilize ONNX Runtime optimized for processing.*
