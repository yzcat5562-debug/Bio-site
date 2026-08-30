document.addEventListener('DOMContentLoaded', () => {
    const enterScreen = document.getElementById('enter-screen');
    const bioContainer = document.querySelector('.bio-container');
    const bgMusic = document.getElementById('bg-music');

    const now = new Date();
    const isBirthday = now.getMonth() === 6 && now.getDate() === 25; // Month is 0-indexed, so 6 is July

    // Typewriter effect phrases
    const phrases = ["Welcome to yzcat.xyz you chud", "THC", "420"];
    if (isBirthday) {
        phrases.unshift("🎉 Happy Birthday yzcat! 🎉");
    }
    const typewriterElement = document.getElementById('typewriter');
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        // Typing speed logic
        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000; // Pause at end of phrase
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before new phrase
        }

        setTimeout(typeEffect, typeSpeed);
    }

    // Create continuous background particles (snowflakes)
    const snowflakeChars = ['❄', '❅', '❆'];

    function spawnParticle() {
        const particlesContainer = document.getElementById('particles');
        const particle = document.createElement('div');
        particle.classList.add('particle');

        if (isBirthday) {
            // Confetti mode
            const colors = ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7', '#ffd166', '#06d6a0', '#118ab2'];
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.width = `${Math.random() * 6 + 4}px`;
            particle.style.height = `${Math.random() * 10 + 8}px`;
            particle.style.borderRadius = '2px';
            particle.style.boxShadow = 'none';
        } else {
            // Real snowflake characters
            const char = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
            particle.textContent = char;
            const size = Math.random() * 14 + 10; // 10px–24px
            particle.style.fontSize = `${size}px`;
            particle.style.width = 'auto';
            particle.style.height = 'auto';
            particle.style.background = 'none';
            particle.style.boxShadow = 'none';
            particle.style.borderRadius = '0';
            particle.style.color = `rgba(255,255,255,${Math.random() * 0.5 + 0.3})`;
            particle.style.textShadow = `0 0 6px rgba(200,230,255,0.6)`;
        }

        const left = Math.random() * 100;
        const duration = Math.random() * 12 + 8;
        const sway = Math.random() * 60 - 30; // drift left/right
        particle.style.left = `${left}%`;
        particle.style.top = `-30px`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.setProperty('--sway', `${sway}px`);

        particlesContainer.appendChild(particle);
        setTimeout(() => particle.remove(), duration * 1000);
    }

    function startParticles() {
        for (let i = 0; i < 120; i++) {
            setTimeout(spawnParticle, Math.random() * 8000);
        }
        setInterval(spawnParticle, 100);
    }

    // --- Mouse Trail ---
    function initMouseTrail() {
        document.addEventListener('mousemove', (e) => {
            const flake = document.createElement('div');
            flake.classList.add('mouse-trail-dot');
            flake.textContent = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
            flake.style.left = `${e.clientX}px`;
            flake.style.top = `${e.clientY}px`;
            flake.style.fontSize = `${Math.random() * 10 + 8}px`;
            flake.style.opacity = Math.random() * 0.4 + 0.4;
            document.body.appendChild(flake);
            setTimeout(() => flake.remove(), 700);
        });
    }
    initMouseTrail();

    // Handle initial click to enter
    let hasEntered = false;
    enterScreen.addEventListener('click', () => {
        if (hasEntered) return;
        hasEntered = true;

        enterScreen.classList.add('hidden');

        // Show bio container with smooth animation
        setTimeout(() => {
            bioContainer.classList.add('visible');
        }, 400);

        // Start background music
        try {
            bgMusic.volume = document.getElementById('volume-slider').value;
            bgMusic.play();
        } catch (e) {
            console.log("Audio playback was prevented by the browser.");
        }

        // Start effects
        setTimeout(typeEffect, 1200);
        startParticles();
    });

    // 3D Tilt effect on bio card
    const card = document.querySelector('.bio-card');

    card.addEventListener('mousemove', (e) => {
        if (!hasEntered) return;

        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;

        const rotateY = (e.clientX - cardCenterX) / 20;
        const rotateX = -(e.clientY - cardCenterY) / 20;

        card.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });

    // Reset tilt when mouse leaves
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
        card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
    });

    // Custom Audio Player Logic
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const prevSongBtn = document.getElementById('prev-song-btn');
    const nextSongBtn = document.getElementById('next-song-btn');
    const muteBtn = document.getElementById('mute-btn');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const progressBarBg = document.getElementById('progress-bar-bg');
    const progressFill = document.getElementById('progress-fill');
    const progressThumb = document.getElementById('progress-thumb');
    const songTitleEl = document.querySelector('.song-title');

    // Playlist
    const playlist = [
        { title: "Assumptions", src: "media/bg-music.mp3" },
        { title: "Lost Soul", src: "media/lost-soul.mp3" }
    ];
    let currentTrackIndex = 0;
    
    const trackInfoBtn = document.getElementById('track-info-btn');
    const playlistDropdown = document.getElementById('playlist-dropdown');
    const playlistChevron = document.getElementById('playlist-chevron');

    // Populate dropdown
    playlist.forEach((track, index) => {
        const item = document.createElement('div');
        item.classList.add('playlist-item');
        item.textContent = track.title;
        item.addEventListener('click', () => {
            loadTrack(index);
            if (hasEntered) bgMusic.play();
        });
        playlistDropdown.appendChild(item);
    });

    trackInfoBtn.addEventListener('click', () => {
        playlistDropdown.classList.toggle('show');
        if (playlistDropdown.classList.contains('show')) {
            playlistChevron.style.transform = 'rotate(180deg)';
        } else {
            playlistChevron.style.transform = 'rotate(0deg)';
        }
    });

    function loadTrack(index) {
        if (index < 0) index = playlist.length - 1;
        if (index >= playlist.length) index = 0;
        
        currentTrackIndex = index;
        const track = playlist[currentTrackIndex];
        
        const wasPlaying = !bgMusic.paused && hasEntered;
        
        bgMusic.src = track.src;
        songTitleEl.textContent = track.title;
        bgMusic.load();
        
        // Update active class in dropdown
        const items = playlistDropdown.querySelectorAll('.playlist-item');
        items.forEach((item, i) => {
            if (i === currentTrackIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        if (wasPlaying) {
            bgMusic.play().catch(e => console.log(e));
        }
    }

    // Initialize with a random track from the playlist
    loadTrack(Math.floor(Math.random() * playlist.length));

    function formatTime(seconds) {
        if (isNaN(seconds)) return "00:00";
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
    }

    // When audio metadata is loaded, set total time
    bgMusic.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(bgMusic.duration);
    });

    // Update progress bar as audio plays
    bgMusic.addEventListener('timeupdate', () => {
        if (isNaN(bgMusic.duration)) return;
        const progressPercent = (bgMusic.currentTime / bgMusic.duration) * 100;
        progressFill.style.width = `${progressPercent}%`;
        progressThumb.style.left = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(bgMusic.currentTime);
    });

    // Sync UI play state
    bgMusic.addEventListener('play', () => {
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
        playPauseBtn.classList.add('playing');
    });

    bgMusic.addEventListener('pause', () => {
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        playPauseBtn.classList.remove('playing');
    });

    // Play/Pause button click
    playPauseBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
        } else {
            bgMusic.pause();
        }
    });

    // Next/Prev track logic
    bgMusic.addEventListener('ended', () => {
        loadTrack(currentTrackIndex + 1);
        bgMusic.play();
    });

    prevSongBtn.addEventListener('click', () => {
        loadTrack(currentTrackIndex - 1);
        if (hasEntered && bgMusic.paused) bgMusic.play();
    });

    nextSongBtn.addEventListener('click', () => {
        loadTrack(currentTrackIndex + 1);
        if (hasEntered && bgMusic.paused) bgMusic.play();
    });

    // Keyboard controls (Space, Left/Right Arrows)
    document.addEventListener('keydown', (e) => {
        if (!hasEntered) return;
        
        if (e.code === 'Space') {
            e.preventDefault(); // Prevent page scrolling
            if (bgMusic.paused) bgMusic.play();
            else bgMusic.pause();
        } else if (e.code === 'ArrowLeft') {
            e.preventDefault();
            loadTrack(currentTrackIndex - 1);
            if (bgMusic.paused) bgMusic.play();
        } else if (e.code === 'ArrowRight') {
            e.preventDefault();
            loadTrack(currentTrackIndex + 1);
            if (bgMusic.paused) bgMusic.play();
        }
    });

    // Volume Control Logic
    const volumeSlider = document.getElementById('volume-slider');

    // Set initial volume
    bgMusic.volume = volumeSlider.value;

    volumeSlider.addEventListener('input', (e) => {
        bgMusic.volume = e.target.value;
        bgMusic.muted = false; // Unmute automatically when adjusting slider
        muteBtn.classList.remove('fa-volume-mute');
        muteBtn.classList.add('fa-volume-up');

        // Show mute icon if volume is 0
        if (bgMusic.volume === 0) {
            muteBtn.classList.remove('fa-volume-up');
            muteBtn.classList.add('fa-volume-mute');
        }
    });

    // Mute/Unmute button
    muteBtn.addEventListener('click', () => {
        bgMusic.muted = !bgMusic.muted;
        if (bgMusic.muted) {
            muteBtn.classList.remove('fa-volume-up');
            muteBtn.classList.add('fa-volume-mute');
            volumeSlider.value = 0;
        } else {
            muteBtn.classList.remove('fa-volume-mute');
            muteBtn.classList.add('fa-volume-up');
            // Restore to at least a little bit of volume if it was 0
            if (bgMusic.volume === 0) {
                bgMusic.volume = 0.2;
            }
            volumeSlider.value = bgMusic.volume;
        }
    });

    // Progress bar — drag to seek
    let isScrubbing = false;

    function scrubTo(e) {
        const rect = progressBarBg.getBoundingClientRect();
        const pos = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
        bgMusic.currentTime = pos * bgMusic.duration;
        progressFill.style.width = `${pos * 100}%`;
        progressThumb.style.left = `${pos * 100}%`;
    }

    progressBarBg.addEventListener('mousedown', (e) => {
        e.preventDefault(); // stop browser image-drag
        isScrubbing = true;
        scrubTo(e);
    });

    document.addEventListener('mousemove', (e) => {
        if (isScrubbing) scrubTo(e);
    });

    document.addEventListener('mouseup', () => {
        isScrubbing = false;
    });

    // Wallet Copy Logic
    const copyWallets = document.querySelectorAll('.copy-wallet');
    copyWallets.forEach(walletBtn => {
        walletBtn.addEventListener('click', async (e) => {
            const address = walletBtn.getAttribute('data-wallet');
            const originalText = walletBtn.textContent;

            try {
                await navigator.clipboard.writeText(address);
                walletBtn.textContent = 'Copied!';
                walletBtn.style.color = '#00ff88'; // Success green text

                setTimeout(() => {
                    walletBtn.textContent = originalText;
                    walletBtn.style.color = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                walletBtn.textContent = 'Failed!';

                setTimeout(() => {
                    walletBtn.textContent = originalText;
                }, 2000);
            }
        });
    });

    // --- Discord Presence (Lanyard WebSocket) ---
    const discordId = '1090716729996488725';

    function updateDiscordCard(d) {
        const statusDot = document.getElementById('discord-status-dot');
        const pfp = document.getElementById('discord-pfp');
        const username = document.getElementById('discord-username');
        const idEl = document.getElementById('discord-id');
        if (!statusDot) return;

        statusDot.className = 'discord-status';
        statusDot.classList.add(`status-${d.discord_status}`);
        username.textContent = d.discord_user.username;
        idEl.textContent = `ID: ${d.discord_user.id}`;
        if (d.discord_user.avatar) {
            pfp.src = `https://cdn.discordapp.com/avatars/${d.discord_user.id}/${d.discord_user.avatar}.png?size=128`;
        }
    }

    function connectLanyard() {
        const ws = new WebSocket('wss://api.lanyard.rest/socket');
        let heartbeatInterval;

        ws.onopen = () => {
            ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: discordId } }));
        };

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.op === 1) {
                heartbeatInterval = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ op: 3 }));
                }, msg.d.heartbeat_interval);
            } else if (msg.op === 0) {
                updateDiscordCard(msg.d);
            }
        };

        ws.onclose = () => {
            clearInterval(heartbeatInterval);
            setTimeout(connectLanyard, 5000);
        };

        ws.onerror = () => ws.close();
    }

    connectLanyard();

    // --- Spotify Now Playing via Last.fm ---
    async function fetchLastFm() {
        try {
            const res = await fetch('https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=yzcat&api_key=5be033514893c68a7b141fd13e53fa96&format=json&limit=1');
            const data = await res.json();
            const track = data.recenttracks.track[0];
            const line = document.getElementById('spotify-line');
            const songTitle = document.getElementById('spotify-song-title');
            const artistName = document.getElementById('spotify-artist-name');

            line.style.display = 'flex';

            if (track && track['@attr'] && track['@attr'].nowplaying === 'true') {
                const song = track.name;
                const artist = track.artist['#text'];
                const trackUrl = track.url;
                
                line.style.color = '#1DB954';
                songTitle.style.color = '#fff';
                songTitle.innerHTML = `<a href="${trackUrl}" target="_blank" style="color: inherit; text-decoration: none; position: relative;">${song} <i class="fas fa-external-link-alt" style="font-size: 0.6rem; color: #1DB954; opacity: 0.8; margin-left: 2px;"></i></a>`;
                artistName.style.display = 'block';
                artistName.textContent = `by ${artist}`;
            } else {
                line.style.color = '#888';
                songTitle.style.color = '#888';
                songTitle.textContent = 'Not listening to anything';
                artistName.style.display = 'none';
            }
        } catch (e) {
            console.log('Last.fm fetch failed:', e);
        }
    }

    fetchLastFm();
    setInterval(fetchLastFm, 15000);

    // --- YouTube Real-Time Stats ---
    // IMPORTANT: You need a YouTube Data API v3 Key and your Channel ID for this to work.
    const ytApiKey = 'REPLACE_WITH_YOUR_YOUTUBE_API_KEY'; 
    const ytChannelId = 'REPLACE_WITH_YOUR_CHANNEL_ID'; // e.g., UCxxxxxxxxxxxxxxxxxx
    
    function formatYTNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }
    
    async function fetchYouTubeStats() {
        if (ytApiKey === 'REPLACE_WITH_YOUR_YOUTUBE_API_KEY') return;
        
        try {
            const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${ytChannelId}&key=${ytApiKey}`);
            const data = await res.json();
            
            if (data.items && data.items.length > 0) {
                const stats = data.items[0].statistics;
                document.getElementById('yt-subs').textContent = formatYTNumber(stats.subscriberCount);
            }
        } catch (e) {
            console.log("Could not fetch YouTube stats", e);
        }
    }
    
    // Fetch initially and then every 30 seconds
    if (ytApiKey !== 'REPLACE_WITH_YOUR_YOUTUBE_API_KEY') {
        fetchYouTubeStats();
        setInterval(fetchYouTubeStats, 30000);
    }
    // --- Event Countdowns ---
    function getDaysUntil(month, day) {
        const now = new Date();
        let y = now.getFullYear();
        let d = new Date(y, month, day);
        
        // If the date has passed this year, calculate for next year
        // We add 86400000 (1 day in ms) so it shows 0 on the actual day instead of immediately jumping to 364
        if (now.getTime() > d.getTime() + 86400000) {
            d = new Date(y + 1, month, day);
        }
        
        const diff = d.getTime() - now.getTime();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    function updateCountdowns() {
        const cdNewYears = document.getElementById('cd-newyears');
        const cdJuly4 = document.getElementById('cd-july4');
        const cd911 = document.getElementById('cd-911');
        const cdHalloween = document.getElementById('cd-halloween');
        const cdChristmas = document.getElementById('cd-christmas');

        // New Years: Jan 1 (month 0)
        if (cdNewYears) cdNewYears.textContent = getDaysUntil(0, 1);
        
        // 4th of July: July 4 (month 6)
        if (cdJuly4) cdJuly4.textContent = getDaysUntil(6, 4);

        // 9/11 Kaboom Day: Sept 11 (month 8)
        if (cd911) cd911.textContent = getDaysUntil(8, 11);
        
        // Halloween: Oct 31 (month 9)
        if (cdHalloween) cdHalloween.textContent = getDaysUntil(9, 31);
        
        // Christmas: Dec 25 (month 11)
        if (cdChristmas) cdChristmas.textContent = getDaysUntil(11, 25);
    }

    // Update timer every hour
    setInterval(updateCountdowns, 3600000);
    updateCountdowns();

    // --- 9/11 Remembrance Live Countdown ---
    function update911Countdown() {
        const now = new Date();
        const card = document.getElementById('nine-eleven-card');
        const subtitle = document.getElementById('nine-eleven-subtitle');
        const daysEl = document.getElementById('cd-911-days');
        const hoursEl = document.getElementById('cd-911-hours');
        const minsEl = document.getElementById('cd-911-secs') ? document.getElementById('cd-911-mins') : null;
        const secsEl = document.getElementById('cd-911-secs');

        // Get the current date in NYC timezone
        const nycDate = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
        const is911DayNYC = nycDate.getMonth() === 8 && nycDate.getDate() === 11;

        // Next Sept 11 at exactly 8:46 AM NYC time (EDT = UTC-4) => 12:46 PM UTC
        let target = new Date(Date.UTC(now.getFullYear(), 8, 11, 12, 46, 0));
        
        // If it's currently Sept 11 in NYC, and we are PAST 8:46 AM, stay at 00 00 00 00
        if (is911DayNYC && now >= target) {
            if (card) card.classList.add('is-today');
            if (subtitle) subtitle.textContent = 'September 11, 2001 · 8:46 AM (NYC Time)';
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            const mEl = document.getElementById('cd-911-mins');
            if (mEl) mEl.textContent = '00';
            if (secsEl) secsEl.textContent = '00';
            return;
        }

        if (card) card.classList.remove('is-today');

        if (now >= target && !is911DayNYC) {
            target = new Date(Date.UTC(now.getFullYear() + 1, 8, 11, 12, 46, 0));
        }

        const diff = target - now;
        const totalSecs = Math.floor(diff / 1000);
        const days = Math.floor(totalSecs / 86400);
        const hours = Math.floor((totalSecs % 86400) / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;

        const pad = n => String(n).padStart(2, '0');
        if (daysEl) daysEl.textContent = pad(days);
        if (hoursEl) hoursEl.textContent = pad(hours);
        const mEl = document.getElementById('cd-911-mins');
        if (mEl) mEl.textContent = pad(mins);
        if (secsEl) secsEl.textContent = pad(secs);
    }

    update911Countdown();
    setInterval(update911Countdown, 1000);

    // Update Log Modal Logic
    const updateBtn = document.getElementById('update-log-btn');
    const updateModal = document.getElementById('update-modal');
    const closeUpdateModal = document.getElementById('close-update-modal');

    if (updateBtn && updateModal && closeUpdateModal) {
        updateBtn.addEventListener('click', () => {
            updateModal.classList.add('show');
        });

        closeUpdateModal.addEventListener('click', () => {
            updateModal.classList.remove('show');
        });

        window.addEventListener('click', (e) => {
            if (e.target === updateModal) {
                updateModal.classList.remove('show');
            }
        });
    }

    // UK Time Clock Logic
    function updateUKTime() {
        const timeEl = document.getElementById('uk-time');
        const dateEl = document.getElementById('uk-date');
        if (!timeEl || !dateEl) return;
        
        const now = new Date();
        const timeOptions = { 
            timeZone: 'Europe/London', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: true 
        };
        const timeFormatter = new Intl.DateTimeFormat('en-GB', timeOptions);
        timeEl.textContent = timeFormatter.format(now);

        // Date formatting: Mon,3,Aug.2026
        const ukDateStr = now.toLocaleString("en-US", {timeZone: "Europe/London"});
        const ukDate = new Date(ukDateStr);
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const dayOfWeek = days[ukDate.getDay()];
        const dayOfMonth = ukDate.getDate();
        const monthName = months[ukDate.getMonth()];
        const year = ukDate.getFullYear();
        
        dateEl.textContent = `${dayOfWeek},${dayOfMonth},${monthName}.${year}`;
    }
    
    updateUKTime();
    setInterval(updateUKTime, 1000);



    // Scrolling Page Title
    let titleText = "☽˚｡⋆ ⋆｡˚ ☁︎ ˚｡⋆｡˚     "; // Extra spaces for spacing between loops
    setInterval(() => {
        titleText = titleText.substring(1) + titleText[0];
        document.title = titleText;
    }, 400); // 400ms scroll speed

    // Games Played Section Toggle
    const gamesHeader = document.querySelector('.games-header');
    const gamesContainer = document.querySelector('.games-played-container');
    if (gamesHeader && gamesContainer) {
        gamesHeader.addEventListener('click', () => {
            gamesContainer.classList.toggle('expanded');
        });
    }
});

// Site Uptime — runs outside DOMContentLoaded so it can't be blocked
(function() {
    function updateUptime() {
        const uptimeEl = document.getElementById('site-uptime');
        if (!uptimeEl) return;

        const startDate = new Date('2026-05-21T20:23:04.864Z');
        const diff = Date.now() - startDate.getTime();

        if (diff < 0) { uptimeEl.textContent = '0d 0h 0m 0s'; return; }

        const s = Math.floor(diff / 1000);
        const d = Math.floor(s / 86400);
        const h = Math.floor((s % 86400) / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;

        uptimeEl.textContent = `${d}d ${h}h ${m}m ${sec}s`;
    }

    document.addEventListener('DOMContentLoaded', () => {
        updateUptime();
        setInterval(updateUptime, 1000);
    });
})();

// Prevent zooming via Keyboard (Ctrl + Plus/Minus) and Mouse Wheel (Ctrl + Scroll)
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && (event.key === '=' || event.key === '-' || event.key === '+' || event.key === '_')) {
        event.preventDefault();
    }
});

document.addEventListener('wheel', function(event) {
    if (event.ctrlKey) {
        event.preventDefault();
    }
}, { passive: false });
