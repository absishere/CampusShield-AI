from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import StringTensorType
import joblib
import os
import numpy as np

def create_sample_dataset():
    # Synthetic dataset for phishing training
    data = [
        {"url": "https://campus-portal.university.edu/login", "label": 0},
        {"url": "http://campus-portal-update.com/login", "label": 1},
        {"url": "https://university.edu/dashboard", "label": 0},
        {"url": "http://verify-university-account.info/", "label": 1},
        {"url": "https://scholarship-university.edu/apply", "label": 0},
        {"url": "http://urgent-scholarship-payment.com/fee", "label": 1},
        {"url": "https://mail.university.edu/", "label": 0},
        {"url": "http://login-mail-university.xyz/", "label": 1},
        {"url": "https://library.university.edu/books", "label": 0},
        {"url": "http://library-fine-payment-urgent.net/", "label": 1},
        {"url": "https://student-services.university.edu/", "label": 0},
        {"url": "http://student-services-verify.org/", "label": 1},
    ]
    return data

def train_and_export():
    print("Loading dataset...")
    data = create_sample_dataset()
    X = np.array([item["url"] for item in data])
    y = np.array([item["label"] for item in data])

    print("Training TF-IDF + Logistic Regression pipeline...")
    # We use a pipeline so ONNX can handle raw string inputs directly
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=1000)),
        ('clf', LogisticRegression(random_state=42))
    ])
    
    pipeline.fit(X, y)
    
    print("Evaluating model...")
    score = pipeline.score(X, y)
    print(f"Accuracy on training set: {score:.2f}")

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
