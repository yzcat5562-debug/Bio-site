document.addEventListener('DOMContentLoaded', () => {
    const enterScreen = document.getElementById('enter-screen');
    const bioContainer = document.querySelector('.bio-container');
    const bgMusic = document.getElementById('bg-music');

    // Typewriter effect phrases
    const phrases = ["Welcome to yzcat.xyz you chud", "THC", "420"];
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

    // Create background particles
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 60;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Random properties for natural look
            const size = Math.random() * 2 + 1;
            const left = Math.random() * 100;
            const duration = Math.random() * 15 + 10; // Slow falling
            const delay = Math.random() * 5;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.top = `-10px`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;

            particlesContainer.appendChild(particle);
        }
    }

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
        createParticles();
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
    const muteBtn = document.getElementById('mute-btn');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const progressBarBg = document.getElementById('progress-bar-bg');
    const progressFill = document.getElementById('progress-fill');
    const progressThumb = document.getElementById('progress-thumb');

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

    // Click on progress bar to seek
    progressBarBg.addEventListener('click', (e) => {
        const rect = progressBarBg.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        bgMusic.currentTime = pos * bgMusic.duration;
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

    // --- Discord Presence (Lanyard API) ---
    // IMPORTANT: You must join the Lanyard Discord server for this to work: discord.gg/lanyard
    const discordId = '1090716729996488725'; // Your Discord User ID
    
    async function fetchDiscordStatus() {
        try {
            const res = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
            const data = await res.json();
            
            if (data.success) {
                const d = data.data;
                const statusDot = document.getElementById('discord-status-dot');
                const pfp = document.getElementById('discord-pfp');
                const username = document.getElementById('discord-username');
                const idEl = document.getElementById('discord-id');
                
                // Update status color
                statusDot.className = 'discord-status'; // reset classes
                statusDot.classList.add(`status-${d.discord_status}`); // online, idle, dnd, offline
                
                // Update username and ID
                username.textContent = d.discord_user.username;
                idEl.textContent = `ID: ${d.discord_user.id}`;
                
                // Update PFP
                if (d.discord_user.avatar) {
                    pfp.src = `https://cdn.discordapp.com/avatars/${d.discord_user.id}/${d.discord_user.avatar}.png?size=128`;
                }
            }
        } catch (e) {
            console.log("Could not fetch Discord status");
        }
    }
    
    // Fetch initially and then every 10 seconds if ID is set
    if (discordId !== 'REPLACE_WITH_YOUR_DISCORD_ID') {
        fetchDiscordStatus();
        setInterval(fetchDiscordStatus, 10000);
    }
});
