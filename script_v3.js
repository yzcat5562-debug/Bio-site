
// --- ACHIEVEMENT SYSTEM ---
window.ACHIEVEMENTS_DATA = {
    'type_420': { title: 'Snoop\'s Blessing', desc: 'Type 420 to summon the Doggfather.', icon: 'fas fa-leaf', locked: true, secret: true },
    'gravity': { title: 'Anti-Gravity', desc: 'Type yzcat to disable the laws of physics.', icon: 'fas fa-rocket', locked: true, secret: true },
    'time_420': { title: '420 Blaze It', desc: 'Stay on the page for 4 minutes and 20 seconds.', icon: 'fas fa-cannabis', locked: true },
    'hotbox': { title: 'Snoop Dogg', desc: 'Drag the bong to the profile picture to hotbox the site.', icon: 'fas fa-cloud', locked: true },
    'lean_mode': { title: 'Chopped & Screwed', desc: 'Pour all ingredients and drink the double cup.', icon: 'fas fa-wine-glass-alt', locked: true },
    'overdrive': { title: 'Overdrive', desc: 'Turn the music volume all the way up past 100%.', icon: 'fas fa-volume-up', locked: true },
    'fast_fingers': { title: 'Fast Fingers', desc: 'Complete the typing test with over 60 WPM & 90% Acc.', icon: 'fas fa-keyboard', locked: true },
    'meltdown': { title: 'Core Meltdown', desc: 'Overheat the site by clicking the Steam icon 7 times.', icon: 'fas fa-fire', locked: true },
    'social_butterfly': { title: 'Social Butterfly', desc: 'Click 5 different links on the page.', icon: 'fas fa-link', locked: true }
};

window.renderAchievementsList = function() {
    const list = document.getElementById('achievements-list');
    if (!list) return;
    
    list.innerHTML = '';
    
    // Sort so unlocked are at the top, then locked
    const keys = Object.keys(window.ACHIEVEMENTS_DATA).sort((a, b) => {
        const achA = window.ACHIEVEMENTS_DATA[a];
        const achB = window.ACHIEVEMENTS_DATA[b];
        if (achA.secret && !achB.secret) return -1;
        if (!achA.secret && achB.secret) return 1;
        return (achA.locked === achB.locked) ? 0 : achA.locked ? 1 : -1;
    });
    
    keys.forEach(key => {
        const ach = window.ACHIEVEMENTS_DATA[key];
        const item = document.createElement('div');
        
        const bgColor = ach.locked ? 'rgba(255,255,255,0.02)' : 'rgba(10,10,15,0.6)';
        const borderColor = ach.locked ? 'rgba(255,255,255,0.05)' : 'rgba(51,255,102,0.3)';
        const iconColor = ach.locked ? '#444' : '#33ff66';
        const titleColor = ach.locked ? '#666' : '#33ff66';
        const descColor = ach.locked ? '#555' : '#e0e0e0';
        const lockIcon = ach.locked ? '<i class="fas fa-lock" style="position: absolute; right: 15px; top: 15px; color: #333; font-size: 1.2rem;"></i>' : '';
        const isSecretLocked = (ach.locked && ach.secret);
        const displayIcon = isSecretLocked ? 'fas fa-question' : ach.icon;
        const displayTitle = isSecretLocked ? '???' : ach.title;
        const displayDesc = isSecretLocked ? 'Secret Achievement' : ach.desc;
        
        item.style.cssText = `position: relative; background: ${bgColor}; border: 1px solid ${borderColor}; border-radius: 8px; padding: 12px 15px; display: flex; align-items: center; gap: 15px; transition: all 0.3s;`;
        
        item.innerHTML = `
            ${lockIcon}
            <div style="font-size: 2rem; color: ${iconColor}; width: 40px; text-align: center; ${!ach.locked ? 'text-shadow: 0 0 10px rgba(51,255,102,0.5);' : ''}"><i class="${displayIcon}"></i></div>
            <div style="display: flex; flex-direction: column;">
                <div style="font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: ${titleColor}; margin-bottom: 2px;">${displayTitle}</div>
                <div style="font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; font-weight: 500; color: ${descColor}; padding-right: 20px;">${displayDesc}</div>
            </div>
        `;
        
        list.appendChild(item);
    });
};

window.unlockedAchievements = new Set();
try {
    const savedAch = localStorage.getItem('unlockedAchievements');
    if (savedAch) {
        JSON.parse(savedAch).forEach(id => {
            window.unlockedAchievements.add(id);
            if (window.ACHIEVEMENTS_DATA && window.ACHIEVEMENTS_DATA[id]) {
                window.ACHIEVEMENTS_DATA[id].locked = false;
            }
        });
    }
} catch(e) {}

document.addEventListener('DOMContentLoaded', () => {
    const countEl = document.getElementById('unlocked-count');
    if (countEl) {
        countEl.innerText = window.unlockedAchievements.size;
        // Also update the total dynamically so we don't have to hardcode it in HTML
        countEl.nextSibling.textContent = '/' + Object.keys(window.ACHIEVEMENTS_DATA).length + ' Unlocked';
    }
});

window.unlockAchievement = function(id, title, desc, iconClass) {
    if (window.unlockedAchievements.has(id)) return;
    window.unlockedAchievements.add(id);
    
    try {
        localStorage.setItem('unlockedAchievements', JSON.stringify(Array.from(window.unlockedAchievements)));
    } catch(e) {}
    
    // Update data state
    if (window.ACHIEVEMENTS_DATA[id]) {
        window.ACHIEVEMENTS_DATA[id].locked = false;
        const countEl = document.getElementById('unlocked-count');
        if (countEl) countEl.innerText = window.unlockedAchievements.size;
    }
    
    // If modal is open, re-render live
    const modal = document.getElementById('achievements-modal');
    if (modal && modal.classList.contains('show')) {
        window.renderAchievementsList();
    }
    
    const clickSound = document.getElementById('click-audio');
    if(clickSound) {
        clickSound.currentTime = 0;
        clickSound.play();
    }
    
    let container = document.getElementById('achievement-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'achievement-container';
        container.className = 'achievement-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
        <div class="achievement-icon"><i class="${iconClass}"></i></div>
        <div class="achievement-text-container">
            <div class="achievement-title">${title}</div>
            <div class="achievement-desc">${desc}</div>
        </div>
    `;
    container.appendChild(toast);
    
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
    });
    
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 400);
    }, 4500);
};

// 4:20 Timer Achievement
setTimeout(() => {
    window.unlockAchievement('time_420', 'Achievement Unlocked', '420 Blaze It (Stayed 4m 20s)', 'fas fa-cannabis');
}, 260000);

// Link Click Tracking
document.addEventListener('DOMContentLoaded', () => {
    const clickedLinks = new Set();
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href !== '#' && !href.startsWith('javascript')) {
                clickedLinks.add(href);
                if (clickedLinks.size >= 5) {
                    window.unlockAchievement('social_butterfly', 'Achievement Unlocked', 'Social Butterfly (Clicked 5 Links)', 'fas fa-link');
                }
            }
        });
    });
});

class PremiumUISounds {
    constructor() {
        this.hoverSound = new Audio("media/hover.wav");
        this.clickSound = new Audio("media/click.wav?v=2");
        this.swooshSound = new Audio("media/swoosh.wav?v=2");
        this.hoverSound.load();
        this.clickSound.load();
        this.swooshSound.load();
        this.masterVolume = 1.0;
        this.baseHoverVol = 0.8;
        this.baseClickVol = 1.0;
        this.baseSwooshVol = 0.8;
    }
    
    init() {
        this.hoverSound.volume = 0;
        this.hoverSound.play().then(() => {
            this.hoverSound.pause();
            this.hoverSound.currentTime = 0;
            this.updateVolumes();
        }).catch(e => {});
        this.updateVolumes();
    }

    setVolume(vol) {
        this.masterVolume = vol;
        this.updateVolumes();
    }

    updateVolumes() {
        this.hoverSound.volume = this.baseHoverVol * this.masterVolume;
        this.clickSound.volume = this.baseClickVol * this.masterVolume;
        this.swooshSound.volume = this.baseSwooshVol * this.masterVolume;
    }

    playTick() {
        const now = Date.now();
        if (now - (this.lastTickTime || 0) < 100) return;
        this.lastTickTime = now;

        this.hoverSound.currentTime = 0;
        this.hoverSound.play().catch(e => {});
    }

    playThud() {
        this.clickSound.currentTime = 0;
        this.clickSound.play().catch(e => {});
    }

    playSwoosh() {
        this.swooshSound.currentTime = 0;
        this.swooshSound.play().catch(e => {});
    }
}
window.uiSounds = new PremiumUISounds();


window.triggerMeltdown = function() {
    window.isMeltdown = true;
    window.currentTemp = 1500; // Melting point of glass in Celsius
    
    const tempEl = document.getElementById('nest-temp');
    if(tempEl) tempEl.innerHTML = '1500&deg;C';
    const screen = document.getElementById('nest-screen');
    const mode = document.getElementById('nest-mode');
    
    if(screen) screen.style.background = 'radial-gradient(circle, #ffffff 0%, #ff5500 40%, #aa0000 100%)';
    if(screen) screen.style.boxShadow = 'inset 0 0 40px #000, 0 0 100px rgba(255, 100, 0, 1)';
    if(screen) screen.style.animation = 'screen-glitch 0.2s infinite';
    if(mode) mode.innerText = 'MELTDOWN';
    if(mode) mode.style.color = '#fff';
    if(mode) mode.style.textShadow = '0 0 10px #ff0000';
    
    document.body.classList.add("meltdown-mode");
    
    const crack = document.createElement('div');
    crack.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; background: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Cpath stroke=%22rgba(255,255,255,0.9)%22 stroke-width=%221.5%22 fill=%22none%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 d=%22M50,50 L20,0 M50,50 L90,10 M50,50 L10,80 M50,50 L80,100 M50,50 L30,90 M50,50 L60,30 M50,50 L10,35 M50,50 L95,65 M20,0 L35,30 M80,100 L65,70%22 /%3E%3C/svg%3E'); background-size: 100% 100%; pointer-events: none; z-index: 999;";
    if(screen) screen.appendChild(crack);
    
    let heatOverlay = document.getElementById('temp-heat-overlay');
    let moltenContainer = document.getElementById('molten-drips-container');
    const card = document.querySelector('.bio-layout') || document.querySelector('.bio-card');
    
    if (heatOverlay) {
        heatOverlay.style.background = 'radial-gradient(ellipse at bottom, rgba(255, 60, 0, 0.4) 0%, transparent 90%)';
        heatOverlay.style.animation = 'pulse-ambient 0.5s infinite alternate ease-in-out';
    }
    if (moltenContainer) moltenContainer.style.opacity = '1';
    
    if (card) {
        card.style.boxShadow = '0 0 80px rgba(255, 80, 0, 0.9), inset 0 0 40px rgba(255, 150, 0, 0.6)';
        card.style.border = '2px solid rgba(255, 200, 0, 0.8)';
        card.style.background = 'rgba(255, 100, 0, 0.1)';
        card.style.backdropFilter = 'blur(16px) saturate(200%) brightness(1.4)';
        card.style.webkitBackdropFilter = 'blur(16px) saturate(200%) brightness(1.4)';
    }
    document.body.style.animation = 'shake-screen 0.5s infinite';
    
    // 1. ADD VISIBLE FLAME TO THERMOSTAT
    const thermostat = document.querySelector('.nest-thermostat');
    if (thermostat && !document.getElementById('thermo-flame')) {
        const tFlame = document.createElement('div');
        tFlame.id = 'thermo-flame';
        tFlame.className = 'real-flame massive-flame';
        thermostat.appendChild(tFlame);
    }

    // 2. ADD VISIBLE FLAMES TO ALL SOCIAL ICONS
    const socials = document.querySelectorAll('.social-link');
    socials.forEach(link => {
        if (!link.querySelector('.real-flame')) {
            const sFlame = document.createElement('div');
            sFlame.className = 'real-flame small-flame';
            link.appendChild(sFlame);
        }
    });
};

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
        if (window.currentTemp >= 80) return;
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
        particle.style.animationDelay = `-${Math.random() * 2}s`;
        particle.style.setProperty('--sway', `${sway}px`);

        particlesContainer.appendChild(particle);
        setTimeout(() => particle.remove(), duration * 1000);
    }

    function startParticles() {
        for (let i = 0; i < 120; i++) {
            setTimeout(spawnParticle, Math.random() * 8000);
        }
        setInterval(spawnParticle, 100);
    window.addEventListener('snow-burst', () => {
        for (let i = 0; i < 60; i++) {
            setTimeout(spawnParticle, Math.random() * 2000);
        }
    });
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
        window.uiSounds.init();
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
    const card = document.querySelector('.bio-layout') || document.querySelector('.bio-card');
    if (card) {
        card.style.transformStyle = "preserve-3d";
        card.style.webkitTransformStyle = "preserve-3d";
        card.style.willChange = "transform";
        card.style.backfaceVisibility = "hidden";
        card.style.webkitBackfaceVisibility = "hidden";
        card.style.transform = "translateZ(0)";
    }

        const container = document.querySelector('.bio-container');
    if (container) {
        container.style.transformStyle = "preserve-3d";
        container.style.webkitTransformStyle = "preserve-3d";
        container.style.willChange = "transform";
        container.style.backfaceVisibility = "hidden";
        container.style.webkitBackfaceVisibility = "hidden";
    }

    // Buttery Smooth Tilt Effect
    let tiltTicking = false;
    card.addEventListener('mousemove', (e) => {
        if (!hasEntered || !container) return;
        
        if (!tiltTicking) {
            window.requestAnimationFrame(() => {
                // Use screen center instead of bounding rect to prevent recursive jitter feedback loops
                const screenCenterX = window.innerWidth / 2;
                const screenCenterY = window.innerHeight / 2;

                // Dampen the effect based on screen size so it doesn't over-rotate on ultrawide monitors
                let rotateY = (e.clientX - screenCenterX) / 40;
                let rotateX = -(e.clientY - screenCenterY) / 40;
                
                // Clamp max rotation to 12 degrees to keep it clean
                rotateY = Math.max(-12, Math.min(12, rotateY));
                rotateX = Math.max(-12, Math.min(12, rotateX));

                container.style.transform = `perspective(1200px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(0.94)`;
                tiltTicking = false;
            });
            tiltTicking = true;
        }
    });

    card.addEventListener('mouseleave', () => {
        if (container) {
            container.style.transform = `perspective(1200px) rotateY(0deg) rotateX(0deg) scale(0.94)`;
            // Bouncy smooth reset
            container.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
        }
    });

    card.addEventListener('mouseenter', () => {
        if (container) {
            // Remove CSS transition completely during hover to prevent conflict with requestAnimationFrame
            container.style.transition = 'none';
        }
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
        
        // Reset Speed to Normal
        const speedSl = document.getElementById("speed-slider");
        const speedIc = document.getElementById("speed-icon");
        const resetSpeedToggle = document.getElementById("reset-speed-toggle");
        if (speedSl && speedIc && (!resetSpeedToggle || resetSpeedToggle.checked)) {
            speedSl.value = 1.0;
            bgMusic.playbackRate = 1.0;
            speedIc.style.color = "";
            speedIc.style.textShadow = "";
        }
        
        // Reset Volume Overdrive to Normal
        const volSl = document.getElementById("volume-slider");
        if (volSl && parseFloat(volSl.value) > 1.0) {
            volSl.value = 1.0;
            volSl.dispatchEvent(new Event("input"));
        }
        
        bgMusic.src = track.src;
        songTitleEl.textContent = track.title;
        bgMusic.load();
        
        // Re-apply speed in case the browser natively resets playbackRate on track change
        if (typeof speedSl !== "undefined" && speedSl) {
            bgMusic.playbackRate = parseFloat(speedSl.value);
            bgMusic.preservesPitch = false;
            if (typeof bgMusic.mozPreservesPitch !== "undefined") bgMusic.mozPreservesPitch = false;
            if (typeof bgMusic.webkitPreservesPitch !== "undefined") bgMusic.webkitPreservesPitch = false;
        }
        
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
        const volInput = document.getElementById("volume-slider");
        if (volInput && volInput.value > 1.0) {
            document.body.classList.add("ear-rape-mode");
            volInput.classList.add("slider-is-broken");
            volInput.parentElement.classList.add("slider-broken");
            if (typeof fallbackHum !== "undefined") fallbackHum.play().catch(()=>{});
        }
    });

    bgMusic.addEventListener('pause', () => {
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        playPauseBtn.classList.remove('playing');
        document.body.classList.remove("ear-rape-mode");
        const volInput = document.getElementById("volume-slider");
        if (volInput) {
            volInput.classList.remove("slider-is-broken");
            volInput.parentElement.classList.remove("slider-broken");
        }
        if (typeof fallbackHum !== "undefined") fallbackHum.pause();
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
        
        // If user is typing in an input box (like the typing test), let them type!
        if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
        
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

    // Speed Control Logic
    const speedSlider = document.getElementById("speed-slider");
    const speedIcon = document.getElementById("speed-icon");
    
    // Disable pitch preservation for true Chopped & Screwed / Nightcore effect
    bgMusic.preservesPitch = false;
    if (typeof bgMusic.mozPreservesPitch !== "undefined") bgMusic.mozPreservesPitch = false;
    if (typeof bgMusic.webkitPreservesPitch !== "undefined") bgMusic.webkitPreservesPitch = false;

    if (speedSlider && speedIcon) {
        speedSlider.addEventListener("input", (e) => {
            const speed = parseFloat(e.target.value);
            bgMusic.playbackRate = speed;
            
            if (speed < 1.0) {
                speedIcon.style.color = "#a060ff"; // purple for chopped & screwed
                speedIcon.style.textShadow = "0 0 8px #a060ff";
            } else if (speed > 1.0) {
                speedIcon.style.color = "#ff60a0"; // pink for nightcore
                speedIcon.style.textShadow = "0 0 8px #ff60a0";
            } else {
                speedIcon.style.color = "";
                speedIcon.style.textShadow = "";
            }
        });

        speedIcon.addEventListener("dblclick", () => {
            speedSlider.value = 1.0;
            bgMusic.playbackRate = 1.0;
            speedIcon.style.color = "";
            speedIcon.style.textShadow = "";
        });
    }

    // Volume Control Logic
    const volumeSlider = document.getElementById('volume-slider');

    // Ear-Rape Mode Audio Context
    window.overdriveCtx = null;
    let overdriveSource = null;
    let overdriveGain = null;
    let overdriveBass = null;
    let overdriveDist = null;

    function initOverdrive() {
        if (window.overdriveCtx) return;
        
        // Web Audio API createMediaElementSource PERMANENTLY mutes local file:/// audio due to CORS.
        if (window.location.protocol === "file:") {
            console.warn("Local testing detected. Web Audio API bypassed to prevent permanent track muting.");
            window.overdriveCtx = { dummy: true, state: "running" };
            return;
        }

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        window.overdriveCtx = new AudioContext();
        
        try {
            overdriveSource = window.overdriveCtx.createMediaElementSource(bgMusic);
            
            overdriveBass = window.overdriveCtx.createBiquadFilter();
            overdriveBass.type = "lowshelf";
            overdriveBass.frequency.value = 150;
            overdriveBass.gain.value = 0;
            
            overdriveGain = window.overdriveCtx.createGain();
            overdriveGain.gain.value = 1;
            
            overdriveSource.connect(overdriveBass);
            overdriveBass.connect(overdriveGain);
            overdriveGain.connect(window.overdriveCtx.destination);
        } catch(e) {
            console.error("Audio routing failed:", e);
            window.overdriveCtx = { dummy: true, state: "running" };
        }
    }

    function makeDistortionCurve(amount) {
        if (amount <= 0) return null;
        const k = amount,
              n_samples = 44100,
              curve = new Float32Array(n_samples),
              deg = Math.PI / 180;
        for (let i = 0; i < n_samples; ++i) {
            const x = i * 2 / n_samples - 1;
            curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
        }
        return curve;
    }

    // Set initial volume safely
    const initialVol = parseFloat(volumeSlider.value);
    bgMusic.volume = initialVol > 1.0 ? 1.0 : initialVol;

    let isDraggingVolume = false;
    let isStraining = false;
    let strainAudio = new Audio("media/strain.wav");
    let breakAudio = new Audio("media/break.wav");
    let fallbackHum = new Audio("media/overdrive-hum.wav");
    fallbackHum.loop = true;
    strainAudio.loop = true;

    volumeSlider.addEventListener("mousedown", () => isDraggingVolume = true);
    document.addEventListener("mouseup", () => {
        isDraggingVolume = false;
        if (isStraining) {
            isStraining = false;
            volumeSlider.parentElement.classList.remove("slider-straining");
            strainAudio.pause();
            strainAudio.currentTime = 0;
        }
    });

    // Overdrive Unlock Logic
    document.addEventListener("mousemove", (e) => {
        if (!isDraggingVolume) return;
        const rect = volumeSlider.getBoundingClientRect();
        
        if (volumeSlider.max === "1") {
            const pullDist = e.clientX - rect.right;
            
            if (pullDist > 0 && pullDist <= 40) {
                if (!isStraining) {
                    isStraining = true;
                    volumeSlider.parentElement.classList.add("slider-straining");
                    if (!bgMusic.paused) strainAudio.play().catch(()=>{});
                }
            } else if (pullDist > 40) {
                // UNLOCK OVERDRIVE!
                isStraining = false;
                strainAudio.pause();
                strainAudio.currentTime = 0;
                
                volumeSlider.parentElement.classList.remove("slider-straining");
                if (!bgMusic.paused) breakAudio.play().catch(()=>{});
                if (!bgMusic.paused) {
                    volumeSlider.parentElement.classList.add("slider-broken");
                    volumeSlider.classList.add("slider-is-broken");
                }
                
                // Spawn Sparks
                for(let i=0; i<8; i++) {
                    let spark = document.createElement("div");
                    spark.className = "break-spark";
                    spark.style.left = "50%";
                    spark.style.setProperty("--tx", (Math.random() * 60 - 30) + "px");
                    spark.style.setProperty("--ty", (Math.random() * -50 - 10) + "px");
                    volumeSlider.parentElement.appendChild(spark);
                    setTimeout(() => spark.remove(), 600);
                }
                
                volumeSlider.max = "2";
                if (!window.overdriveCtx) initOverdrive();
                
                setTimeout(() => {
                    volumeSlider.parentElement.classList.remove("slider-broken");
                }, 500);
            } else {
                if (isStraining) {
                    isStraining = false;
                    volumeSlider.parentElement.classList.remove("slider-straining");
                    strainAudio.pause();
                    strainAudio.currentTime = 0;
                }
            }
        }
    });

    volumeSlider.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        
        if (val > 1.0) {
            window.unlockAchievement('overdrive', 'Achievement Unlocked', 'Overdrive (Volume > 100%)', 'fas fa-volume-up');
            if (!window.overdriveCtx) {
                const wasPlaying = !bgMusic.paused;
                initOverdrive();
                if (wasPlaying) bgMusic.play().catch(()=>{});
            }
            
            if (!bgMusic.paused) {
                document.body.classList.add("ear-rape-mode");
                volumeSlider.classList.add("slider-is-broken");
                volumeSlider.parentElement.classList.add("slider-broken");
            } else {
                document.body.classList.remove("ear-rape-mode");
                volumeSlider.classList.remove("slider-is-broken");
                volumeSlider.parentElement.classList.remove("slider-broken");
            }
            
            bgMusic.volume = 1.0;
            const extra = val - 1.0; // 0.0 to 1.0
            
            if (window.overdriveCtx) {
                if (window.overdriveCtx.state === "suspended" && window.overdriveCtx.resume) {
                    window.overdriveCtx.resume();
                }
                if (!window.overdriveCtx.dummy) {
                    overdriveGain.gain.value = 1 + (extra * 100);
                    overdriveBass.gain.value = extra * 100;
                } else if (fallbackHum.paused && !bgMusic.paused) {
                    // Play fallback hum if Web Audio is bypassed locally
                    fallbackHum.play().catch(()=>{});
                }
            }
        } else {
            document.body.classList.remove("ear-rape-mode");
            bgMusic.volume = val;
            
            // Relock overdrive if they turn it back down to normal
            if (val <= 1.0 && volumeSlider.max === "2") {
                volumeSlider.max = "1";
                volumeSlider.classList.remove("slider-is-broken");
                volumeSlider.style.background = "";
            }
            
            if (window.overdriveCtx) {
                if (window.overdriveCtx.state === "suspended" && window.overdriveCtx.resume) {
                    window.overdriveCtx.resume();
                }
                if (!window.overdriveCtx.dummy) {
                    overdriveGain.gain.value = 1;
                    overdriveBass.gain.value = 0;
                } else {
                    fallbackHum.pause();
                }
            }
        }

        bgMusic.muted = false;
        muteBtn.classList.remove("fa-volume-mute");
        muteBtn.classList.add("fa-volume-up");

        if (val === 0) {
            muteBtn.classList.remove("fa-volume-up");
            muteBtn.classList.add("fa-volume-mute");
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

    const STEAM_API_KEY = 'F6CDF82F437435F8E472E05ABC9FA262'; // Not an api key made by my steam account buy nice try.
    const STEAM_ID = '76561198985852410'; 
    
    // Array of free public CORS proxies to ensure it always works
    const proxies = [
        'https://proxy.cors.sh/',
        'https://api.allorigins.win/get?url=',
        'https://api.codetabs.com/v1/proxy?quest=',
        'https://corsproxy.org/?',
        'https://thingproxy.freeboard.io/fetch/'
    ];

    async function fetchWithFallback(targetUrl) {
        for (let proxy of proxies) {
            try {
                // allorigins needs URL encoding, others might prefer direct appending
                const isAllOrigins = proxy.includes('allorigins');
                const finalUrl = proxy + (isAllOrigins ? encodeURIComponent(targetUrl) : targetUrl);
                
                const response = await fetch(finalUrl);
                if (response.ok) {
                    const data = await response.json();
                    // allorigins wraps it in a 'contents' string, others return raw JSON
                    return isAllOrigins ? JSON.parse(data.contents) : data;
                }
            } catch (e) {
                console.log("Proxy " + proxy + " failed, trying next...");
            }
        }
        throw new Error("All public proxies are blocked.");
    }

    async function updateSteamStatus() {
        const pfp = document.getElementById('steam-pfp');
        const username = document.getElementById('steam-username');
        const state = document.getElementById('steam-state');
        const dot = document.getElementById('steam-status-dot');
        const gameSection = document.getElementById('steam-game-section');
        const gameTitle = document.getElementById('steam-game-title');
        const gameCapsule = document.getElementById('steam-game-capsule');
        const link = document.getElementById('steam-card-link');

        if (!pfp || !username) return;

        try {
            const targetUrl = 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=' + STEAM_API_KEY + '&steamids=' + STEAM_ID + '&_t=' + Date.now();
            const steamData = await fetchWithFallback(targetUrl);

            if (steamData.response && steamData.response.players && steamData.response.players.length > 0) {
                const player = steamData.response.players[0];
                
                username.textContent = player.personaname;
                pfp.src = player.avatarfull;
                link.href = player.profileurl;

                // Reset
                state.className = 'steam-state';
                dot.className = 'steam-status-dot';
                gameSection.classList.remove('active');
                gameCapsule.style.display = 'none';

                // Handle badge
                const badgeSection = document.getElementById('steam-badge-section');
                const badgeIcon = document.getElementById('steam-badge-icon');
                const badgeTitle = document.getElementById('steam-badge-title');
                const tooltipDesc = document.getElementById('steam-tooltip-desc');
                
                if (badgeSection && player.timecreated) {
                    badgeSection.style.display = 'flex';
                    const years = Math.floor((Date.now() / 1000 - player.timecreated) / 31536000);
                    if (years > 0) {
                        badgeIcon.src = 'https://community.akamai.steamstatic.com/public/images/badges/02_years/steamyears' + years + '_54.png';
                        if (badgeTitle) badgeTitle.textContent = years + ' Years of Service';
                        
                        if (tooltipDesc) {
                            const date = new Date(player.timecreated * 1000);
                            const day = date.getDate();
                            const month = date.toLocaleString('default', { month: 'long' });
                            const year = date.getFullYear();
                            tooltipDesc.textContent = `Member since ${day} ${month}, ${year}.`;
                        }
                    }
                }

                if (player.gameextrainfo) {
                    state.textContent = 'In Game';
                    state.classList.add('ingame');
                    dot.classList.add('ingame');
                    
                    gameSection.classList.add('active');
                    
                    gameTitle.textContent = player.gameextrainfo;
                    
                    if (player.gameid) {
                        gameCapsule.src = 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/' + player.gameid + '/capsule_231x87.jpg';
                        gameCapsule.style.display = 'block';
                    }
                } else {
                    
                    if (player.personastate === 1 || player.personastate === 5 || player.personastate === 6) {
                        state.textContent = 'Online';
                        state.classList.add('online');
                        dot.classList.add('online');
                    } else if (player.personastate === 2) {
                        state.textContent = 'Busy';
                        state.classList.add('offline');
                        dot.classList.add('offline');
                    } else if (player.personastate === 3 || player.personastate === 4) {
                        state.textContent = 'Away';
                        state.classList.add('away');
                        dot.classList.add('away');
                    } else {
                        state.textContent = 'Offline';
                        state.classList.add('offline');
                        dot.classList.add('offline');
                    }
                }
            }
        } catch (e) {
            console.error("Steam status error:", e);
        }
    }

    updateSteamStatus();
    setInterval(updateSteamStatus, 30000);

    function connectLanyard() {
        const ws = new WebSocket('wss://api.lanyard.rest/socket');
        let heartbeatInterval;

        ws.onopen = () => {
            ws.send(JSON.stringify({
                op: 2,
                d: { subscribe_to_id: '1090716729996488725' }
            }));
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
            window.uiSounds.playSwoosh();
            updateModal.classList.add('show');
        });

        closeUpdateModal.addEventListener('click', () => {
            window.uiSounds.playSwoosh();
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
    window.unlockAchievement('hotbox', 'Achievement Unlocked', 'Snoop Dogg (Hotbox Mode)', 'fas fa-cloud');
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












window.overheatClicks = 0;
window.isMeltdown = false;

window.changeTemp = function(amount) {
    if (window.isMeltdown) return;
    
    // Default to Celsius
    if (!window.currentTemp) window.currentTemp = 21;
    const wasHot = window.currentTemp >= 28;
    
    const card = document.querySelector('.bio-layout') || document.querySelector('.bio-card');
    
    if (amount > 0 && window.currentTemp >= 35) { // Max Celsius temp
        window.overheatClicks++;
        
        if (card) {
            let extraSteam = window.overheatClicks * 4;
            card.style.backdropFilter = 'blur(' + (24 + extraSteam) + 'px) saturate(80%) brightness(' + (1.2 + extraSteam/50) + ')';
            card.style.webkitBackdropFilter = 'blur(' + (24 + extraSteam) + 'px) saturate(80%) brightness(' + (1.2 + extraSteam/50) + ')';
            card.style.boxShadow = '0 0 40px rgba(255, 80, 0, 0.4), inset 0 0 ' + (15 + extraSteam*2) + 'px rgba(255, 255, 255, 0.8)';
        }
        
        if (window.overheatClicks > 7) {
            window.triggerMeltdown();
            window.unlockAchievement('meltdown', 'Achievement Unlocked', 'Core Meltdown (Overheated the site)', 'fas fa-fire');
            return;
        }
    } else if (amount < 0) {
        window.overheatClicks = 0;
    }

    window.currentTemp += amount;
    
    if (window.currentTemp > 35) window.currentTemp = 35;
    if (window.currentTemp < 10) window.currentTemp = 10;
    
    if (wasHot && window.currentTemp < 28) {
        window.dispatchEvent(new Event('snow-burst'));
    }
    
    // CLEARLY CELSIUS - arc and status bar updated by updateThermoVisuals
    if (typeof window.updateThermoVisuals === 'function') {
        window.updateThermoVisuals(window.currentTemp, window.currentTemp - (amount || 0));
    } else {
        document.getElementById('nest-temp').innerHTML = window.currentTemp + '&deg;C';
    }
    const screen = document.getElementById('nest-screen');
    const mode = document.getElementById('nest-mode');
    
    let heatOverlay = document.getElementById('temp-heat-overlay');
    let frostOverlay = document.getElementById('temp-frost-overlay');
    let icicles = document.getElementById('temp-icicles');
    let moltenContainer = document.getElementById('molten-drips-container');
    
    const container = document.querySelector('.bio-container');
    
    if (!heatOverlay) {
        heatOverlay = document.createElement('div');
        heatOverlay.id = 'temp-heat-overlay';
        heatOverlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background: radial-gradient(circle, rgba(255,80,0,0) 20%, rgba(255,40,0,0.15) 80%, rgba(200,10,0,0.4) 100%); pointer-events:none; z-index:999998; opacity:0; transition:opacity 2s; box-shadow: inset 0 0 150px rgba(255, 50, 0, 0.4);';
        document.body.appendChild(heatOverlay);
    }
    
    if (!frostOverlay) {
        frostOverlay = document.createElement('div');
        frostOverlay.id = 'temp-frost-overlay';
        frostOverlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; box-shadow: inset 0 0 40px rgba(255,255,255,0.5), inset 0 0 150px rgba(150,220,255,0.4); pointer-events:none; z-index:999998; opacity:0; transition:opacity 2s; backdrop-filter: blur(0px);';
        document.body.appendChild(frostOverlay);
    }
    
    if (!icicles) {
        icicles = document.createElement('div');
        icicles.id = 'temp-icicles';
        icicles.style.cssText = "position:absolute; bottom:-45px; left:0; width:100%; height:45px; background-image: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 preserveAspectRatio=%22none%22%3E%3Cpath fill=%22rgba(255,255,255,0.85)%22 d=%22M0,0 L4,70 L9,0 L16,90 L22,0 L28,55 L35,0 L42,85 L48,0 L56,60 L62,0 L69,95 L76,0 L84,65 L91,0 L96,75 L100,0 Z%22 /%3E%3C/svg%3E'); background-size: 100% 100%; pointer-events:none; z-index:-1; opacity:0; transform:translateY(-20px); transition:all 2s cubic-bezier(0.175, 0.885, 0.32, 1.275);";
        if (container) {
            container.style.position = 'relative';
            container.appendChild(icicles);
        }
    }
    
    if (!moltenContainer) {
        moltenContainer = document.createElement('div');
        moltenContainer.id = 'molten-drips-container';
        moltenContainer.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: -1; opacity: 0; transition: opacity 2s;';
        
        const drips = [
            { left: '0px', width: '25px', delay: '0s', duration: '5s', height: '140px' },
            { left: '25px', width: '15px', delay: '2s', duration: '4s', height: '90px' },
            { right: '0px', width: '30px', delay: '1s', duration: '6s', height: '180px' },
            { right: '30px', width: '12px', delay: '3s', duration: '4.5s', height: '100px' }
        ];
        
        drips.forEach(d => {
            const drip = document.createElement('div');
            drip.style.cssText = "position: absolute; top: -200px; " + 
                (d.left ? "left: " + d.left + "; " : "") + 
                (d.right ? "right: " + d.right + "; " : "") + 
                "width: " + d.width + "; height: " + d.height + "; " +
                "background: linear-gradient(180deg, rgba(255,250,200,0.9) 0%, rgba(255,100,0,0.8) 70%, rgba(200,0,0,0.6) 100%); " +
                "box-shadow: 0 15px 25px rgba(255,50,0,0.9), inset 0 -5px 15px rgba(255,200,0,0.8); " +
                "border-radius: 50px; backdrop-filter: blur(12px); " +
                "animation: melt-drip " + d.duration + " infinite ease-in " + d.delay + ";";
            moltenContainer.appendChild(drip);
        });
        
        if (card) {
            card.appendChild(moltenContainer);
        }
    }

    if (window.currentTemp >= 28) {
        screen.style.background = 'radial-gradient(circle, #ff5500 0%, #aa0000 60%, #330000 100%)';
        screen.style.boxShadow = 'inset 0 0 25px #000, 0 0 40px rgba(255, 80, 0, 0.8)';
        mode.innerText = 'HEATING';
        mode.style.color = '';
        mode.style.textShadow = '';
        heatOverlay.style.opacity = '1';
        heatOverlay.style.background = 'radial-gradient(circle, rgba(255,80,0,0) 20%, rgba(255,40,0,0.15) 80%, rgba(200,10,0,0.4) 100%)';
        heatOverlay.style.animation = 'none';
        frostOverlay.style.opacity = '0';
        
        if (icicles) {
            icicles.style.opacity = '0';
            icicles.style.transform = 'translateY(-20px)';
        }
        
        if (moltenContainer) {
            moltenContainer.style.opacity = '0';
        }
        
        if (card && window.overheatClicks === 0) {
            card.style.overflow = 'hidden';
            card.style.background = 'rgba(255, 255, 255, 0.15)'; 
            card.style.backdropFilter = 'blur(24px) saturate(80%) brightness(1.2)';
            card.style.webkitBackdropFilter = 'blur(24px) saturate(80%) brightness(1.2)';
            
            card.style.boxShadow = '0 0 40px rgba(255, 80, 0, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.3)';
            card.style.border = '1px solid rgba(255, 100, 0, 0.3)';
            card.style.animation = 'none'; 
        }
        
        const particles = document.getElementById('particles');
        if (particles) particles.classList.add('melted');
    } else if (window.currentTemp <= 15) {
        screen.style.background = 'radial-gradient(circle, #0066cc 0%, #001133 100%)';
        screen.style.boxShadow = 'inset 0 0 20px #000, 0 0 15px rgba(0, 150, 255, 0.6)';
        mode.innerText = 'COOLING';
        mode.style.color = '';
        mode.style.textShadow = '';
        heatOverlay.style.opacity = '0';
        frostOverlay.style.opacity = '1';
        
        if (icicles) {
            icicles.style.opacity = '1';
            icicles.style.transform = 'translateY(0)';
        }
        
        if (moltenContainer) {
            moltenContainer.style.opacity = '0';
        }
        
        if (card) {
            card.style.overflow = 'hidden'; 
            card.style.background = 'rgba(200, 240, 255, 0.15)'; 
            card.style.boxShadow = 'inset 0 0 40px rgba(255, 255, 255, 0.6), inset 0 0 80px rgba(150, 220, 255, 0.3), 0 30px 60px rgba(0, 0, 0, 0.6)';
            card.style.backdropFilter = 'blur(24px) saturate(120%) brightness(1.2)'; 
            card.style.webkitBackdropFilter = 'blur(24px) saturate(120%) brightness(1.2)';
            card.style.animation = 'none';
            card.style.border = '1px solid rgba(255, 255, 255, 0.15)';
        }
        
        const particles = document.getElementById('particles');
        if (particles) particles.classList.remove('melted');
    } else {
        screen.style.background = 'radial-gradient(circle, #222 0%, #000 100%)';
        screen.style.boxShadow = 'inset 0 0 15px rgba(0,0,0,1)';
        mode.innerText = 'AUTO';
        mode.style.color = '';
        mode.style.textShadow = '';
        heatOverlay.style.opacity = '0';
        frostOverlay.style.opacity = '0';
        
        if (icicles) {
            icicles.style.opacity = '0';
            icicles.style.transform = 'translateY(-20px)';
        }
        
        if (moltenContainer) {
            moltenContainer.style.opacity = '0';
        }
        
        if (card) {
            card.style.overflow = 'hidden';
            card.style.background = 'rgba(10, 10, 10, 0.15)';
            card.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            card.style.backdropFilter = 'blur(16px) saturate(160%)';
            card.style.webkitBackdropFilter = 'blur(16px) saturate(160%)';
            card.style.animation = 'none';
            card.style.border = '1px solid rgba(255, 255, 255, 0.15)';
        }
        
        const particles = document.getElementById('particles');
        if (particles) particles.classList.remove('melted');
    }
};


// ASMR Mechanical Keyboard Feature
(function() {
    const soundUrls = {
        default: [
            'media/key1.wav',
            'media/key2.wav',
            'media/key3.wav',
            'media/key4.wav',
            'media/key5.wav',
            'media/key6.wav'
        ],
        space: 'media/space.wav',
        enter: 'media/enter.wav'
    };

    const audioPool = {
        default: [],
        space: null,
        enter: null
    };

    function preloadAudio(url) {
        const audio = new Audio(url);
        audio.preload = 'auto';
        audio.load();
        return audio;
    }

    audioPool.space = preloadAudio(soundUrls.space);
    audioPool.enter = preloadAudio(soundUrls.enter);
    soundUrls.default.forEach(url => {
        audioPool.default.push(preloadAudio(url));
    });

    // UI Logic
    const settingsBtn = document.getElementById('site-settings-btn');
    const settingsPanel = document.getElementById('site-settings-panel');
    const volumeSlider = document.getElementById('asmr-volume');
    const volumeLabel = document.getElementById('asmr-volume-label');
    
    // Load saved volume or default to 0.8
    let currentVolume = localStorage.getItem('asmr-volume');
    if (currentVolume === null) currentVolume = 0.8;
        else currentVolume = parseFloat(currentVolume);
    
    if (volumeSlider && volumeLabel) {
        volumeSlider.value = currentVolume;
        volumeLabel.textContent = Math.round(currentVolume * 100) + '%';
        
        volumeSlider.addEventListener('input', (e) => {
            currentVolume = parseFloat(e.target.value);
            volumeLabel.textContent = Math.round(currentVolume * 100) + '%';
            localStorage.setItem('asmr-volume', currentVolume);
        });
    }

    // UI Sounds Volume Logic
    const uiVolumeSlider = document.getElementById('ui-volume');
    const uiVolumeLabel = document.getElementById('ui-volume-label');
    
    let currentUiVolume = localStorage.getItem('ui-volume');
    if (currentUiVolume === null) currentUiVolume = 1.0;
    else currentUiVolume = parseFloat(currentUiVolume);
    
    if (uiVolumeSlider && uiVolumeLabel) {
        uiVolumeSlider.value = currentUiVolume;
        uiVolumeLabel.textContent = Math.round(currentUiVolume * 100) + '%';
        if (window.uiSounds) window.uiSounds.setVolume(currentUiVolume);
        
        uiVolumeSlider.addEventListener('input', (e) => {
            currentUiVolume = parseFloat(e.target.value);
            uiVolumeLabel.textContent = Math.round(currentUiVolume * 100) + '%';
            localStorage.setItem('ui-volume', currentUiVolume);
            if (window.uiSounds) window.uiSounds.setVolume(currentUiVolume);
        });
    }

    // Reset Speed Toggle Logic
    const resetSpeedToggle = document.getElementById("reset-speed-toggle");
    if (resetSpeedToggle) {
        const savedToggle = localStorage.getItem("resetSpeedOnSwitch");
        if (savedToggle !== null) {
            resetSpeedToggle.checked = (savedToggle === "true");
        }
        
        resetSpeedToggle.addEventListener("change", (e) => {
            localStorage.setItem("resetSpeedOnSwitch", e.target.checked);
        });
    }

    if (settingsBtn && settingsPanel) {
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsPanel.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
                settingsPanel.classList.remove('active');
            }
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.repeat) return;

        let audioToPlay;
        let volumeMultiplier = 1.0;

        if (e.code === 'Space') {
            audioToPlay = audioPool.space;
            volumeMultiplier = 1.1; // spacebar is usually slightly louder
        } else if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            audioToPlay = audioPool.enter;
            volumeMultiplier = 1.1;
        } else {
            const randIndex = Math.floor(Math.random() * audioPool.default.length);
            audioToPlay = audioPool.default[randIndex];
        }

        if (audioToPlay) {
            const clone = audioToPlay.cloneNode(true);
            // Cap volume at 1.0
            clone.volume = Math.min(1.0, currentVolume * volumeMultiplier);
            clone.play().catch(err => {
                // Ignore autoplay errors before user interacts
            });
            clone.onended = () => clone.remove();
        }
    });
})();




// ===== THERMOSTAT TOGGLE =====
window.toggleThermostat = function() {
    var panel    = document.getElementById('inline-thermostat');
    var arrow    = document.getElementById('thermostat-arrow');
    var arrowBtn = document.querySelector('.inline-thermostat-arrow');
    if (!panel) return;
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
        arrow.className = arrow.className.replace('fa-chevron-left','fa-chevron-right');
        if (arrowBtn) arrowBtn.style.right = '140px';
    } else {
        arrow.className = arrow.className.replace('fa-chevron-right','fa-chevron-left');
        if (arrowBtn) arrowBtn.style.right = '0px';
    }
};

// ===== THERMOSTAT DIAL TWIST =====
document.addEventListener('DOMContentLoaded', function() {
    var wrapper = document.getElementById('nest-thermostat');
    if (!wrapper) return;

    var isTwisting = false;
    var nestCenter = { x: 0, y: 0 };
    var lastAngle  = 0;
    var accDelta   = 0;
    var visualRot  = 0;

    wrapper.style.cursor = 'grab';

    wrapper.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
        isTwisting = true;
        wrapper.style.cursor = 'grabbing';
        var rect = wrapper.getBoundingClientRect();
        nestCenter.x = rect.left + rect.width / 2;
        nestCenter.y = rect.top  + rect.height / 2;
        lastAngle = Math.atan2(e.clientY - nestCenter.y, e.clientX - nestCenter.x);
        e.preventDefault();
    });

    window.addEventListener('mousemove', function(e) {
        if (!isTwisting) return;
        var angle = Math.atan2(e.clientY - nestCenter.y, e.clientX - nestCenter.x);
        var delta = angle - lastAngle;
        if (delta >  Math.PI) delta -= 2 * Math.PI;
        if (delta < -Math.PI) delta += 2 * Math.PI;
        accDelta  += delta;
        visualRot += delta * (180 / Math.PI);
        wrapper.style.background = 'conic-gradient(from ' + (180 + visualRot) + 'deg, #555 0%, #ccc 20%, #eee 50%, #ccc 80%, #555 100%)';
        if (accDelta > 0.12)       { window.changeTemp(1);  accDelta = 0; }
        else if (accDelta < -0.12) { window.changeTemp(-1); accDelta = 0; }
        lastAngle = angle;
    });

    window.addEventListener('mouseup', function() {
        isTwisting = false;
        wrapper.style.cursor = 'grab';
    });

    wrapper.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (e.deltaY < 0) window.changeTemp(1);
        else              window.changeTemp(-1);
        visualRot += (e.deltaY < 0 ? 10 : -10);
        wrapper.style.background = 'conic-gradient(from ' + (180 + visualRot) + 'deg, #555 0%, #ccc 20%, #eee 50%, #ccc 80%, #555 100%)';
    }, { passive: false });

    // Build SVG tick marks
    var ticksGroup = document.getElementById('thermo-ticks');
    if (ticksGroup) {
        for (var i = 0; i <= 27; i++) {
            var frac  = i / 27;
            var ang   = (135 + frac * 270) * (Math.PI / 180);
            var line  = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', 80 + 75 * Math.cos(ang));
            line.setAttribute('y1', 80 + 75 * Math.sin(ang));
            line.setAttribute('x2', 80 + 69 * Math.cos(ang));
            line.setAttribute('y2', 80 + 69 * Math.sin(ang));
            line.setAttribute('class', 'thermo-tick');
            line.id = 'tick-' + i;
            ticksGroup.appendChild(line);
        }
    }

    updateThermoArc(window.currentTemp || 21);
});

function updateThermoArc(temp) {
    var arcFill    = document.getElementById('thermo-arc-fill');
    var statusDot  = document.getElementById('thermo-status-dot');
    var statusText = document.getElementById('thermo-status-text');
    var tempEl     = document.getElementById('nest-temp');
    var panel      = document.getElementById('inline-thermostat');
    var dial       = document.getElementById('nest-thermostat');

    if (tempEl) tempEl.innerHTML = temp + '&deg;C';

    var fraction = Math.max(0, Math.min(1, (temp - 0) / 35));
    if (arcFill) arcFill.style.strokeDashoffset = 339.3 - fraction * 339.3;

    var activeTicks = Math.round(fraction * 27);
    for (var i = 0; i <= 27; i++) {
        var t = document.getElementById('tick-' + i);
        if (t) { if (i <= activeTicks) t.classList.add('active'); else t.classList.remove('active'); }
    }

    var colour, state;
    if (temp >= 35)      { colour = '#ff3300'; state = 'melt'; }
    else if (temp >= 28) { colour = '#ff9800'; state = 'heat'; }
    else if (temp <= 15) { colour = '#4fc3f7'; state = 'cool'; }
    else                 { colour = '#aaaaaa'; state = 'auto'; }

    if (arcFill) arcFill.style.stroke = colour;

    var labels = { cool: 'cooling', auto: 'standby', heat: 'heating', melt: 'meltdown!' };
    if (statusText) statusText.textContent = labels[state];
    if (statusDot)  { statusDot.style.background = colour; statusDot.style.boxShadow = state !== 'auto' ? '0 0 8px ' + colour : 'none'; }

    ['state-cool','state-heat','state-melt'].forEach(function(c) {
        if (panel) panel.classList.remove(c);
        if (dial)  dial.classList.remove(c);
    });
    if (state !== 'auto') {
        if (panel) panel.classList.add('state-' + state);
        if (dial)  dial.classList.add('state-' + state);
    }
}






// ===== STEAM STATUS =====
(function() {
    // STEAM API CONFIGURATION
    // Since Steam blocked public proxies from scraping their XML, you MUST use a free Steam Web API key.
    // 1. Go to https://steamcommunity.com/dev/apikey
    // 2. Login and get an API key (Domain can be anything, e.g., 'localhost')
    // 3. Paste the key below:
    const STEAM_API_KEY = 'YOUR_API_KEY_HERE'; 
})();
// ===== THE 420 SUMMONING =====
window.start420Summoning = function() {
    if (window.is420Summoning) return;
    window.is420Summoning = true;
    
    window.unlockAchievement('type_420', 'Achievement Unlocked', 'Snoop\'s Blessing (Summoned the Doggfather)', 'fas fa-leaf');

    // 1. Massive Pixelated Blunt Drop
    const blunt = document.createElement('img');
    blunt.src = 'media/joint.png';
    blunt.style.position = 'fixed';
    blunt.style.top = '-800px';
    blunt.style.left = '50%';
    blunt.style.transform = 'translateX(-50%) rotate(135deg)';
    blunt.style.width = '400px';
    blunt.style.zIndex = '9999999';
    blunt.style.transition = 'top 1.5s cubic-bezier(0.25, 1, 0.5, 1)';
    blunt.style.filter = 'drop-shadow(0 20px 50px rgba(0,255,0,0.8))';
    blunt.style.imageRendering = 'pixelated';
    document.body.appendChild(blunt);

    // 2. Snoop Doggs Sliding In
    const snoopLeft = document.createElement('img');
    snoopLeft.src = 'media/SnoopDogLeft.png';
    snoopLeft.style.position = 'fixed';
    snoopLeft.style.bottom = '-50px';
    snoopLeft.style.left = '-600px'; 
    snoopLeft.style.height = '60vh'; 
    snoopLeft.style.zIndex = '9999998';
    snoopLeft.style.transition = 'left 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    snoopLeft.style.pointerEvents = 'none';
    document.body.appendChild(snoopLeft);

    const snoopRight = document.createElement('img');
    snoopRight.src = 'media/SnoopDogRight.png';
    snoopRight.style.position = 'fixed';
    snoopRight.style.bottom = '-50px';
    snoopRight.style.right = '-600px'; 
    snoopRight.style.height = '60vh';
    snoopRight.style.zIndex = '9999998';
    snoopRight.style.transition = 'right 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    snoopRight.style.pointerEvents = 'none';
    document.body.appendChild(snoopRight);

    void blunt.offsetWidth;

    setTimeout(() => {
        blunt.style.top = '10vh';
        snoopLeft.style.left = '-20px';
        snoopRight.style.right = '-20px';
    }, 100);

    // 3. TRUE HOTBOX SMOKE PARTICLES
    const hotboxSmoke = document.getElementById('hotbox-smoke');
    if (hotboxSmoke) {
        hotboxSmoke.classList.add('active');
    }

    for (let i = 0; i < 60; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'real-smoke-particle';
            
            const isLeft = i % 2 === 0;
            const size = Math.random() * 200 + 200; 
            
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.top = (Math.random() * 100 - 10) + 'vh';
            
            if (isLeft) {
                particle.style.left = '-' + (size/2) + 'px';
            } else {
                particle.style.right = '-' + (size/2) + 'px';
            }
            
            const direction = isLeft ? 1 : -1;
            const distance = Math.random() * 40 + 30; 
            particle.style.setProperty('--tx', (direction * distance) + 'vw');
            particle.style.setProperty('--ty', ((Math.random() - 0.5) * 40) + 'vh');
            
            const duration = Math.random() * 2 + 3; 
            particle.style.animation = 'smokeDrift ' + duration + 's ease-out forwards';
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), duration * 1000);
        }, i * 40);
    }

        // 4. Audio Swap - Play Drop It Like Its Hot
    const bgMusic = document.getElementById('bg-music');
    const wasPlaying = bgMusic && !bgMusic.paused;
    if (wasPlaying) bgMusic.pause();

    const weedAudio = new Audio('media/smoke-weed-everyday.mp3');
    weedAudio.volume = 1.0;
    weedAudio.preload = 'auto';

    const snoopAudio = new Audio('media/drop-it-like-its-hot.mp3');
    snoopAudio.volume = 1.0;
    
    let isClosing = false;
    
    const triggerEndSequence = () => {
        if (isClosing) return;
        isClosing = true;

        snoopAudio.pause(); // Force cut Snoop Dogg
        
        // Visuals close out
        blunt.style.top = '150vh'; 
        snoopLeft.style.left = '-600px'; 
        snoopRight.style.right = '-600px';
        
        if (hotboxSmoke) hotboxSmoke.classList.remove('active');
        
        setTimeout(() => {
            blunt.remove();
            snoopLeft.remove();
            snoopRight.remove();
        }, 2000);

        // Play 'Smoke Weed Everyday' based purely on the VISUAL animation finishing
        snoopLeft.addEventListener('transitionend', function handler(e) {
            if (e.propertyName !== 'left') return;
            snoopLeft.removeEventListener('transitionend', handler);
            
            let playPromise = weedAudio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    weedAudio.onended = () => {
                        if (wasPlaying) bgMusic.play().catch(e => console.log('Music error', e));
                        window.is420Summoning = false; 
                    };
                }).catch(err => {
                    console.log('Audio error:', err);
                    if (wasPlaying) bgMusic.play();
                    window.is420Summoning = false;
                });
            } else {
                weedAudio.onended = () => {
                    if (wasPlaying) bgMusic.play();
                    window.is420Summoning = false;
                };
            }
        });
    };

    snoopAudio.play().catch(e => console.log('Audio error:', e));

    // STRICT 4.5 SECOND CUTOFF (Ignores file silences entirely)
    setTimeout(triggerEndSequence, 4500);


};

let secret420Code = '';
let secretYzcatCode = '';
document.addEventListener('keydown', (e) => {
    // Ignore if typing in an input
    if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') return;
    
    secret420Code += e.key;
    if (secret420Code.length > 3) secret420Code = secret420Code.substring(secret420Code.length - 3);
    
    if (secret420Code === '420') {
        window.start420Summoning();
        secret420Code = '';
    }
    
    secretYzcatCode += e.key.toLowerCase();
    if (secretYzcatCode.length > 5) secretYzcatCode = secretYzcatCode.substring(secretYzcatCode.length - 5);
    
    if (secretYzcatCode === 'yzcat') {
        window.breakGravity();
        secretYzcatCode = '';
    }
});

window.breakGravity = function() {
    if (document.body.classList.contains('gravity-broken')) return;
    document.body.classList.add('gravity-broken');
    
    const container = document.querySelector('.bio-container');
    if (container) {
        container.classList.add('gravity-broken');
    }
    
    window.unlockAchievement('gravity', 'Achievement Unlocked', 'Anti-Gravity (Broke the laws of physics)', 'fas fa-rocket');
};








document.addEventListener("DOMContentLoaded", () => {
    // --- Premium UI Sound Bindings ---
    const interactables = document.querySelectorAll("a, button, .social-link, .playlist-item, .steam-card, .steam-badge-section, .thermostat-container, .inline-thermostat-arrow, input[type=range], .discord-card, #prev-song-btn, #play-pause-btn, #next-song-btn, #track-info-btn, #mute-btn, .aesthetic-joint-wrapper");
    interactables.forEach(el => {
        el.addEventListener("mouseenter", () => {
            if(window.uiSounds) window.uiSounds.playTick();
        });
        el.addEventListener("mousedown", () => {
            if(window.uiSounds) window.uiSounds.playThud();
        });
    });
});





















































// --- LEAN CUP (CHOPPED & SCREWED MODE) ---
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
    #lean-cup-container {
        position: absolute; top: 15px; left: 15px; width: 55px; height: 75px;
        cursor: pointer; z-index: 1000; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        filter: drop-shadow(0 5px 10px rgba(0,0,0,0.5));
    }
    #lean-cup-container:hover { transform: scale(1.1) rotate(-5deg); filter: drop-shadow(0 10px 15px rgba(200,0,255,0.6)); }
    #lean-cup-container:active { transform: scale(0.95); }
    
    .lean-tooltip {
        position: absolute; top: 80px; left: 50%; transform: translateX(-50%);
        background: rgba(180, 0, 255, 0.9); color: white; padding: 4px 10px;
        border-radius: 6px; font-size: 10px; font-weight: bold; text-transform: uppercase;
        box-shadow: 0 4px 10px rgba(180,0,255,0.4);
        opacity: 0; transition: opacity 0.3s; pointer-events: none; white-space: nowrap;
    }
    #lean-cup-container:hover .lean-tooltip { opacity: 1; }

    @keyframes bottlePourAnimFixed {
        0% { opacity: 0; transform: translate(-30px, -60px) rotate(0deg); }
        15% { opacity: 1; transform: translate(15px, -30px) rotate(110deg); }
        85% { opacity: 1; transform: translate(15px, -30px) rotate(110deg); }
        100% { opacity: 0; transform: translate(-30px, -60px) rotate(0deg); }
    }

    @keyframes pourStreamFixed {
        0% { transform: translateY(-30px) scaleY(0.1); opacity: 0; transform-origin: top center; }
        10% { opacity: 1; }
        70% { transform: translateY(0px) scaleY(1); opacity: 1; transform-origin: top center; }
        100% { transform: translateY(30px) scaleY(0); opacity: 0; transform-origin: bottom center; }
    }

    @keyframes candyDropFixed {
        0% { transform: translate(0px, -80px) rotate(0deg); opacity: 0; }
        20% { opacity: 1; }
        70% { transform: translate(0px, -10px) rotate(45deg); opacity: 1; }
        100% { transform: translate(0px, 10px) rotate(90deg) scale(0.2); opacity: 0; }
    }

    @keyframes leanFizz {
        0% { transform: translateY(0) scale(0.5); opacity: 0.8; }
        100% { transform: translateY(-40px) scale(1.5); opacity: 0; }
    }
    @keyframes lean-sway {
        0% { transform: rotate(-1deg) scale(1.02); }
        100% { transform: rotate(1deg) scale(1.02); }
    }
    @keyframes cup-drink {
        0% { transform: rotate(0deg) scale(1); opacity: 1; }
        50% { transform: rotate(120deg) scale(1.2) translateY(-20px); opacity: 1; }
        100% { transform: rotate(120deg) scale(0.5) translateY(-50px); opacity: 0; }
    }
    body.lean-mode {
        animation: lean-sway 10s infinite alternate ease-in-out;
    }
    body.lean-mode::after {
        content: ''; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: linear-gradient(135deg, rgba(120,0,200,0.3), rgba(60,0,100,0.4));
        mix-blend-mode: multiply; pointer-events: none; z-index: 99998;
        animation: fade-in-lean 4s forwards;
    }
    body.lean-mode-exit::after {
        content: ''; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: linear-gradient(135deg, rgba(120,0,200,0.3), rgba(60,0,100,0.4));
        mix-blend-mode: multiply; pointer-events: none; z-index: 99998;
        animation: fade-out-lean 2s forwards;
    }
    @keyframes fade-in-lean { 0% { opacity: 0; } 100% { opacity: 1; backdrop-filter: blur(2px) contrast(1.1) sepia(0.2); } }
    @keyframes fade-out-lean { 0% { opacity: 1; backdrop-filter: blur(2px) contrast(1.1) sepia(0.2); } 100% { opacity: 0; backdrop-filter: blur(0); } }
    
    .lean-mode * { transition-duration: 2s !important; }
    .lean-mode .particles { opacity: 0.4 !important; }
    `;
    document.head.appendChild(style);

    const cup = document.createElement('div');
    cup.id = 'lean-cup-container';
    cup.innerHTML = `
        <div class="lean-tooltip" id="lean-tooltip">Pour Syrup</div>
        <div id="lean-fizz" style="position: absolute; top: 10px; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10;"></div>
        <svg viewBox="0 0 100 140" style="width: 100%; height: 100%; position: relative; z-index: 5; overflow: visible;">
            <ellipse cx="50" cy="25" rx="38" ry="12" fill="#ececec" />
            <ellipse id="lean-liquid-top" cx="50" cy="28" rx="34" ry="9" fill="#4b0082" opacity="0" style="transition: all 0.5s;" />
            <rect x="30" y="20" width="15" height="15" fill="#fff" opacity="0.8" transform="rotate(15 30 20)" />
            <rect x="55" y="22" width="12" height="12" fill="#fff" opacity="0.9" transform="rotate(-10 55 22)" />
            <path d="M 12,25 L 28,115 Q 50,125 72,115 L 88,25 Z" fill="#ffffff" />
            <path d="M 16,55 L 26,122 Q 50,132 74,122 L 84,55 Z" fill="#ffffff" stroke="#ddd" stroke-width="2" />
            <path class="lean-drip" d="M 25,25 Q 28,45 32,55 Q 35,60 38,45 Q 40,30 45,25 Z" fill="#4b0082" opacity="0" style="transition: all 0.5s;" />
            <path class="lean-drip" d="M 60,25 Q 65,55 68,45 Q 72,30 75,25 Z" fill="#4b0082" opacity="0" style="transition: all 0.5s;" />
            <path d="M 28,115 L 12,25" stroke="rgba(0,0,0,0.03)" stroke-width="3" />
            <path d="M 72,115 L 88,25" stroke="rgba(0,0,0,0.03)" stroke-width="3" />
        </svg>
    `;
    
    const card = document.querySelector('.bio-card');
    if (card) {
        card.style.position = 'relative';
        card.appendChild(cup);
    } else {
        document.body.appendChild(cup);
    }

    let leanClicks = 0;
    const liquidTop = document.getElementById('lean-liquid-top');
    const drips = document.querySelectorAll('.lean-drip');

    cup.addEventListener('click', () => {
        if (leanClicks >= 4) return;

        const rect = cup.getBoundingClientRect();
        const animLayer = document.createElement('div');
        animLayer.style.cssText = `position: fixed; top: ${rect.top}px; left: ${rect.left}px; width: ${rect.width}px; height: ${rect.height}px; z-index: 999999; pointer-events: none;`;
        document.body.appendChild(animLayer);

        if (leanClicks === 0) {
            // 1. POUR SYRUP (CUSTOM PNG)
            const bottle = document.createElement('div');
            bottle.style.cssText = `position:absolute; top:-20px; left:-30px; width:45px; height:60px; transform-origin: center 60%; animation: bottlePourAnimFixed 2s forwards;`;
            bottle.innerHTML = `<img src="media/Syrup.png" style="width: 45px; height: auto; object-fit: contain; filter: drop-shadow(0 5px 10px rgba(75,0,130,0.5));" />`;
            animLayer.appendChild(bottle);

            setTimeout(() => {
                const syrup = document.createElement('div');
                syrup.style.cssText = `position: absolute; top: -15px; left: 50%; width: 6px; height: 40px; background: #4b0082; border-radius: 4px; box-shadow: 0 0 10px #4b0082; animation: pourStreamFixed 1.2s forwards ease-in;`;
                animLayer.appendChild(syrup);
                
                setTimeout(() => {
                    liquidTop.setAttribute('opacity', '0.6');
                    liquidTop.setAttribute('fill', '#4b0082');
                    drips.forEach(d => d.setAttribute('opacity', '0.3'));
                }, 400);
            }, 500);

            leanClicks++;
            document.getElementById('lean-tooltip').innerText = "Pour Sprite";

        } else if (leanClicks === 1) {
            // 2. POUR SPRITE (CUSTOM PNG)
            const bottle = document.createElement('div');
            bottle.style.cssText = `position:absolute; top:-20px; left:-30px; width:45px; height:60px; transform-origin: center 60%; animation: bottlePourAnimFixed 2s forwards;`;
            bottle.innerHTML = `<img src="media/Sprite-Bottle.png" style="width: 45px; height: auto; object-fit: contain; filter: drop-shadow(0 5px 10px rgba(0,255,0,0.3));" />`;
            animLayer.appendChild(bottle);

            setTimeout(() => {
                const sprite = document.createElement('div');
                sprite.style.cssText = `position: absolute; top: -15px; left: 45%; width: 12px; height: 45px; background: rgba(255, 255, 255, 0.9); border-radius: 4px; filter: blur(1px); animation: pourStreamFixed 1.5s forwards ease-in;`;
                animLayer.appendChild(sprite);
                
                setTimeout(() => {
                    liquidTop.setAttribute('opacity', '0.9');
                    liquidTop.setAttribute('fill', '#b000ff');
                    drips.forEach(d => d.setAttribute('opacity', '1'));
                    drips.forEach(d => d.setAttribute('fill', '#9900ff'));
                    
                    const fizzContainer = document.getElementById('lean-fizz');
                    for(let i=0; i<15; i++){
                        const b = document.createElement('div');
                        b.style.cssText = `position: absolute; bottom: 0; left: ${20 + Math.random()*60}%; width: ${3 + Math.random()*4}px; height: ${3 + Math.random()*4}px; background: #fff; border-radius: 50%; opacity: 0.8; animation: leanFizz ${0.5 + Math.random()}s forwards ease-out;`;
                        fizzContainer.appendChild(b);
                    }
                }, 500);
            }, 500);

            leanClicks++;
            document.getElementById('lean-tooltip').innerText = "Cotton Candy";

        } else if (leanClicks === 2) {
            // 3. DROP FLUFFY PINK COTTON CANDY FROM TOP
            const candy = document.createElement('div');
            candy.style.cssText = `position: absolute; top: -10px; left: 10px; width: 35px; height: 35px; animation: candyDropFixed 1s forwards ease-in;`;
            candy.innerHTML = `
                <div style="position:absolute; top:0px; left:5px; width:20px; height:20px; background:#ff66cc; border-radius:50%; filter:blur(1.5px);"></div>
                <div style="position:absolute; top:10px; left:-5px; width:25px; height:25px; background:#ff99dd; border-radius:50%; filter:blur(2px);"></div>
                <div style="position:absolute; top:8px; left:15px; width:22px; height:22px; background:#ff33aa; border-radius:50%; filter:blur(1px);"></div>
                <div style="position:absolute; top:20px; left:10px; width:18px; height:18px; background:#ffb3e6; border-radius:50%; filter:blur(1.5px);"></div>
            `;
            animLayer.appendChild(candy);
            
            setTimeout(() => {
                liquidTop.setAttribute('fill', '#ff00ff');
                drips.forEach(d => d.setAttribute('fill', '#ff00ff'));
                
                const fizzContainer = document.getElementById('lean-fizz');
                for(let i=0; i<8; i++){
                    const b = document.createElement('div');
                    b.style.cssText = `position: absolute; bottom: 0; left: ${20 + Math.random()*60}%; width: ${4 + Math.random()*4}px; height: ${4 + Math.random()*4}px; background: #ff99dd; border-radius: 50%; opacity: 0.8; animation: leanFizz ${0.5 + Math.random()}s forwards ease-out;`;
                    fizzContainer.appendChild(b);
                }
            }, 800);

            leanClicks++;
            document.getElementById('lean-tooltip').innerText = "DRINK IT";
            document.getElementById('lean-tooltip').style.background = "#ff0000";

        } else if (leanClicks === 3) {
            // 4. DRINK
            leanClicks++;
            document.getElementById('lean-tooltip').style.opacity = '0';
            cup.style.animation = 'cup-drink 1.5s forwards ease-in';
            
            setTimeout(() => {
                document.body.classList.add('lean-mode'); window.unlockAchievement('lean_mode', 'Achievement Unlocked', 'Chopped & Screwed', 'fas fa-wine-glass-alt');
                
                const audio = document.getElementById('bg-music');
                if (audio) {
                    audio.preservesPitch = false;
                    audio.playbackRate = 0.65;
                }
                
                const bong = document.getElementById('bong-hit-audio');
                if(bong) {
                    bong.preservesPitch = false;
                    bong.playbackRate = 0.65;
                }

                // --- 12 SECOND TIMER TO REVERSE EFFECT ---
                setTimeout(() => {
                    // Fade out lean mode
                    document.body.classList.remove('lean-mode');
                    document.body.classList.add('lean-mode-exit');
                    setTimeout(() => document.body.classList.remove('lean-mode-exit'), 2000);

                    // Restore audio speed
                    if (audio) audio.playbackRate = 1.0;
                    if (bong) bong.playbackRate = 1.0;

                    // Reset Cup so they can make it again
                    leanClicks = 0;
                    cup.style.animation = 'none'; // stops the drink disappear animation
                    liquidTop.setAttribute('opacity', '0');
                    liquidTop.setAttribute('fill', '#4b0082');
                    drips.forEach(d => d.setAttribute('opacity', '0'));
                    
                    document.getElementById('lean-tooltip').innerText = "Pour Syrup";
                    document.getElementById('lean-tooltip').style.background = "rgba(180, 0, 255, 0.9)";
                    document.getElementById('lean-tooltip').style.opacity = '';
                }, 12000);

            }, 1000);
        }
        
        setTimeout(() => {
            if(animLayer.parentNode) animLayer.parentNode.removeChild(animLayer);
        }, 2500);
    });

    const audioPlayer = document.getElementById('bg-music');
    if (audioPlayer) {
        audioPlayer.addEventListener('play', () => {
            if (document.body.classList.contains('lean-mode')) {
                audioPlayer.preservesPitch = false;
                audioPlayer.playbackRate = 0.65;
            } else {
                audioPlayer.playbackRate = 1.0;
            }
        });
    }
});



// --- TYPING TEST WIDGET ---
document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('typing-test-card');
    const input = document.getElementById('typing-input');
    const display = document.getElementById('typing-word-display');
    const timerEl = document.getElementById('typing-timer');
    const wpmEl = document.getElementById('typing-wpm');
    const overlay = document.getElementById('typing-overlay');
    const finalWpm = document.getElementById('typing-final-wpm');
    const finalAcc = document.getElementById('typing-final-acc');
    const restartBtn = document.getElementById('typing-restart-btn');

    if (!card) return;

        const sentences = [
        "yzcat", "is", "the", "absolute", "greatest", "of", "all", "time.", 
        "smoking", "weed", "is", "so", "incredibly", "nice", "and", "relaxing.",
        "rolling", "up", "a", "fresh", "joint", "is", "the", "best", "feeling", "ever.",
        "yzcat", "always", "drops", "the", "craziest", "updates", "and", "never", "misses.",
        "sparking", "up", "some", "loud", "pack", "is", "the", "ultimate", "vibe.",
        "yzcat", "is", "basically", "a", "god", "among", "men.",
        "nothing", "beats", "getting", "high", "and", "listening", "to", "music."
    ];
    const wordList = sentences;

    let words = [];
    let currentWordIndex = 0;
    let currentCharIndex = 0;
    let timer = 15;
    let timerInterval = null;
    let isTyping = false;
    let globalCorrectChars = 0;
    let currentCorrect = 0;
    let totalKeystrokes = 0;

    function initGame() {
        words = [];
        // Shuffle the full sentences so it makes sense
        const fullSentences = [
            "yzcat is the absolute greatest of all time.",
            "smoking weed is so incredibly nice and relaxing.",
            "rolling up a fresh joint is the best feeling ever.",
            "yzcat always drops the craziest updates and never misses.",
            "sparking up some loud pack is the ultimate vibe.",
            "yzcat is basically a god among men.",
            "nothing beats getting high and listening to music."
        ];
        // randomize order of sentences
        fullSentences.sort(() => Math.random() - 0.5);
        const combined = fullSentences.join(" ").split(" ");
        for(let i=0; i<combined.length; i++) {
            words.push(combined[i]);
        }
        currentWordIndex = 0;
        currentCharIndex = 0;
        timer = 15;
        globalCorrectChars = 0;
        currentCorrect = 0;
        totalKeystrokes = 0;
        isTyping = false;
        
        input.value = '';
        input.disabled = false;
        timerEl.innerText = timer + 's';
        wpmEl.innerText = '0 WPM';
        overlay.classList.remove('show');
        
        renderInitialWords();
        if(timerInterval) clearInterval(timerInterval);
    }

    function renderInitialWords() {
        display.innerHTML = '';
        words.forEach((word, wIdx) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.marginRight = '8px';
            
            for(let i = 0; i < word.length; i++) {
                const charSpan = document.createElement('span');
                charSpan.innerText = word[i];
                if (wIdx === 0 && i === 0) {
                    charSpan.classList.add('active');
                }
                wordSpan.appendChild(charSpan);
            }
            display.appendChild(wordSpan);
        });
        display.scrollTop = 0;
    }

    function startGame() {
        if(isTyping) return;
        isTyping = true;
        timerInterval = setInterval(() => {
            timer--;
            timerEl.innerText = timer + 's';
            
            const timePassed = (15 - timer) / 60;
            const wpm = timePassed > 0 ? Math.round(((globalCorrectChars + currentCorrect) / 5) / timePassed) : 0;
            wpmEl.innerText = wpm + ' WPM';

            if(timer <= 0) {
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        clearInterval(timerInterval);
        input.disabled = true;
        input.blur(); // Automatically unfocus the input so spacebar music controls work again
        
        const finalSpeed = Math.round(((globalCorrectChars + currentCorrect) / 5) / (15 / 60));
        const acc = totalKeystrokes > 0 ? Math.round(((globalCorrectChars + currentCorrect) / totalKeystrokes) * 100) : 0;
        
        finalWpm.innerText = finalSpeed + ' WPM';
        if (finalSpeed >= 60 && acc >= 90) {
            window.unlockAchievement('fast_fingers', 'Achievement Unlocked', 'Fast Fingers (60+ WPM)', 'fas fa-keyboard');
        }
        finalAcc.innerText = acc + '% Accuracy';
        overlay.classList.add('show');
    }

    const startOverlay = document.getElementById('typing-start-overlay');
    const startBtn = document.getElementById('typing-start-btn');
    
    // Make card clicks focus input ONLY if start overlay is hidden and game isn't over
    card.addEventListener('click', () => {
        if(startOverlay && startOverlay.classList.contains('hidden') && !overlay.classList.contains('show')) {
            input.focus();
        }
    });
    
    if(startBtn) {
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            startOverlay.classList.add('hidden');
            input.focus();
            if(!isTyping && timer === 15) {
                // Words are already pre-rendered by initGame!
            }
        });
    }

    input.addEventListener('input', (e) => {
        if(!isTyping) startGame();
        
        const typed = input.value;
        const currentWord = words[currentWordIndex];
        const wordEl = display.childNodes[currentWordIndex];
        
        if (e.inputType !== "deleteContentBackward" && !typed.endsWith(' ')) {
            totalKeystrokes++;
        }
        
        // Handle space (next word)
        if (typed.endsWith(' ')) {
            input.value = '';
            // Commit correct chars for this word (plus space)
            globalCorrectChars += currentCorrect + 1; 
            currentCorrect = 0;
            
            // Remove active cursor from current word
            if(wordEl) {
                for(let i=0; i<wordEl.childNodes.length; i++) {
                    wordEl.childNodes[i].classList.remove('active');
                }
            }
            
            currentWordIndex++;
            currentCharIndex = 0;
            
            if(currentWordIndex >= words.length - 5) {
                // Append more words gracefully without destroying DOM
                const fullSentences = [
                    "yzcat is the absolute greatest of all time.",
                    "smoking weed is so incredibly nice and relaxing.",
                    "rolling up a fresh joint is the best feeling ever.",
                    "yzcat always drops the craziest updates and never misses.",
                    "sparking up some loud pack is the ultimate vibe.",
                    "yzcat is basically a god among men.",
                    "nothing beats getting high and listening to music."
                ];
                const newSentenceWords = fullSentences[Math.floor(Math.random() * fullSentences.length)].split(" ");
                for(let i=0; i<newSentenceWords.length; i++) {
                    const newWord = newSentenceWords[i];
                    words.push(newWord);
                    const wordSpan = document.createElement('span');
                    wordSpan.style.display = 'inline-block';
                    wordSpan.style.marginRight = '8px';
                    for(let c = 0; c < newWord.length; c++) {
                        const charSpan = document.createElement('span');
                        charSpan.innerText = newWord[c];
                        wordSpan.appendChild(charSpan);
                    }
                    display.appendChild(wordSpan);
                }
            }
            
            // Add active cursor to next word and scroll
            const newWordEl = display.childNodes[currentWordIndex];
            if(newWordEl && newWordEl.childNodes[0]) {
                newWordEl.childNodes[0].classList.add('active');
                display.scrollTop = newWordEl.offsetTop;
            }
            return;
        }
        
        // Validate chars visually
        currentCorrect = 0;
        for(let i=0; i<wordEl.childNodes.length; i++) {
            const charEl = wordEl.childNodes[i];
            charEl.className = '';
            
            if (i < typed.length) {
                if (typed[i] === currentWord[i]) {
                    charEl.classList.add('correct');
                    currentCorrect++;
                } else {
                    charEl.classList.add('incorrect');
                }
            } else if (i === typed.length) {
                charEl.classList.add('active');
            }
        }
        currentCharIndex = typed.length;
    });

    restartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        initGame();
        if(startOverlay) startOverlay.classList.remove('hidden');
    });

    initGame();
});



document.addEventListener('toggle', (e) => {
    if (e.target.tagName === 'DETAILS' && e.target.open) {
        
    }
}, true);






document.addEventListener('DOMContentLoaded', () => {
    const steamIcon = document.querySelector('.steam-card-title i.fa-steam');
    if (steamIcon) {
        steamIcon.style.cursor = 'pointer';
        steamIcon.style.position = 'relative';
        
        function blowSteam(amount) {
            for (let i=0; i<amount; i++) {
                const steam = document.createElement('div');
                steam.style.position = 'absolute';
                steam.style.left = '50%';
                steam.style.top = '50%';
                steam.style.width = '20px';
                steam.style.height = '20px';
                steam.style.background = 'rgba(255, 255, 255, 0.6)';
                steam.style.borderRadius = '50%';
                steam.style.filter = 'blur(8px)';
                steam.style.pointerEvents = 'none';
                steam.style.transform = 'translate(-50%, -50%) scale(0.1)';
                steam.style.transition = 'all 1.5s ease-out';
                steam.style.zIndex = '999';
                
                steamIcon.appendChild(steam);
                
                setTimeout(() => {
                    steam.style.transform = `translate(${(Math.random() - 0.5) * 100}px, ${-50 - Math.random() * 100}px) scale(${2 + Math.random() * 3})`;
                    steam.style.opacity = '0';
                }, 10);
                
                setTimeout(() => steam.remove(), 1500);
            }
        }

        steamIcon.addEventListener('click', (e) => {
            if (window.isMeltdown) return;
            window.overheatClicks++;
            
            blowSteam(window.overheatClicks * 2);
            
            if (window.overheatClicks > 7) {
                window.isMeltdown = true;
                window.unlockAchievement('meltdown', 'Achievement Unlocked', 'Core Meltdown (Overheated the site)', 'fas fa-fire');
                
                // Start blowing permanent steam
                setInterval(() => {
                    blowSteam(3);
                }, 200);
            }
        });
    }
});
