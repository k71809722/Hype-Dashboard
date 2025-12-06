// Background Script for Hype Dashboard
const KICK_CHANNEL = 'hype';
const API_URL = `https://kick.com/api/v1/channels/${KICK_CHANNEL}`;

chrome.runtime.onInstalled.addListener((details) => {


    if (details.reason === 'install') {
        // First install - show onboarding
        chrome.storage.local.set({
            onboardingShown: false,
            onboardingDontShowAgain: false
        });
        chrome.tabs.create({ url: 'onboarding.html' });
    } else if (details.reason === 'update') {

    }

    // Create alarm with refresh interval from settings
    chrome.storage.local.get(['settings'], (result) => {
        const refreshInterval = result.settings?.refreshInterval || 60;
        const periodInMinutes = refreshInterval / 60; // Convert seconds to minutes
        chrome.alarms.create("checkStream", { periodInMinutes });

    });

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
                // Check notification settings before sending
                chrome.storage.local.get(['settings'], (settingsResult) => {
                    const settings = settingsResult.settings || {};
                    const notifSettings = settings.notifications || { enabled: true };

                    // Check if notifications are enabled
                    if (!notifSettings.enabled) {

                        chrome.storage.local.set({ lastStreamId: livestream.id });
                        return;
                    }

                    // Check quiet hours
                    if (notifSettings.quietHours?.enabled) {
                        const now = new Date();
                        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                        const start = notifSettings.quietHours.start || '22:00';
                        const end = notifSettings.quietHours.end || '08:00';

                        if (isInQuietHours(currentTime, start, end)) {

                            chrome.storage.local.set({ lastStreamId: livestream.id });
                            return;
                        }
                    }

                    // Send notification
                    const isSilent = notifSettings.sound === 'none';
                    chrome.notifications.create('hype-live-' + Date.now(), {
                        type: 'basic',
                        iconUrl: 'icons/icon128.png',
                        title: 'HYPE YAYINDA! 🔴',
                        message: livestream.session_title || 'Koş, yayın başladı!',
                        priority: 2,
                        requireInteraction: true, // Keeps notification visible
                        silent: isSilent // Respect sound setting
                    });

                    chrome.storage.local.set({ lastStreamId: livestream.id });
                });
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

// Check if current time is in quiet hours
function isInQuietHours(currentTime, startTime, endTime) {
    // Convert times to minutes for easier comparison
    const toMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const current = toMinutes(currentTime);
    const start = toMinutes(startTime);
    const end = toMinutes(endTime);

    // Handle overnight quiet hours (e.g., 22:00 to 08:00)
    if (start > end) {
        return current >= start || current < end;
    }

    // Normal quiet hours (e.g., 13:00 to 15:00)
    return current >= start && current < end;
}

chrome.notifications.onClicked.addListener(() => {
    chrome.tabs.create({ url: `https://kick.com/${KICK_CHANNEL}` });
});
