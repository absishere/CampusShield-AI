from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import StringTensorType
import joblib
import os
import numpy as np

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

def train_and_export():
    print("Loading real Kaggle dataset...")
    # Map 'bad'/'phishing' to 1 (threat), 'good'/'benign' to 0 (safe)
    df = pd.read_csv("phishing_dataset.csv.csv").sample(n=10000, random_state=42) # Use 10k rows for speed
    
    # Handle the dataset's column naming (url, type)
    df['label'] = df['type'].apply(lambda x: 1 if "phishing" in str(x).lower() or "bad" in str(x).lower() else 0)
    
    X_train, X_test, y_train, y_test = train_test_split(df['url'], df['label'], test_size=0.2, random_state=42)

    print("Training TF-IDF + Logistic Regression pipeline...")
    # We use a pipeline so ONNX can handle raw string inputs directly
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=5000)),
        ('clf', LogisticRegression(random_state=42, max_iter=1000))
    ])
    
    pipeline.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = pipeline.predict(X_test)
    print(classification_report(y_test, y_pred))

    # Ensure models directory exists
    os.makedirs("models", exist_ok=True)

    # 1. Export as Pickle (for traditional inference or backup)
    joblib.dump(pipeline, "models/phishing_pipeline.pkl")
    print("Saved as models/phishing_pipeline.pkl")

    # 2. Export as ONNX (for AMD Ryzen AI optimization)
    # The input to our pipeline is a 1D string array (the URL)
    initial_type = [('input', StringTensorType([None, 1]))]
    
    # Convert using skl2onnx
    onnx_model = convert_sklearn(pipeline, initial_types=initial_type,
                                 options={'tfidf': {'tokenexp': '[a-zA-Z0-9_]+'}})
    
    with open("models/phishing_model.onnx", "wb") as f:
        f.write(onnx_model.SerializeToString())
        
    print("Saved as models/phishing_model.onnx")
    print("Model correctly exported for ONNX Runtime!")

if __name__ == "__main__":
    train_and_export()
