document.addEventListener('DOMContentLoaded', () => {
    // Check if onboarding should be shown
    chrome.storage.local.get(['onboardingShown', 'onboardingDontShowAgain'], (result) => {
        if (!result.onboardingShown && !result.onboardingDontShowAgain) {
            window.location.href = 'onboarding.html';
            return;
        }
    });

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

    updateUI();
    fetchYouTubeFeed();
    fetchKickVODs();
    fetchKickClips(7);

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const period = parseInt(btn.getAttribute('data-period'));
            fetchKickClips(period);
        });
    });
});

function updateUI() {
    chrome.storage.local.get(['isLive', 'streamData'], (result) => {
        const isLive = result.isLive || false;
        const streamData = result.streamData || {};

        const heroSection = document.getElementById('heroSection');
        const heroTitle = document.getElementById('heroTitle');
        const heroSubtitle = document.getElementById('heroSubtitle');
        const liveStats = document.getElementById('liveStats');
        const statusBadge = document.getElementById('connectionStatus');
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
            feedContainer.innerHTML = '';
            let count = 0;
            for (let i = 0; i < entries.length; i++) {
                if (count >= 3) break;
                const entry = entries[i];
                const title = entry.querySelector('title').textContent;
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
            container.innerHTML = '';
            videos.forEach(video => {
                const videoCard = document.createElement('a');
                const vodUuid = video.video && video.video.uuid ? video.video.uuid : video.id;
                videoCard.href = `https://kick.com/hype/videos/${vodUuid}`;
                videoCard.target = '_blank';
                videoCard.className = 'video-card';
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

async function fetchKickClips(timePeriod = 7) {
    const container = document.getElementById('clipsFeed');
    const BASE_URL = 'https://kick.com/api/v2/channels/hype/clips';

    console.log(`\n=== FETCHING CLIPS FOR ${timePeriod} DAYS (LIMITED TO 30 DAYS) ===`);

    try {
        let allClips = [];
        let cursor = null;
        let pageCount = 0;
        const maxAge = 30;

        while (true) {
            const url = cursor ? `${BASE_URL}?cursor=${cursor}` : BASE_URL;
            console.log(`Page ${pageCount + 1}`);

            const response = await fetch(url);
            if (!response.ok) {
                console.log('API request failed, stopping');
                break;
            }

            const data = await response.json();
            const clips = data.clips || [];

            if (clips.length === 0) {
                console.log('No more clips, stopping');
                break;
            }

            const now = new Date();
            const maxAgeDate = new Date(now.getTime() - (maxAge * 24 * 60 * 60 * 1000));

            let shouldStop = false;
            for (const clip of clips) {
                const clipDate = new Date(clip.created_at);
                if (clipDate < maxAgeDate) {
                    console.log(`Reached 30-day limit, stopping at page ${pageCount + 1}`);
                    shouldStop = true;
                    break;
                }
                allClips.push(clip);
            }

            cursor = data.nextCursor;
            pageCount++;

            if (!cursor || shouldStop) break;
        }

        console.log(`Total clips fetched: ${allClips.length}`);

        const now = new Date();
        const cutoffDate = new Date(now.getTime() - (timePeriod * 24 * 60 * 60 * 1000));

        let filteredClips = allClips.filter(clip => {
            const clipDate = new Date(clip.created_at);
            return clipDate >= cutoffDate;
        });

        console.log(`After ${timePeriod} day filter: ${filteredClips.length} clips`);

        filteredClips.sort((a, b) => (b.views || 0) - (a.views || 0));

        console.log('Top 10 by views:', filteredClips.slice(0, 10).map(c => ({
            title: c.title,
            views: c.views,
            date: new Date(c.created_at).toLocaleDateString()
        })));

        const topClips = filteredClips.slice(0, 3);

        if (topClips.length > 0) {
            container.innerHTML = '';
            topClips.forEach(clip => {
                const clipCard = document.createElement('a');
                clipCard.href = `https://kick.com/hype?clip=${clip.id}`;
                clipCard.target = '_blank';
                clipCard.className = 'video-card';
                const thumbUrl = clip.thumbnail_url || 'icons/icon48.png';
                const views = clip.views || 0;
                clipCard.innerHTML = `
                    <div class="video-thumb" style="background-image: url('${thumbUrl}')"></div>
                    <div class="video-info">
                        <p class="video-title">${clip.title || 'Klip'}</p>
                        <p style="font-size:10px; color:#888; margin-top:4px;">${views.toLocaleString()} görüntülenme</p>
                    </div>
                `;
                container.appendChild(clipCard);
            });
        } else {
            container.innerHTML = '<p class="placeholder-text">Bu zaman diliminde klip bulunamadı.</p>';
        }
    } catch (e) {
        console.error("Kick clips fetch error:", e);
        container.innerHTML = '<p class="placeholder-text">Klipler yüklenirken hata oluştu.</p>';
    }
}
