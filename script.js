// Scroll-based background brightening effect (starts light, subtle shift on scroll)
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const percent = Math.min(scrollY / maxScroll, 1);
    // Interpolate between very light and medium blue
    const start = [200, 230, 245]; // lighter blue
    const end = [169, 214, 229]; // #a9d6e5
    const lerp = (a, b, t) => Math.round(a + (b - a) * t);
    const r = lerp(start[0], end[0], percent);
    const g = lerp(start[1], end[1], percent);
    const b = lerp(start[2], end[2], percent);
    document.body.style.background = `linear-gradient(135deg, rgb(${r},${g},${b}) 0%, #2fa4d9 40%, #38a3a5 80%, #a9d6e5 100%)`;
});
const members = [
    {
        name: "Haru Hayazame",
        img: "assets/talent-cover/Haru.png",
        desc: "Naval Admiral of the group, an albino merfolk who has a soft voice.",
        streams: "https://kick.com/harurequinvt",
        site: "https://hayazame-haru.github.io/talent-info/",
        status: "Pre-Debut"
        , tag: "NSFW"
    },
    {
        name: "Aoi Hayazame",
        img: "assets/talent-cover/Aoi.png",
        desc: "Captain Pilot of the group! Loves to drink beers and alcohol! Haru's twin sibling.",
        streams: "#",
        site: "#",
        status: "Coming Soon"
        , tag: "Unrated"
    },
    {
        name: "Andras Daray",
        img: "assets/talent-cover/Andras.png",
        desc: "The Tank & Magic specialist of the group, somehow he found a way to incorporate the dark arts into weaponries.",
        streams: "#",
        site: "#",
        status: "Coming Soon"
        , tag: "Unrated"
    },
    {
        name: "Lumi Rosemary",
        img: "assets/talent-cover/Lumi.png",
        desc: "The head of the Medical branch, a sweet nurse who is somewhat also sort of insane.",
        streams: "#",
        site: "#",
        status: "Coming Soon"
        , tag: "Unrated"
    },
    {
        name: "Coming soon member",
        img: "assets/talent-cover/coming-soon.png",
        desc: "",
        streams: "#",
        site: "#",
        status: "Coming Soon"
        , tag: "Unrated"
    }
];

function createMemberCard(member, idx) {
    const card = document.createElement('div');
    card.className = 'member-card';
    // expose a CSS variable for staggered delay
    card.style.setProperty('--delay', `${idx * 0.12}s`);

    const img = document.createElement('img');
    img.className = 'member-img';
    img.src = member.img;
    img.alt = member.name;
    // Debug: report load/error for images to help diagnose missing assets
    img.addEventListener('load', () => {
        try { console.info('member image loaded:', img.src); } catch (e) {}
        img.dataset.loaded = '1';
    });
    img.addEventListener('error', () => {
        try { console.error('member image FAILED to load:', img.src); } catch (e) {}
        img.dataset.loaded = '0';
        img.classList.add('img-error');
        // show a small inline error indicator on the card
        try {
            const err = document.createElement('div');
            err.className = 'member-img-error';
            err.textContent = 'Image not found';
            // insert after the image
            img.insertAdjacentElement('afterend', err);
        } catch (e) {}
    });
    card.appendChild(img);

    // Status badge
    if (member.status) {
        const statusEl = document.createElement('div');
        statusEl.className = 'member-status';
        statusEl.textContent = member.status;
        card.appendChild(statusEl);
    }

    // Content tag (NSFW / Semi-NSFW / SFW / Unrated)
    const tagValue = member.tag || member.contentTag || 'Unrated';
    if (tagValue) {
        const tagEl = document.createElement('div');
        tagEl.className = 'member-tag';
        tagEl.textContent = tagValue;
        // add modifier class for styling
        tagEl.classList.add('member-tag-' + tagValue.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
        card.appendChild(tagEl);
    }

    // Name below image
    const name = document.createElement('div');
    name.className = 'member-name';
    name.textContent = member.name;
    card.appendChild(name);

    // Description below name
    const desc = document.createElement('div');
    desc.className = 'member-desc';
    desc.textContent = member.desc;
    card.appendChild(desc);

    // Links below description
    const links = document.createElement('div');
    links.className = 'member-links';

    // Determine whether links should be active: treat 'Debuted' and 'Pre-Debut' as active
    const statusTag = (member.status || '').toString().toLowerCase();
    const activeStatuses = ['debuted', 'pre-debut', 'pre-debut', 'pre debut', 'active'];
    const isFullyDebuted = activeStatuses.includes(statusTag);

    const streamsBtn = document.createElement(isFullyDebuted ? 'a' : 'div');
    streamsBtn.className = 'member-link';
    if (isFullyDebuted) {
        streamsBtn.href = member.streams;
        streamsBtn.target = '_blank';
        streamsBtn.rel = 'noopener noreferrer';
        streamsBtn.textContent = 'Streams';
    } else {
        streamsBtn.textContent = 'Streams: Coming Soon';
        streamsBtn.style.opacity = '0.6';
        streamsBtn.style.pointerEvents = 'none';
    }
    links.appendChild(streamsBtn);

    const siteBtn = document.createElement(isFullyDebuted ? 'a' : 'div');
    siteBtn.className = 'member-link';
    if (isFullyDebuted) {
        siteBtn.href = member.site;
        siteBtn.target = '_blank';
        siteBtn.rel = 'noopener noreferrer';
        siteBtn.textContent = 'Official Talent Site';
    } else {
        siteBtn.textContent = 'Official Talent Site: Coming Soon';
        siteBtn.style.opacity = '0.6';
        siteBtn.style.pointerEvents = 'none';
    }
    links.appendChild(siteBtn);

    card.appendChild(links);

    return card;
}

document.addEventListener('DOMContentLoaded', () => {
    // Render members
    const membersSection = document.getElementById('members');
    members.forEach((member, idx) => {
        const card = createMemberCard(member, idx);
        membersSection.appendChild(card);
    });

    // Start periodic replay every 30 seconds (after cards are rendered)
    setInterval(replayReveals, 30000);

    // Bubbles background
    const bubbleBg = document.querySelector('.bubble-bg');
    function randomBetween(a, b) {
        return Math.random() * (b - a) + a;
    }
    function createBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        const size = randomBetween(18, 60);
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${randomBetween(0, 100)}vw`;
        bubble.style.animationDuration = `${randomBetween(8, 16)}s`;
        bubble.style.opacity = randomBetween(0.18, 0.38);
        bubbleBg.appendChild(bubble);
        setTimeout(() => bubble.remove(), 16000);
    }
    // Generate bubbles at intervals
    setInterval(() => {
        for (let i = 0; i < 3; i++) createBubble();
    }, 1200);
    // Initial bubbles
    for (let i = 0; i < 12; i++) createBubble();

    // --- SFX system (WebAudio) ---
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    let sfxEnabled = (localStorage.getItem('sfxEnabled') !== 'false');
    // track whether the user has unlocked audio via gesture
    let audioUnlocked = false;

    // Try to use asset audio files if present; fall back to synthesized bubbles
    let useFileSfx = false;
    let hoverAudio = null;
    let clickAudio = null;
    try {
        // Attempt to create audio elements for quick playback
        hoverAudio = new Audio('assets/hover.mp3');
        hoverAudio.preload = 'auto';
        clickAudio = new Audio('assets/click.mp3');
        clickAudio.preload = 'auto';
        useFileSfx = true;
    } catch (e) {
        useFileSfx = false;
    }

    // --- Ambient underwater loop (synthesized) ---
    let ambientGain = audioCtx.createGain();
    ambientGain.gain.value = 0.0; // start silent until we decide
    ambientGain.connect(audioCtx.destination);

    function createAmbientLoop() {
        const sampleRate = audioCtx.sampleRate;
        const length = sampleRate * 6; // 6s buffer
        const buffer = audioCtx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        // create slow, low-frequency noise texture
        for (let i = 0; i < length; i++) {
            // smooth random noise (interpolated) for texture
            const v = (Math.random() * 2 - 1) * 0.5;
            data[i] = v * Math.exp(-i / (length * 1.2));
        }

        const src = audioCtx.createBufferSource();
        src.buffer = buffer;
        src.loop = true;

        // lowpass and gentle band to make it watery
        const lp = audioCtx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 900;
        lp.Q.value = 0.8;

        const bp = audioCtx.createBiquadFilter();
        bp.type = 'peaking';
        bp.frequency.value = 400;
        bp.gain.value = 2;

        src.connect(lp);
        lp.connect(bp);
        bp.connect(ambientGain);

        // gentle LFO to move the filter for life
        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();
        lfo.type = 'sine';
        lfo.frequency.value = 0.06; // slow
        lfoGain.gain.value = 180; // modulation depth
        lfo.connect(lfoGain);
        lfoGain.connect(lp.frequency);

        // start nodes
        try {
            src.start();
            lfo.start();
        } catch (err) {
            // might throw if context not running; we'll resume later
        }

        return { src, lfo, ambientGain };
    }

    const ambient = createAmbientLoop();
    // target ambient volume (user-adjustable later)
    const AMBIENT_VOLUME = 0.035;

    // Attempt to autoplay ambient (best-effort). Browsers may block until a gesture.
    if (sfxEnabled) {
        // try to resume and set volume
        audioCtx.resume().then(() => {
            try { ambientGain.gain.setValueAtTime(AMBIENT_VOLUME, audioCtx.currentTime); } catch(e) {}
        }).catch(() => {
            // will remain silent until user interacts
        });
    }

    // If Howler is available, try to load a background music file (fallbacks)
    let bgm = null;
    const bgCandidates = ['assets/music/BG.mp3', 'assets/ambient.mp3', 'assets/BG.mp3', 'assets/ambient.mp3'];
    function tryLoadBgm(list, i = 0) {
        if (typeof Howl === 'undefined') return;
        if (i >= list.length) return;
        const src = list[i];
        const h = new Howl({ src: [src], loop: true, volume: 0, preload: true,
            onload: () => {
                // stop synthesized ambient and use file-based bgm
                try { ambient.src && ambient.src.stop(); } catch(e) {}
                try { ambient.lfo && ambient.lfo.stop(); } catch(e) {}
                try { ambientGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.05); } catch(e) {}
                bgm = h;
                // play and fade in
                try { bgm.play(); bgm.fade(0, AMBIENT_VOLUME, 3500); } catch(e) {}
            },
            onloaderror: () => {
                // try next
                tryLoadBgm(list, i + 1);
            }
        });
    }
    tryLoadBgm(bgCandidates, 0);

    // Create a short noise buffer for bubble pops
    function createNoiseBuffer() {
        const sampleRate = audioCtx.sampleRate;
        const length = Math.floor(sampleRate * 1.0);
        const buffer = audioCtx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) {
            // noise with slight envelope (decay)
            const t = i / length;
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 3);
        }
        return buffer;
    }

    // Bubble pop sound: combine noise burst + short pitch slide oscillator
    function playBubblePop({ volume = 0.12, duration = 0.35 } = {}) {
        if (!sfxEnabled) return;
        if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
        const now = audioCtx.currentTime;

        // Noise burst
        const noiseSrc = audioCtx.createBufferSource();
        noiseSrc.buffer = createNoiseBuffer();
        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(volume * 0.9, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        const hp = audioCtx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.setValueAtTime(400, now);

        // Slight band emphasis to make pop
        const bp = audioCtx.createBiquadFilter();
        bp.type = 'peaking';
        bp.frequency.setValueAtTime(1200, now);
        bp.gain.setValueAtTime(6, now);

        noiseSrc.connect(hp);
        hp.connect(bp);
        bp.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);

        noiseSrc.start(now);
        noiseSrc.stop(now + duration + 0.02);

        // Tonal slide (small click / bubble)
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + duration * 0.9);
        oscGain.gain.setValueAtTime(volume * 0.25, now);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        // lowpass to soften
        const lp = audioCtx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(2500, now);

        osc.connect(lp);
        lp.connect(oscGain);
        oscGain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + duration + 0.02);
    }

    // Softer bubble for hover
    function playBubbleHover({ volume = 0.06, duration = 0.18 } = {}) {
        if (!sfxEnabled) return;
        if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
        const now = audioCtx.currentTime;

        const noiseSrc = audioCtx.createBufferSource();
        noiseSrc.buffer = createNoiseBuffer();
        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(volume, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        const bp = audioCtx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.setValueAtTime(1100, now);
        bp.Q.setValueAtTime(1.2, now);

        noiseSrc.connect(bp);
        bp.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);

        noiseSrc.start(now);
        noiseSrc.stop(now + duration + 0.02);
    }

    // Wrapper: prefer file-based SFX, otherwise use synthesized bubble sounds
    function playHover() {
        if (!sfxEnabled) return;
        // Prefer inline audio element if present (added in index.html)
        const hoverEl = document.getElementById('hoverSound');
        if (hoverEl) {
            try {
                hoverEl.currentTime = 0;
                hoverEl.volume = 0.65;
                hoverEl.play().catch(() => { audioCtx.resume().catch(() => {}); });
                return;
            } catch (e) {
                // fall through
            }
        }
        if (useFileSfx && hoverAudio) {
            try {
                const a = hoverAudio.cloneNode();
                a.volume = 0.65;
                a.play().catch(() => { audioCtx.resume().catch(() => {}); });
                return;
            } catch (e) {}
        }
        playBubbleHover();
    }

    function playClick() {
        if (!sfxEnabled) return;
        const clickEl = document.getElementById('clickSound');
        if (clickEl) {
            try {
                clickEl.currentTime = 0;
                clickEl.volume = 0.9;
                clickEl.play().catch(() => { audioCtx.resume().catch(() => {}); });
                return;
            } catch (e) {}
        }
        if (useFileSfx && clickAudio) {
            try {
                const a = clickAudio.cloneNode();
                a.volume = 0.9;
                a.play().catch(() => { audioCtx.resume().catch(() => {}); });
                return;
            } catch (e) {}
        }
        playBubblePop();
    }

    // Attach listeners to all dynamically created member links
    function attachSfxToLinks() {
        document.querySelectorAll('.member-link').forEach(link => {
            // avoid duplicating listeners
            if (link._sfxAttached) return;
            link.addEventListener('mouseenter', () => playHover());
            link.addEventListener('click', (e) => { playClick(); });
            link._sfxAttached = true;
        });
    }

    // Attach on load and after any dynamic changes
    attachSfxToLinks();

    // Also attach to common interactive elements (buttons, anchors)
    function attachGlobalSfx() {
        // Prefer simple inline-audio approach: attach to triggers, buttons, socials and member links
        const selectorList = ['.trigger', 'button', '.socials a', '.member-link'];
        const nodes = document.querySelectorAll(selectorList.join(','));
        const hoverEl = document.getElementById('hoverSound');
        const clickEl = document.getElementById('clickSound');
        // set default volumes if elements exist
        try { if (hoverEl) hoverEl.volume = 0.18; } catch (e) {}
        try { if (clickEl) clickEl.volume = 0.18; } catch (e) {}

        nodes.forEach(el => {
            if (el._globalSfx) return;
            el.addEventListener('mouseenter', () => {
                // Try inline audio first; fall back to existing handlers
                if (hoverEl) {
                    try { hoverEl.currentTime = 0; hoverEl.play().catch(() => {}); return; } catch (e) {}
                }
                tryPlayHoverElement();
            });
            el.addEventListener('click', () => {
                if (clickEl) {
                    try { clickEl.currentTime = 0; clickEl.play().catch(() => {}); return; } catch (e) {}
                }
                tryPlayClickElement();
            });
            el._globalSfx = true;
        });
    }

    function tryPlayHoverElement() {
        if (!sfxEnabled) return;
        const hoverEl = document.getElementById('hoverSound');
        if (hoverEl) {
            try {
                hoverEl.currentTime = 0;
                hoverEl.play().catch(() => { showEnableAudioPrompt(); });
                return;
            } catch (e) {}
        }
        playHover();
    }

    function tryPlayHoverElement(suppressPrompt = false) {
        if (!sfxEnabled) return;
        const hoverEl = document.getElementById('hoverSound');
        if (hoverEl) {
            try {
                hoverEl.currentTime = 0;
                hoverEl.play().catch(() => { if (!suppressPrompt) showEnableAudioPrompt(); });
                return;
            } catch (e) {}
        }
        playHover();
    }

    function tryPlayClickElement(suppressPrompt = false) {
        if (!sfxEnabled) return;
        const clickEl = document.getElementById('clickSound');
        if (clickEl) {
            try {
                clickEl.currentTime = 0;
                clickEl.play().catch(() => { if (!suppressPrompt) showEnableAudioPrompt(); });
                return;
            } catch (e) {}
        }
        playClick();
    }
    function unlockAudioOnGesture() {
        if (audioUnlocked) return;
        audioUnlocked = true;
        // resume AudioContext
        audioCtx.resume().then(() => {
            // If Howler BGM exists, try to play and fade in
            if (bgm) {
                try { bgm.play(); bgm.fade(0, AMBIENT_VOLUME, 2000); } catch (e) {}
            } else {
                // Otherwise raise synthesized ambient slightly
                try { if (sfxEnabled) ambientGain.gain.setTargetAtTime(AMBIENT_VOLUME, audioCtx.currentTime, 0.05); } catch (e) {}
            }
            // Play a tiny click to confirm audio unlocked (will use inline clickSound if present)
            tryPlayClickElement();
        }).catch(() => {});
    }
    document.addEventListener('pointerdown', unlockAudioOnGesture, { once: true, capture: true });
    document.addEventListener('keydown', unlockAudioOnGesture, { once: true, capture: true });

    // Small UI prompt to ask the user to enable audio when blocked by browser
    let audioEnablePromptShown = false;
    function showEnableAudioPrompt() {
        if (audioEnablePromptShown) return;
        audioEnablePromptShown = true;
        const btn = document.createElement('button');
        btn.id = 'enable-audio-prompt';
        btn.textContent = 'Enable sound';
        btn.title = 'Click to enable site audio';
        // minimal inline styles to ensure visibility without editing CSS
        btn.style.position = 'fixed';
        btn.style.right = '14px';
        btn.style.bottom = '18px';
        btn.style.zIndex = '99999';
        btn.style.background = 'linear-gradient(180deg,#2fa4d9,#1b6f9a)';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.padding = '10px 14px';
        btn.style.borderRadius = '10px';
        btn.style.boxShadow = '0 6px 18px rgba(2,27,45,0.35)';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = '600';
        btn.style.fontFamily = 'inherit';
        document.body.appendChild(btn);
        const removePrompt = () => { try { btn.remove(); } catch (e) {} };
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            unlockAudioOnGesture();
            // small visual feedback
            tryPlayClickElement();
            setTimeout(removePrompt, 450);
        });
        // also remove automatically after a while
        setTimeout(removePrompt, 15000);
    }

    // --- Scroll reveal observer for member cards ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    // Observe all current member cards
    document.querySelectorAll('.member-card').forEach(card => revealObserver.observe(card));

    // Replay reveal animations in a loop every 60s (reapplies the `.reveal` class)
    function replayReveals() {
        const cards = Array.from(document.querySelectorAll('.member-card'));
        if (!cards.length) return;
        // Debug log
        try { console.debug && console.debug('replayReveals: restarting', cards.length, 'cards'); } catch (e) {}
        // Remove class from all cards
        cards.forEach(c => c.classList.remove('reveal'));
        // Force a reflow to ensure CSS animations can restart
        // then re-add the class with a stagger
        // Use requestAnimationFrame to allow DOM updates to settle
        requestAnimationFrame(() => {
            // extra small tick
            setTimeout(() => {
                cards.forEach((c, i) => {
                    // ensure any inline animation style is cleared
                    c.style.animation = 'none';
                    // force reflow
                    void c.offsetWidth;
                    // remove the inline animation override
                    c.style.animation = '';
                    setTimeout(() => c.classList.add('reveal'), i * 120);
                });
            }, 40);
        });
    }

    // Best-effort autoplay attempt on load: try to play a short SFX and start bgm/ambient
    function attemptAutoplayOnLoad() {
        // If the age modal is present and open, do not autoplay yet — wait for user to accept
        const ageModalEl = document.getElementById('age-modal');
        if (ageModalEl) {
            // If it's still in the DOM, assume user hasn't accepted yet
            return;
        }
        // Try to play click sound (suppress prompt if blocked)
        tryPlayClickElement(true);
        // Try to play hover sound (muted attempt)
        tryPlayHoverElement(true);

        // Try to start Howler BGM if available
        if (bgm) {
            try {
                bgm.play();
                // start silent then fade to ambient volume (may be blocked)
                bgm.volume(0);
                bgm.fade(0, AMBIENT_VOLUME, 1000);
            } catch (e) {
                // ignore; browser likely blocked autoplay
            }
        } else {
            // Try to set the ambient gain if allowed
            try {
                if (sfxEnabled) ambientGain.gain.setTargetAtTime(AMBIENT_VOLUME, audioCtx.currentTime, 0.05);
            } catch (e) {
                // ignore; will be resumed on gesture
            }
        }
    }

    // If an age modal exists, wire its accept button to unlock audio and remove modal
    const ageModal = document.getElementById('age-modal');
    if (ageModal) {
        // prevent background scroll while modal is shown
        document.body.style.overflow = 'hidden';
        const acceptBtn = document.getElementById('age-accept-btn');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', (e) => {
                e.preventDefault();
                try { ageModal.remove(); } catch (err) {}
                document.body.style.overflow = '';
                // Unlock audio and play confirmation
                unlockAudioOnGesture();
            });
        }
    } else {
        // Run autoplay attempt shortly after load if no modal blocks it
        setTimeout(attemptAutoplayOnLoad, 250);
    }

    // Global sound toggle (controls both ambient and SFX)
    const sfxToggle = document.getElementById('sfx-toggle');
    function updateToggleUI() {
        if (!sfxToggle) return;
        sfxToggle.setAttribute('aria-pressed', sfxEnabled ? 'true' : 'false');
        sfxToggle.textContent = sfxEnabled ? '🔊' : '🔇';
    }
    if (sfxToggle) {
        updateToggleUI();
        sfxToggle.addEventListener('click', () => {
            sfxEnabled = !sfxEnabled;
            localStorage.setItem('sfxEnabled', sfxEnabled);
            if (sfxEnabled) {
                // If we have Howler bgm, fade it in; otherwise resume context and set ambient
                if (bgm) {
                    try { bgm.play(); bgm.fade(0, AMBIENT_VOLUME, 3500); } catch(e) {}
                } else {
                    audioCtx.resume().then(() => {
                        try { ambientGain.gain.setTargetAtTime(AMBIENT_VOLUME, audioCtx.currentTime, 0.1); } catch(e) {}
                    }).catch(() => {});
                }
            } else {
                // quickly fade out ambient or Howler bgm
                if (bgm) {
                    try {
                        const cur = bgm.volume() || AMBIENT_VOLUME;
                        bgm.fade(cur, 0, 250);
                        setTimeout(() => { try { bgm.pause(); } catch(e) {} }, 300);
                    } catch(e) {}
                } else {
                    try { ambientGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.05); } catch(e) {}
                }
            }
            updateToggleUI();
        });
    }
});
