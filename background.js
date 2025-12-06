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

        chrome.storage.local.get(['isLive', 'lastStreamId', 'lastStreamCategory'], (result) => {
            const wasLive = result.isLive || false;
            const lastStreamId = result.lastStreamId || 0;
            const lastStreamCategory = result.lastStreamCategory || '';

            const currentCategory = isLive ? (livestream.categories[0]?.name || 'Yayın') : '';

            // Update storage
            chrome.storage.local.set({
                isLive: isLive,
                lastStreamCategory: currentCategory,
                streamData: isLive ? {
                    title: livestream.session_title,
                    viewers: livestream.viewer_count,
                    category: currentCategory,
                    thumbnail: livestream.thumbnail?.url
                } : null
            });

            // LOGIC SPLIT:
            // 1. Stream JUST Started (New Stream)
            // 2. Stream Already Live BUT Category Changed
            const isNewStream = isLive && (!wasLive || livestream.id !== lastStreamId);
            const isCategoryChange = isLive && wasLive && (livestream.id === lastStreamId) && (currentCategory !== lastStreamCategory);

            if (isNewStream || isCategoryChange) {
                chrome.storage.local.get(['settings'], (settingsResult) => {
                    const settings = settingsResult.settings || {};
                    const notifSettings = settings.notifications || { enabled: true };

                    // 1. Global Enabled Check
                    if (!notifSettings.enabled) {
                        if (isNewStream) chrome.storage.local.set({ lastStreamId: livestream.id });
                        return;
                    }

                    // 2. Quiet Hours Check
                    if (notifSettings.quietHours?.enabled) {
                        const now = new Date();
                        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                        const start = notifSettings.quietHours.start || '22:00';
                        const end = notifSettings.quietHours.end || '08:00';

                        if (isInQuietHours(currentTime, start, end)) {
                            if (isNewStream) chrome.storage.local.set({ lastStreamId: livestream.id });
                            return;
                        }
                    }

                    // 3. Category Filter Logic
                    const targetCategory = (notifSettings.targetCategoryFilter || '').trim().toLowerCase();
                    const currentCategoryLower = currentCategory.toLowerCase();

                    // If filter is set, ONLY notify if matches
                    if (targetCategory.length > 0) {
                        if (!currentCategoryLower.includes(targetCategory)) {
                            // Does not match user's filter -> No Notification
                            if (isNewStream) chrome.storage.local.set({ lastStreamId: livestream.id });
                            return;
                        }
                    }

                    // 4. Category Change Logic
                    if (isCategoryChange) {
                        // Only notify if setting is enabled
                        if (!notifSettings.notifyOnCategoryChange) return;

                        // Only notify if distinct enough (prevent flickering empty strings)
                        if (!lastStreamCategory || !currentCategory) return;
                    }

                    // 5. Send Notification
                    const isSilent = notifSettings.sound === 'none';
                    let title = 'HYPE YAYINDA! 🔴';
                    let message = livestream.session_title || 'Koş, yayın başladı!';
                    let contextMessage = 'Yayın Başladı';

                    if (isCategoryChange) {
                        title = 'KATEGORİ DEĞİŞTİ! 🔄';
                        message = `Hype şimdi ${currentCategory} oynuyor!`;
                        contextMessage = `Önceki: ${lastStreamCategory}`;
                    }

                    chrome.notifications.create(`hype-live-${Date.now()}`, {
                        type: 'basic',
                        iconUrl: 'icons/icon128.png',
                        title: title,
                        message: message,
                        contextMessage: contextMessage,
                        priority: 2,
                        requireInteraction: true,
                        silent: isSilent
                    });

                    if (isNewStream) chrome.storage.local.set({ lastStreamId: livestream.id });
                });
            }

            updateBadge(isLive);
        });

    } catch (error) {
        console.error('Kick API Error:', error);
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
