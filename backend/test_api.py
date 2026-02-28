import requests
import time
import subprocess

def run_tests():
    # Wait a moment for server to start if run concurrently
    time.sleep(2)
    
    print("--- Testing CampusShield AI Backend ---\n")
    
    try:
        # Test 1: Scan a malicious URL
        print("1. Scanning malicious URL (http://verify-university-account.info/login)...")
        res1 = requests.post("http://localhost:8000/api/scan-url", json={"url": "http://verify-university-account.info/login"})
        print("Response:", res1.json())
        print()
        
        # Test 2: Scan a safe URL
        print("2. Scanning safe URL (https://university.edu/dashboard)...")
        res2 = requests.post("http://localhost:8000/api/scan-url", json={"url": "https://university.edu/dashboard"})
        print("Response:", res2.json())
        print()
        
        # Test 3: Get Dashboard Stats
        print("3. Fetching dashboard stats...")
        res3 = requests.get("http://localhost:8000/api/dashboard/stats")
        print("Response:", res3.json())
        print()
        
        # Test 4: Get Trend Clusters
        print("4. Fetching trend clusters...")
        res4 = requests.get("http://localhost:8000/api/dashboard/clusters")
        print("Response:", res4.json())
        print()

        print("--- All tests passed successfully! ---")

    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the API. Make sure uvicorn is running.")

if __name__ == "__main__":
    run_tests()
