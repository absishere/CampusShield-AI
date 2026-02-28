document.addEventListener('DOMContentLoaded', () => {
    const statusCard = document.getElementById('status-card');
    const riskBadge = document.getElementById('risk-badge');
    const explanation = document.getElementById('explanation');
    const riskFill = document.getElementById('risk-fill');
    const hygieneScoreEl = document.getElementById('hygiene-score');

    // Gamification Elements
    const playerRankEl = document.getElementById('player-rank');
    const playerLevelEl = document.getElementById('player-level');
    const xpFillEl = document.getElementById('xp-fill');

    function updateProfileUI(score) {
        let rank = "Rookie";
        let level = 1;

        if (score >= 90) { rank = "Cyber Ninja"; level = 5; }
        else if (score >= 70) { rank = "Guardian"; level = 4; }
        else if (score >= 50) { rank = "Defender"; level = 3; }
        else if (score >= 30) { rank = "Scout"; level = 2; }

        hygieneScoreEl.textContent = score;
        playerRankEl.textContent = rank;
        playerLevelEl.textContent = `Lv. ${level}`;

        // Calculate XP progress for the current level bracket
        // 100 max score. Each rank is roughly 20 points wide.
        const currentBracketBottom = (level - 1) * 20;
        const progressInBracket = score - currentBracketBottom;
        const percent = Math.min((progressInBracket / 20) * 100, 100);
        xpFillEl.style.width = `${Math.max(percent, 5)}%`;

        if (score < 50) hygieneScoreEl.className = 'score-text danger';
        else if (score < 80) hygieneScoreEl.className = 'score-text warning';
        else hygieneScoreEl.className = 'score-text success';
    }

    // Load Hygiene Score
    chrome.storage.local.get(['hygieneScore'], (result) => {
        const score = result.hygieneScore !== undefined ? result.hygieneScore : 100;
        updateProfileUI(score);
    });

    // Load Latest Scan Results from background.js
    chrome.storage.local.get(['latestScan'], (result) => {
        const scan = result.latestScan;

        statusCard.classList.remove('loading');

        if (scan) {
            // Update UI based on risk
            if (scan.status === 'risky') {
                statusCard.classList.add('danger');
                riskBadge.textContent = 'RISK DETECTED';
                riskBadge.classList.add('danger-badge');

                // Penalize hygiene score on risky clicks
                chrome.storage.local.get(['hygieneScore'], (res) => {
                    let newScore = (res.hygieneScore || 100) - 5;
                    if (newScore < 0) newScore = 0;
                    chrome.storage.local.set({ hygieneScore: newScore });
                    updateProfileUI(newScore);
                });
            } else if (scan.status === 'safe') {
                statusCard.classList.add('safe');
                riskBadge.textContent = 'SAFE';
                riskBadge.classList.add('safe-badge');
            } else {
                statusCard.classList.add('warning');
                riskBadge.textContent = 'UNKNOWN';
            }

            explanation.textContent = scan.explanation || "No explanation provided by engine.";

            const score = scan.risk_score || 0;
            riskFill.style.width = score + '%';
            if (score > 70) riskFill.style.backgroundColor = 'var(--danger)';
            else if (score > 30) riskFill.style.backgroundColor = 'var(--warning)';
            else riskFill.style.backgroundColor = 'var(--success)';

        } else {
            document.querySelector('#status-card h2').textContent = 'No active scan.';
            explanation.textContent = 'Navigate to a webpage to automatically scan it.';
            riskFill.style.width = '0%';
        }
    });

    // QR Code Scanning Implementation (Stub for now)
    document.getElementById('scan-qr-btn').addEventListener('click', () => {
        const fileInput = document.getElementById('qr-upload');
        const file = fileInput.files[0];
        const resultEl = document.getElementById('qr-result');

        if (!file) {
            resultEl.textContent = "Please select an image first.";
            resultEl.className = "danger-text";
            resultEl.classList.remove('hidden');
            return;
        }

        resultEl.textContent = "Scanning QR Code...";
        resultEl.className = "warning-text";
        resultEl.classList.remove('hidden');

        // Simulate a call to the backend QR API endpoint
        setTimeout(() => {
            // For now, hardcode a malicious result to demonstrate the UI
            resultEl.textContent = "🚨 Malicious URL detected in QR: http://evil-phishing-login.com";
            resultEl.className = "danger-text";
        }, 1500);
    });
});
