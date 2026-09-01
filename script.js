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
            showMacOsNotification(playlist[currentTrackIndex].title);
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
        { title: "Lost Soul", src: "media/lost-soul.mp3" },
        { title: "Bam Bam", src: "media/bam-bam.mp3" }
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
        
        if (hasEntered) {
            showMacOsNotification(track.title);
        }
    }

    let notifTimeout;
    function showMacOsNotification(title) {
        const notif = document.getElementById('song-notification');
        const songName = document.getElementById('notif-song-name');
        if (!notif || !songName) return;
        
        songName.textContent = title;
        notif.classList.add('show');
        
        clearTimeout(notifTimeout);
        notifTimeout = setTimeout(() => {
            notif.classList.remove('show');
        }, 3000);
    }

    // Initialize with Bam Bam (index 2) by default
    loadTrack(2);

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
        if (hasExploded) return;
        if (bgMusic.paused) {
            bgMusic.play();
        } else {
            bgMusic.pause();
        }
    });

    // Next/Prev track logic
    bgMusic.addEventListener('ended', () => {
        if (hasExploded) return;
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
        if (hasExploded) return; // Disable music controls after easter egg fires
        
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

    // --- 420 Dual Countdown ---
    function update420Countdown() {
        const now = new Date();
        const ukNow = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' }));
        const card = document.getElementById('nine-eleven-card');
        const pad = n => String(n).padStart(2, '0');

        // --- DATE countdown: until April 20th ---
        const ukYear = ukNow.getFullYear();
        let april20 = new Date(ukNow);
        april20.setMonth(3); april20.setDate(20);
        april20.setHours(0, 0, 0, 0);
        // If April 20 has already passed this year, target next year
        let targetYear = ukYear;
        if (ukNow >= april20) {
            targetYear = ukYear + 1;
            april20.setFullYear(targetYear);
        }

        const yearTitle = document.getElementById('cd-420-year-title');
        if (yearTitle) yearTitle.textContent = `Until April 20th (${targetYear})`;

        // Convert both to UTC timestamps for reliable math across daylight savings changes
        const msPerDay = 1000 * 60 * 60 * 24;
        const ukNowUTC = Date.UTC(ukNow.getFullYear(), ukNow.getMonth(), ukNow.getDate(), ukNow.getHours(), ukNow.getMinutes(), ukNow.getSeconds());
        const april20UTC = Date.UTC(targetYear, 3, 20, 0, 0, 0);

        const dateDiff = Math.max(0, Math.floor((april20UTC - ukNowUTC) / 1000));
        const dDays  = Math.floor(dateDiff / 86400);
        const dHours = Math.floor((dateDiff % 86400) / 3600);
        const dMins  = Math.floor((dateDiff % 3600) / 60);
        const dSecs  = dateDiff % 60;

        const dDaysEl  = document.getElementById('cd-420d-days');
        const dHoursEl = document.getElementById('cd-420d-hours');
        const dMinsEl  = document.getElementById('cd-420d-mins');
        const dSecsEl  = document.getElementById('cd-420d-secs');
        if (dDaysEl)  dDaysEl.textContent  = pad(dDays);
        if (dHoursEl) dHoursEl.textContent = pad(dHours);
        if (dMinsEl)  dMinsEl.textContent  = pad(dMins);
        if (dSecsEl)  dSecsEl.textContent  = pad(dSecs);

        // --- TIME countdown: until 4:20pm UK time today ---
        const ukH = ukNow.getHours();
        const ukM = ukNow.getMinutes();
        const ukS = ukNow.getSeconds();
        const totalSecsNow = ukH * 3600 + ukM * 60 + ukS;
        const target420   = 16 * 3600 + 20 * 60;
        const is420Now    = ukH === 16 && ukM === 20;

        if (is420Now) {
            if (card) card.classList.add('is-today');
        } else {
            if (card) card.classList.remove('is-today');
        }

        let timeDiff = is420Now ? 0 : (totalSecsNow < target420 ? target420 - totalSecsNow : (86400 - totalSecsNow) + target420);
        const tHours = Math.floor(timeDiff / 3600);
        const tMins  = Math.floor((timeDiff % 3600) / 60);
        const tSecs  = timeDiff % 60;

        const tHoursEl = document.getElementById('cd-420t-hours');
        const tMinsEl  = document.getElementById('cd-420t-mins');
        const tSecsEl  = document.getElementById('cd-420t-secs');
        if (tHoursEl) tHoursEl.textContent = pad(tHours);
        if (tMinsEl)  tMinsEl.textContent  = pad(tMins);
        if (tSecsEl)  tSecsEl.textContent  = pad(tSecs);
    }

    update420Countdown();
    setInterval(update420Countdown, 1000);



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

// --- Secret Easter Egg ---
const secretCode = ['y', 'z', 'c', 'a', 't'];
let secretIndex = 0;
let hasExploded = false;
let chaosTrack = null;

document.addEventListener('keydown', (e) => {
    if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') return;
    
    if (e.key.toLowerCase() === secretCode[secretIndex]) {
        secretIndex++;
        if (secretIndex === secretCode.length) {
            if (!hasExploded) {
                hasExploded = true;
                triggerEasterEgg();
            } else {
                triggerEasterEggSecond();
            }
            secretIndex = 0;
        }
    } else {
        secretIndex = 0;
        if (e.key.toLowerCase() === secretCode[0]) secretIndex = 1;
    }
});

function triggerEasterEggSecond() {
    // Stop the spinning monkeys and background music
    if (chaosTrack) { chaosTrack.pause(); chaosTrack = null; }
    const bgMusic = document.getElementById('bg-music');
    if (bgMusic) bgMusic.pause();

    // Play alarm
    const alarm = new Audio('media/Alarm.mp3');
    alarm.loop = true;
    alarm.volume = 0.25;
    alarm.play().catch(() => {});

    const msg = document.createElement('div');
    msg.innerHTML = `
        <div style="font-size: clamp(0.7rem, 1.2vw, 0.9rem); color: #ff0000; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 18px; opacity: 0.8;">⚠ &nbsp; CRITICAL FAILURE &nbsp; ⚠</div>
        <div style="font-size: clamp(1.2rem, 3vw, 2.8rem); font-weight: 900; color: transparent; -webkit-text-stroke: 2px #ffffff; letter-spacing: 5px; margin-bottom: 14px;">YOU ALREADY BROKE IT.</div>
        <div style="width: 60px; height: 1px; background: rgba(255,255,255,0.2); margin: 0 auto 18px;"></div>
        <div style="font-size: clamp(0.8rem, 1.4vw, 1rem); color: #888; line-height: 1.8; margin-bottom: 24px;">
            there is no site left to destroy.<br>
            our engineers have been notified.<br>
            <span style="color: #555;">( they are not coming. )</span>
        </div>
        <div style="font-size: clamp(0.7rem, 1.2vw, 0.85rem); color: #666; letter-spacing: 2px; margin-bottom: 10px; text-transform: uppercase;">evacuating to a safer location in</div>
        <div id="egg-countdown" style="font-size: clamp(2rem, 5vw, 4rem); font-weight: 900; color: #fff; text-shadow: 0 0 20px rgba(255,255,255,0.3);">10</div>
    `;
    Object.assign(msg.style, {
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center', zIndex: '999999',
        pointerEvents: 'none', fontFamily: "'Space Grotesk', sans-serif",
        lineHeight: '1.4',
        padding: '40px',
        background: 'rgba(0,0,0,0.85)',
        border: '1px solid rgba(255,0,0,0.2)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        minWidth: '340px'
    });
    document.body.appendChild(msg);

    const cdEl = msg.querySelector('#egg-countdown');
    let count = 69; // work in tenths internally (69 = 6.9)

    function getDelay(c) {
        // c is in tenths (69 down to 0)
        if (c > 10) {
            // 6.9 down to 1.1: starts fast (~60ms), slows gently to ~130ms at 1.1
            const t = 1 - ((c - 10) / 59); // 0 at top, 1 at 1.1
            return Math.round(60 + t * 70);
        } else {
            // 1.0 down to 0.0: 10 ticks over 2000ms = 200ms each
            return 200;
        }
    }

    function tick() {
        const display = (count / 10).toFixed(1);
        cdEl.textContent = display;
        if (count <= 10) cdEl.style.color = '#ff0000';

        if (count <= 0) {
            alarm.pause();
            window.location.href = 'https://guns.lol/yzcat';
            return;
        }

        count--;
        setTimeout(tick, getDelay(count));
    }

    cdEl.textContent = '6.9';
    setTimeout(tick, getDelay(count));
}

function triggerEasterEgg() {
    // Kill bg music, play the chaos track
    const bgMusic = document.getElementById('bg-music');
    if (bgMusic) bgMusic.pause();
    chaosTrack = new Audio('media/monkeys-spinning-monkeys.mp3');
    chaosTrack.volume = 0.4;
    chaosTrack.play().catch(() => {});

    // Show outlined "GRAVITY.EXE" text
    const overlay = document.createElement('div');
    overlay.textContent = "GRAVITY.EXE HAS STOPPED WORKING";
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(1.2rem, 3.5vw, 3.5rem)',
        fontWeight: '900',
        fontFamily: "'Space Grotesk', sans-serif",
        color: 'transparent',
        webkitTextStroke: '2px #ff0000',
        zIndex: '999999',
        pointerEvents: 'none',
        textShadow: '0 0 30px rgba(255,0,0,0.6)',
        whiteSpace: 'nowrap',
        letterSpacing: '4px'
    });
    document.body.appendChild(overlay);
    setTimeout(() => {
        overlay.style.transition = 'opacity 1s ease';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 1000);
    }, 2500);

    // Grab every visible leaf-level element across the entire page
    const everything = document.querySelectorAll('body *');
    const toExplode = [];

    everything.forEach(el => {
        // Only take elements that have no visible children themselves (leaf nodes visually)
        // OR specific containers we want to treat as a unit
        const tag = el.tagName.toLowerCase();
        const rect = el.getBoundingClientRect();

        // Skip invisible, off-screen, or massive wrapper elements
        if (rect.width === 0 || rect.height === 0) return;
        if (rect.width > window.innerWidth * 0.7) return;
        if (rect.height > window.innerHeight * 0.7) return;
        if (el.id === 'particles') return;
        if (el.classList.contains('modal')) return;
        if (el.classList.contains('background-overlay')) return;
        if (el.classList.contains('background-video')) return;

        // Only grab specific element types so we don't stack-transform parents + children
        const allowed = ['img', 'a', 'button', 'h1', 'h2', 'h3', 'p', 'span', 'i', 'li', 'input', 'small', 'div'];
        if (!allowed.includes(tag)) return;

        // For divs, only grab specific small ones (avoid large layout containers)
        if (tag === 'div' && (rect.width > 400 || rect.height > 200)) return;

        toExplode.push({ el, rect });
    });

    const screenCX = window.innerWidth / 2;
    const screenCY = window.innerHeight / 2;
    const physicsItems = [];

    // Snapshot all clones first, THEN hide the panel so positions are captured correctly
    toExplode.forEach(({ el, rect }) => {
        // Create a clone fixed exactly where the element visually sits
        const clone = el.cloneNode(true);
        Object.assign(clone.style, {
            position: 'fixed',
            left: rect.left + 'px',
            top: rect.top + 'px',
            width: rect.width + 'px',
            height: rect.height + 'px',
            margin: '0',
            zIndex: String(Math.floor(Math.random() * 200) + 100),
            pointerEvents: 'none',
            transition: 'none',
            transform: 'none',
            boxSizing: 'border-box'
        });
        document.body.appendChild(clone);

        // Hide original
        el.style.visibility = 'hidden';

        // Explosion direction: away from center, with randomness
        let dx = (rect.left + rect.width / 2) - screenCX;
        let dy = (rect.top + rect.height / 2) - screenCY;
        if (Math.abs(dx) < 5) dx = (Math.random() - 0.5) * 20;
        if (Math.abs(dy) < 5) dy = (Math.random() - 0.5) * 20;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = Math.random() * 18 + 12;

        physicsItems.push({
            clone,
            x: rect.left,
            y: rect.top,
            vx: (dx / dist) * speed + (Math.random() - 0.5) * 8,
            vy: (dy / dist) * speed + (Math.random() - 0.5) * 8,
            angle: 0,
            va: (Math.random() - 0.5) * 15,
            w: rect.width,
            h: rect.height
        });
    });

    // Hide the panel instantly — override any CSS transitions first so it snaps off immediately
    const bioContainer = document.querySelector('.bio-container');
    if (bioContainer) {
        bioContainer.style.transition = 'none';
        bioContainer.style.opacity = '0';
        bioContainer.style.visibility = 'hidden';
    }

    // Hue shift the background
    document.body.style.transition = 'filter 4s ease';
    document.body.style.filter = 'hue-rotate(360deg)';

    let rafId;
    function tick() {
        physicsItems.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.angle += p.va;

            // Bounce off screen edges
            if (p.x <= 0) { p.x = 0; p.vx = Math.abs(p.vx); }
            else if (p.x + p.w >= window.innerWidth) { p.x = window.innerWidth - p.w; p.vx = -Math.abs(p.vx); }
            if (p.y <= 0) { p.y = 0; p.vy = Math.abs(p.vy); }
            else if (p.y + p.h >= window.innerHeight) { p.y = window.innerHeight - p.h; p.vy = -Math.abs(p.vy); }

            p.clone.style.left = p.x + 'px';
            p.clone.style.top = p.y + 'px';
            p.clone.style.transform = `rotate(${p.angle}deg)`;
        });
        rafId = requestAnimationFrame(tick);
    }
    tick();
}

    // Visual Soundwave Logic
    const visualizer = document.getElementById('css-visualizer');
    const globalBgMusic = document.getElementById('bg-music');
    
    // Check initial state
    if (visualizer && globalBgMusic && !globalBgMusic.paused) {
        visualizer.classList.add('playing');
    }
    
    if (globalBgMusic) {
        globalBgMusic.addEventListener('play', () => {
            if (visualizer) visualizer.classList.add('playing');
        });
        globalBgMusic.addEventListener('pause', () => {
            if (visualizer) visualizer.classList.remove('playing');
        });
    }

window.hitBong = function() {
    const bong = document.getElementById("bong-img");
    const avatar = document.getElementById("avatar-img");
    
    if (bong && avatar) {
        const bongRect = bong.getBoundingClientRect();
        const avatarRect = avatar.getBoundingClientRect();

        // Calculate center of avatar (mouth area is roughly center-bottom)
        const targetX = avatarRect.left + (avatarRect.width / 2);
        const targetY = avatarRect.top + (avatarRect.height / 1.5);

        // Calculate current center of bong
        const startX = bongRect.left + (bongRect.width / 2);
        const startY = bongRect.top + (bongRect.height / 2);

        const deltaX = targetX - startX;
        const deltaY = targetY - startY;

        bong.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
        bong.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(2.5) rotate(-20deg)`;
    }

    if (window.triggerHotbox) window.triggerHotbox();
}

// Hotbox Mode
window.triggerHotbox = function() {
    const hotboxBtn = document.getElementById("hotbox-btn");
    let hotboxSmoke = document.getElementById("hotbox-smoke");
    const particles = document.getElementById("particles");

    // Dynamically create the elements if they don't exist in the HTML yet
    if (!hotboxSmoke) {
        hotboxSmoke = document.createElement("div");
        hotboxSmoke.id = "hotbox-smoke";
        hotboxSmoke.className = "hotbox-overlay";
        document.body.appendChild(hotboxSmoke);
    }

    if (hotboxBtn) {
        hotboxBtn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i> Lighting up...';
    }

    function releaseSmoke() {
        // Force reflow
        void hotboxSmoke.offsetWidth;
        hotboxSmoke.classList.add("active");
        if (particles) particles.classList.add("hotbox-hidden");

        // Spawn 60 real smoke particles from the sides
        for (let i = 0; i < 60; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'real-smoke-particle';
                
                const isLeft = i % 2 === 0;
                
                // Random size
                const size = Math.random() * 200 + 200; // 200px to 400px
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                
                // Start position
                particle.style.top = `${Math.random() * 100 - 10}vh`;
                if (isLeft) {
                    particle.style.left = `-${size/2}px`;
                } else {
                    particle.style.right = `-${size/2}px`;
                }
                
                // Animation direction
                const direction = isLeft ? 1 : -1;
                const distance = Math.random() * 40 + 30; // 30vw to 70vw
                particle.style.setProperty('--tx', `${direction * distance}vw`);
                particle.style.setProperty('--ty', `${(Math.random() - 0.5) * 40}vh`);
                
                const duration = Math.random() * 2 + 3; // 3s to 5s
                particle.style.animation = `smokeDrift ${duration}s ease-out forwards`;
                
                document.body.appendChild(particle);
                
                setTimeout(() => particle.remove(), duration * 1000);
            }, i * 40);
        }
        
        if (hotboxBtn) hotboxBtn.innerHTML = '<i class="fas fa-cloud" style="margin-right: 8px;"></i> Hotboxed!';
        
        setTimeout(() => {
            hotboxSmoke.classList.remove("active");
            if (particles) particles.classList.remove("hotbox-hidden");
            if (hotboxBtn) hotboxBtn.innerHTML = '<i class="fas fa-cloud" style="margin-right: 8px;"></i> Hotbox Mode';
            
            const bong = document.getElementById("bong-img");
            if (bong) {
                bong.style.transition = "transform 1s ease-in-out";
                bong.style.transform = "translate(0, 0) scale(1) rotate(0deg)";
            }
        }, 5000);
    }

    try {
        const bongHitAudio = new Audio('media/Bong-Hit.mp3');
        bongHitAudio.volume = 1.0;
        
        let playPromise = bongHitAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => {
                console.log("Audio play failed, releasing smoke anyway:", e);
                releaseSmoke(); // Fallback if audio fails
            });
        }
        
        // Release smoke only once when audio ends
        bongHitAudio.onended = releaseSmoke;
    } catch(e) {
        console.log("Audio setup failed:", e);
        releaseSmoke();
    }
};


// 420 UK Time Alarm
function check420Alarm() {
    const now = new Date();
    const str = now.toLocaleString("en-US", { timeZone: "Europe/London" });
    const londonTime = new Date(str);
    
    const hours = londonTime.getHours();
    const minutes = londonTime.getMinutes();
    const dateString = londonTime.toDateString();
    
    if (hours === 16 && minutes === 20) {
        const lastTriggered = localStorage.getItem("last420Trigger");
        if (lastTriggered !== dateString) {
            trigger420Alarm();
            localStorage.setItem("last420Trigger", dateString);
        }
    }
}

function trigger420Alarm() {
    const style = document.createElement("style");
    style.innerHTML = `
    @keyframes rainLeaf {
        0% { transform: translateY(-10vh) rotate(0deg) translateX(0px); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(110vh) rotate(360deg) translateX(var(--sway)); opacity: 0; }
    }
    .weed-leaf-rain {
        position: fixed !important;
        top: -10vh;
        color: #4CAF50;
        z-index: 5;
        pointer-events: none;
        text-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
    }
    `;
    document.head.appendChild(style);

    const flash = document.createElement("div");
    flash.style.position = "fixed";
    flash.style.top = "0";
    flash.style.left = "0";
    flash.style.width = "100vw";
    flash.style.height = "100vh";
    flash.style.backgroundColor = "rgba(76, 175, 80, 0.4)";
    flash.style.zIndex = "5";
    flash.style.pointerEvents = "none";
    flash.style.transition = "opacity 0.5s ease-out";
    document.body.appendChild(flash);
    
    const particles = document.getElementById("particles");
    if (particles) particles.classList.add("hotbox-hidden");
    
    const banner = document.createElement("div");
    banner.style.position = "fixed";
    banner.style.top = "-100px";
    banner.style.left = "50%";
    banner.style.transform = "translateX(-50%)";
    banner.style.backgroundColor = "#1a1a1a";
    banner.style.color = "#4CAF50";
    banner.style.padding = "15px 30px";
    banner.style.borderRadius = "10px";
    banner.style.border = "2px solid rgba(76, 175, 80, 0.5)";
    banner.style.boxShadow = "0 0 20px rgba(76, 175, 80, 0.3)";
    banner.style.fontFamily = "'Poppins', sans-serif";
    banner.style.fontWeight = "bold";
    banner.style.fontSize = "1.2rem";
    banner.style.zIndex = "5";
    banner.style.whiteSpace = "nowrap";
    banner.style.transition = "top 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    banner.innerHTML = "<i class=\"fas fa-leaf\" style=\"margin-right: 10px;\"></i> IT'S 4:20 IN THE UK - TIME TO BLAZE IT <i class=\"fas fa-leaf\" style=\"margin-left: 10px;\"></i>";
    document.body.appendChild(banner);
    
    // Force reflow
    void banner.offsetWidth;
    
    // Spawn rain
    const leaves = [];
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const leaf = document.createElement("i");
            leaf.className = "fas fa-leaf weed-leaf-rain";
            leaf.style.left = `${Math.random() * 100}vw`;
            
            const size = Math.random() * 20 + 16;
            leaf.style.fontSize = `${size}px`;
            
            const duration = Math.random() * 2 + 3; // 3 to 5 seconds
            leaf.style.animation = `rainLeaf ${duration}s linear forwards`;
            
            const sway = (Math.random() - 0.5) * 200; // -100px to 100px
            leaf.style.setProperty("--sway", `${sway}px`);
            
            document.body.appendChild(leaf);
            leaves.push(leaf);
        }, i * 100);
    }
    
    setTimeout(() => {
        banner.style.top = "20px";
    }, 100);
    
    setTimeout(() => {
        flash.style.opacity = "0";
        banner.style.top = "-100px";
    }, 6000);
    
    setTimeout(() => {
        flash.remove();
        banner.remove();
        style.remove();
        leaves.forEach(l => l.remove());
        if (particles) particles.classList.remove("hotbox-hidden");
    }, 7000);
}

// Check the time every 5 seconds so we do not miss the minute
setInterval(check420Alarm, 5000);


