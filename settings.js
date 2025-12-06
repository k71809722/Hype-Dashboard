// Settings Management
const DEFAULT_SETTINGS = {

    defaultTab: 'feed',
    refreshInterval: 60,
    notifications: {
        enabled: true,
        sound: 'default',
        quietHours: {
            enabled: false,
            start: '22:00',
            enabled: false,
            start: '22:00',
            end: '08:00'
        },
        notifyOnCategoryChange: true,
        targetCategoryFilter: ''
    }
};

let currentSettings = { ...DEFAULT_SETTINGS };

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    setupEventListeners();


});

// Load settings from storage
function loadSettings() {
    chrome.storage.local.get(['settings'], (result) => {
        if (result.settings) {
            currentSettings = { ...DEFAULT_SETTINGS, ...result.settings };
        }
        populateSettings();
    });
}

// Populate UI with settings
function populateSettings() {
    // General
    document.getElementById('defaultTab').value = currentSettings.defaultTab || 'feed';
    document.getElementById('refreshInterval').value = currentSettings.refreshInterval || 60;

    // Notifications
    document.getElementById('notificationsEnabled').checked = currentSettings.notifications?.enabled ?? true;
    document.getElementById('notificationSound').value = currentSettings.notifications?.sound || 'default';
    document.getElementById('quietHoursEnabled').checked = currentSettings.notifications?.quietHours?.enabled || false;
    document.getElementById('quietHoursStart').value = currentSettings.notifications?.quietHours?.start || '22:00';
    document.getElementById('quietHoursEnd').value = currentSettings.notifications?.quietHours?.end || '08:00';

    // Advanced Notifications
    document.getElementById('notifyOnCategoryChange').checked = currentSettings.notifications?.notifyOnCategoryChange || false;
    document.getElementById('targetCategoryFilter').value = currentSettings.notifications?.targetCategoryFilter || '';


}

// Setup event listeners
function setupEventListeners() {


    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            switchSection(section);
        });
    });

    // Close button
    const closeBtn = document.getElementById('closeBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            window.close();
        });

    }

    // Save button
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveSettings);

    }



    // Test notification
    const testBtn = document.getElementById('testNotification');
    if (testBtn) {
        testBtn.addEventListener('click', sendTestNotification);

    } else {
        console.error('Test notification button not found!');
    }

    // Clear cache
    const clearBtn = document.getElementById('clearCache');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearCache);

    }

    // Reset settings
    const resetBtn = document.getElementById('resetSettings');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetSettings);

    }


}

// Switch section
function switchSection(sectionId) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.settings-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Save settings
function saveSettings() {


    // Collect settings from UI
    const settings = {

        defaultTab: document.getElementById('defaultTab').value,
        refreshInterval: parseInt(document.getElementById('refreshInterval').value),
        notifications: {
            enabled: document.getElementById('notificationsEnabled').checked,
            sound: document.getElementById('notificationSound').value,
            quietHours: {
                enabled: document.getElementById('quietHoursEnabled').checked,
                start: document.getElementById('quietHoursStart').value,
                end: document.getElementById('quietHoursEnd').value
            },
            notifyOnCategoryChange: document.getElementById('notifyOnCategoryChange').checked,
            targetCategoryFilter: document.getElementById('targetCategoryFilter').value.trim()
        }
    };



    // Save to storage
    chrome.storage.local.set({ settings }, () => {
        if (chrome.runtime.lastError) {
            console.error('Save error:', chrome.runtime.lastError);
            alert('Kaydetme hatası: ' + chrome.runtime.lastError.message);
        } else {
            currentSettings = settings;


            showSaveConfirmation();

        }
    });
}



// Show save confirmation
function showSaveConfirmation() {
    const saveBtn = document.getElementById('saveBtn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = '✓ Kaydedildi!';
    saveBtn.style.background = 'var(--success)';

    setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.style.background = '';
    }, 2000);
}

// Send test notification
function sendTestNotification() {

    const testBtn = document.getElementById('testNotification');
    const originalText = testBtn.textContent;

    // Get current settings
    const soundSetting = document.getElementById('notificationSound').value;
    const isSilent = soundSetting === 'none';

    // Quiet Hours Check
    const quietHoursEnabled = document.getElementById('quietHoursEnabled').checked;
    if (quietHoursEnabled) {
        const start = document.getElementById('quietHoursStart').value;
        const end = document.getElementById('quietHoursEnd').value;

        // Simple time check logic
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const [startH, startM] = start.split(':').map(Number);
        const startMinutes = startH * 60 + startM;

        const [endH, endM] = end.split(':').map(Number);
        const endMinutes = endH * 60 + endM;

        let inQuietHours = false;
        if (startMinutes > endMinutes) {
            // Overnight (e.g. 22:00 - 08:00)
            inQuietHours = currentMinutes >= startMinutes || currentMinutes < endMinutes;
        } else {
            // Same day (e.g. 13:00 - 15:00)
            inQuietHours = currentMinutes >= startMinutes && currentMinutes < endMinutes;
        }

        if (inQuietHours) {

            testBtn.textContent = '🔕 Sessiz Saatteyiz (Engellendi)';
            testBtn.style.background = 'var(--warning, #f59e0b)';
            setTimeout(() => {
                testBtn.textContent = originalText;
                testBtn.style.background = '';
            }, 3000);
            return;
        }
    }

    // Use unique ID to ensure notification always shows up without clearing previous ones
    const notifId = 'test-notification-' + Date.now();

    try {
        chrome.notifications.create(notifId, {
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: 'Test Bildirimi',
            message: 'Bildirimler çalışıyor! 🎉',
            priority: 2,
            requireInteraction: true,
            silent: isSilent
        }, (notificationId) => {
            if (chrome.runtime.lastError) {
                console.error('Notification error:', chrome.runtime.lastError);
                testBtn.textContent = '❌ Hata!';
            } else {

                testBtn.textContent = isSilent ? '✓ Gönderildi (Sessiz)' : '✓ Gönderildi';
                testBtn.style.background = 'var(--success, #10b981)';
            }

            setTimeout(() => {
                testBtn.textContent = originalText;
                testBtn.style.background = '';
            }, 2000);
        });
    } catch (error) {
        console.error('Test notification error:', error);
        testBtn.textContent = '❌ Hata';
        setTimeout(() => {
            testBtn.textContent = originalText;
        }, 2000);
    }
}

// Clear cache
function clearCache() {
    if (confirm('Önbelleği temizlemek istediğinizden emin misiniz?')) {
        chrome.storage.local.remove(['streamData', 'lastStreamId'], () => {
            alert('Önbellek temizlendi!');
        });
    }
}

// Reset settings
function resetSettings() {
    if (confirm('Tüm ayarları varsayılan değerlere döndürmek istediğinizden emin misiniz?')) {
        currentSettings = { ...DEFAULT_SETTINGS };
        chrome.storage.local.set({ settings: currentSettings }, () => {
            populateSettings();

            alert('Ayarlar sıfırlandı!');
        });
    }
}
