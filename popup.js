document.addEventListener('DOMContentLoaded', () => {
    // Nav Logic
    const navBtns = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));

            btn.classList.add('active');
            const target = btn.getAttribute('data-target');
            document.getElementById(target).classList.add('active');
        });
    });

    // Initial Data Fetch
    updateUI();
    fetchYouTubeFeed();
    fetchKickVODs();
});

function updateUI() {
    chrome.storage.local.get(['isLive', 'streamData'], (result) => {
        const isLive = result.isLive || false;
        const streamData = result.streamData || {};

        // Elements
        const heroSection = document.getElementById('heroSection');
        const heroTitle = document.getElementById('heroTitle');
        const heroSubtitle = document.getElementById('heroSubtitle');
        const liveStats = document.getElementById('liveStats');
        const statusBadge = document.getElementById('connectionStatus');

        // Data Elements
        const viewersVal = document.getElementById('viewersVal');
        const categoryVal = document.getElementById('categoryVal');

        if (isLive) {
            heroSection.classList.add('online');
            heroTitle.textContent = "YAYINDA";
            heroSubtitle.textContent = streamData.title || "Canlı Yayın";
            heroSubtitle.style.color = "#fff";

            viewersVal.textContent = streamData.viewers || "0";
            categoryVal.textContent = streamData.category || "Just Chatting";

            liveStats.style.display = "flex";
            statusBadge.textContent = "CONNECTED";
            statusBadge.classList.add('live');
            statusBadge.classList.remove('offline');
        } else {
            heroSection.classList.remove('online');
            heroTitle.textContent = "YAYIN KAPALI";
            heroSubtitle.textContent = "Hype şu an çevrimdışı.";
            heroSubtitle.style.color = "#888";

            liveStats.style.display = "none";
            statusBadge.textContent = "WAITING";
            statusBadge.classList.remove('live');
            statusBadge.classList.add('offline');
        }
    });
}

async function fetchYouTubeFeed() {
    const CHANNEL_ID = 'UCvsEgIvO6USEamtfg8mK3Mw';
    const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
    const feedContainer = document.getElementById('youtubeFeed');

    try {
        const response = await fetch(RSS_URL);
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        const entries = xml.querySelectorAll('entry');

        if (entries.length > 0) {
            feedContainer.innerHTML = ''; // Clear placeholder

            let count = 0;
            // Iterate but limit to 3 valid videos
            for (let i = 0; i < entries.length; i++) {
                if (count >= 3) break;

                const entry = entries[i];
                const title = entry.querySelector('title').textContent;
                // Filter Shorts
                if (title.toLowerCase().includes('#shorts')) continue;

                const link = entry.querySelector('link').getAttribute('href');
                const mediaGroup = entry.getElementsByTagName('media:group')[0];
                const thumbnail = mediaGroup ? mediaGroup.getElementsByTagName('media:thumbnail')[0].getAttribute('url') : '';

                const videoCard = document.createElement('a');
                videoCard.href = link;
                videoCard.target = '_blank';
                videoCard.className = 'video-card';
                videoCard.innerHTML = `
                    <div class="video-thumb" style="background-image: url('${thumbnail}')"></div>
                    <div class="video-info">
                        <p class="video-title">${title}</p>
                    </div>
                `;
                feedContainer.appendChild(videoCard);
                count++;
            }
        }
    } catch (e) {
        console.error("RSS Fetch Error:", e);
        feedContainer.innerHTML = '<p class="placeholder-text">Yüklenemedi.</p>';
    }
}

async function fetchKickVODs() {
    const container = document.getElementById('kickFeed');
    const KICK_VOD_URL = 'https://kick.com/api/v2/channels/hype/videos';

    try {
        const response = await fetch(KICK_VOD_URL);
        if (!response.ok) {
            container.innerHTML = '<p class="placeholder-text">Yüklenemedi (API Erişimi).</p>';
            return;
        }

        const data = await response.json();
        const videos = data.slice(0, 3);

        if (videos.length > 0) {
            container.innerHTML = ''; // Clear placeholder

            videos.forEach(video => {
                const videoCard = document.createElement('a');

                // Kick VOD URL: https://kick.com/hype/videos/{uuid}
                // Use video.video.uuid (the correct UUID: a32b1224-2c43-4697-b9a6-7aace3d86513)
                const vodUuid = video.video && video.video.uuid ? video.video.uuid : video.id;
                videoCard.href = `https://kick.com/hype/videos/${vodUuid}`;
                videoCard.target = '_blank';
                videoCard.className = 'video-card';

                // Thumbnail: video.thumbnail.src
                const thumbUrl = video.thumbnail && video.thumbnail.src ? video.thumbnail.src : 'icons/icon48.png';

                videoCard.innerHTML = `
                    <div class="video-thumb" style="background-image: url('${thumbUrl}')"></div>
                    <div class="video-info">
                        <p class="video-title">${video.session_title || 'Başlık Yok'}</p>
                        <p style="font-size:10px; color:#888; margin-top:4px;">${new Date(video.created_at).toLocaleDateString()}</p>
                    </div>
                `;
                container.appendChild(videoCard);
            });
        } else {
            container.innerHTML = '<p class="placeholder-text">Yayın bulunamadı.</p>';
        }

    } catch (e) {
        console.error("Kick VODs fetch error:", e);
        container.innerHTML = '<p class="placeholder-text">Bağlantı Hatası</p>';
    }
}
