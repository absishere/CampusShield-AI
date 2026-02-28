// Background Service Worker for CampusShield AI

chrome.runtime.onInstalled.addListener(() => {
  console.log('CampusShield AI Extension Installed');
  
  // Initialize Digital Hygiene Score if not present
  chrome.storage.local.get(['hygieneScore'], (result) => {
    if (result.hygieneScore === undefined) {
      chrome.storage.local.set({ hygieneScore: 100 });
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Basic check to ignore internal browser pages
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://')) return;

    console.log(`Analyzing URL: ${tab.url}`);

    // Fetch the risk score from the backend stub
    fetch('http://localhost:8000/api/scan-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: tab.url, title: tab.title }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Threat Engine Response:', data);
        
        // Let the popup know about the latest scanned data
        chrome.storage.local.set({ latestScan: { url: tab.url, ...data } });

        // Change badge color based on risk
        if (data.status === 'safe') {
          chrome.action.setBadgeBackgroundColor({ color: '#22c55e', tabId }); // Green
          chrome.action.setBadgeText({ text: 'OK', tabId });
        } else {
          chrome.action.setBadgeBackgroundColor({ color: '#ef4444', tabId }); // Red
          chrome.action.setBadgeText({ text: '!', tabId });
        }
      })
      .catch((error) => {
        console.error('Error contacting backend:', error);
      });
  }
});
