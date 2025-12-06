// Background Script for Hype Companion
const KICK_CHANNEL = 'hype';
const API_URL = `https://kick.com/api/v1/channels/${KICK_CHANNEL}`;

chrome.runtime.onInstalled.addListener(() => {
    console.log("Hype Haber Merkezi Yüklendi!");
    chrome.alarms.create("checkStream", { periodInMinutes: 1 });
    checkStreamStatus(); // Check immediately on install
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "checkStream") {
        checkStreamStatus();
    }
});

async function checkStreamStatus() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        const livestream = data.livestream;
        const isLive = livestream !== null;

        chrome.storage.local.get(['isLive', 'lastStreamId'], (result) => {
            const wasLive = result.isLive || false;
            const lastStreamId = result.lastStreamId || 0;

            // Update storage
            chrome.storage.local.set({
                isLive: isLive,
                streamData: isLive ? {
                    title: livestream.session_title,
                    viewers: livestream.viewer_count,
                    category: livestream.categories[0]?.name || 'Yayın',
                    thumbnail: livestream.thumbnail?.url
                } : null
            });

            // Trigger Notification if newly live
            if (isLive && (!wasLive || (livestream.id !== lastStreamId))) {
                chrome.notifications.create('hype-live', {
                    type: 'basic',
                    iconUrl: 'icons/icon128.png',
                    title: 'HYPE YAYINDA! 🔴',
                    message: livestream.session_title || 'Koş, yayın başladı!',
                    priority: 2
                });

                chrome.storage.local.set({ lastStreamId: livestream.id });
            }

            updateBadge(isLive);
        });

    } catch (error) {
        console.error('Kick API Error:', error);
        // Fallback or maintain previous state logic can go here
    }
}

function updateBadge(isLive) {
    if (isLive) {
        chrome.action.setBadgeText({ text: "ON" });
        chrome.action.setBadgeBackgroundColor({ color: "#53fc18" });
    } else {
        chrome.action.setBadgeText({ text: "" });
    }
}

chrome.notifications.onClicked.addListener(() => {
    chrome.tabs.create({ url: `https://kick.com/${KICK_CHANNEL}` });
});
