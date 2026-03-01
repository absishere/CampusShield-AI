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
            if (scan.threat_classification !== 'Safe') {
                statusCard.classList.add('danger');
                riskBadge.textContent = scan.threat_classification.toUpperCase();
                riskBadge.classList.add('danger-badge');

                // UPGRADE 5: Dynamic Penalty based on exact risk score
                chrome.storage.local.get(['hygieneScore'], (res) => {
                    let penalty = Math.max(2, Math.floor(scan.risk_score / 10)); // Heavier penalty for worse sites
                    let newScore = (res.hygieneScore || 100) - penalty;
                    if (newScore < 0) newScore = 0;
                    chrome.storage.local.set({ hygieneScore: newScore });
                    updateProfileUI(newScore);
                });

                // Show the interactive teach-back button
                const recoverBtn = document.getElementById('recover-xp-btn');
                recoverBtn.classList.remove('hidden');

                recoverBtn.onclick = () => {
                    chrome.storage.local.get(['hygieneScore'], (res) => {
                        let recoveredScore = Math.min(100, (res.hygieneScore || 100) + 3);
                        chrome.storage.local.set({ hygieneScore: recoveredScore });
                        updateProfileUI(recoveredScore);
                        recoverBtn.textContent = "Lesson Learned! ✅";
                        recoverBtn.style.backgroundColor = "#3b82f6";
                        recoverBtn.disabled = true;
                    });
                };
            } else if (scan.threat_classification === 'Safe') {
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

        const reader = new FileReader();
        reader.onload = function (e) {
            const base64Data = e.target.result;

            fetch(`${CONFIG.API_BASE}/scan-qr`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image_base64: base64Data, device_id: "extension_client" })
            })
                .then(response => response.json())
                .then(data => {
                    const threat = data.threat_classification;
                    if (threat !== 'Safe') {
                        resultEl.textContent = `🚨 QR Threat Detected (${threat}): ${data.explanation}`;
                        resultEl.className = "danger-text";
                    } else {
                        resultEl.textContent = `✅ QR Code Safe: ${data.explanation}`;
                        resultEl.className = "safe-text text-emerald-400";
                    }
                })
                .catch(err => {
                    console.error(err);
                    resultEl.textContent = "❌ Failed to process QR Code via CampusShield AI Backend.";
                    resultEl.className = "danger-text";
                });
        };
        reader.readAsDataURL(file);
    });
});
