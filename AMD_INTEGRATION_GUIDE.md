# AMD Integration & Hardware Optimization Guide

CampusShield AI is designed to leverage modern hardware to provide real-time, privacy-first threat detection without relying purely on cloud inference. By shifting the workload to the edge (the student's device) and optimizing our cloud infrastructure, we achieve an "AMD-Ready" architecture.

## 1. AMD Ryzen AI (On-Device Inference)
We export our phishing detection model (TF-IDF + Logistic Regression) into the **ONNX (Open Neural Network Exchange)** format.
- **Why?** Using ONNX Runtime allows the inference to execute on the local NPU (Neural Processing Unit) found in **AMD Ryzen AI** processors.
- **Benefit:** 
  - **Privacy:** URLs are evaluated locally on the student's laptop, eliminating the need to send browsing history to the cloud.
  - **Latency:** Zero network round-trip time. Warnings are immediate.
  - **Battery Life:** Executing on the NPU consumes significantly less power than running the model on the CPU/GPU.

*Implementation Note:* Our `train_model.py` pipeline relies on `skl2onnx` to generate `models/phishing_model.onnx`, natively consumable by AMD Ryzen AI integrations.

## 2. AMD ROCm Platform (Model Training)
For training updates (e.g., re-training the base model nightly with the latest scam clusters detected on campus):
- The training pipeline can execute natively on **AMD GPUs using the ROCm software stack**.
- We use standard `scikit-learn` for prototyping, but `cuML`/`rapids` equivalent optimizations on AMD hardware ensure high-throughput batch processing for the scam trend clustering mechanism.

## 3. AMD EPYC (Campus Deployment Architecture)
The backend infrastructure is built on FastAPI and PostgreSQL, containerized using Docker.
- A single campus-wide deployment on a server powered by **AMD EPYC processors** can easily handle the concurrent connections of 50,000+ students.
- EPYC’s high core count and large cache sizes are optimal for executing our high-throughput analytical queries (e.g., real-time scam heatmaps, QR code threat decoding). 
