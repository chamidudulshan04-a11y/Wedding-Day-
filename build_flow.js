const fs = require('fs');
const path = require('path');

const indexPath = path.join('c:/Users/Jhon/Downloads/saveweb2zip-com-invitation-lk (1)', 'index.html');
const backupPath = indexPath + '.backup';

let html = fs.readFileSync(backupPath, 'utf-8');

// The original body match
const bodyRegex = /<body([^>]*)>([\s\S]*?)<\/body>/i;
const bodyMatch = html.match(bodyRegex);
let originalBodyAttrs = bodyMatch[1];
let originalBodyContent = bodyMatch[2];

// 1. Fix opacity:0 and transform in the original content so it's visible when revealed
originalBodyContent = originalBodyContent.replace(/opacity:0;/g, 'opacity:1;');
originalBodyContent = originalBodyContent.replace(/opacity:\s*0(?!\.)/g, 'opacity:1'); 
originalBodyContent = originalBodyContent.replace(/transform:[^"']*/g, 'transform:none');

// 2. Remove the original site's broken envelope loading screen
originalBodyContent = originalBodyContent.replace(/<div class="fixed inset-0 z-\[60\][\s\S]*?<\/button><\/div>/i, '');

// 3. Fix broken fonts in the original body content
originalBodyContent = originalBodyContent.replace(/var\(--font-serif\)[^;]*/g, "'Playfair Display', Georgia, serif");
originalBodyContent = originalBodyContent.replace(/var\(--font-sn-display\)[^;]*/g, "'Great Vibes', cursive");
originalBodyContent = originalBodyContent.replace(/var\(--font-lm-sinhala\)[^;]*/g, "'Abhaya Libre', serif");
originalBodyContent = originalBodyContent.replace(/var\(--font-mp-body\)[^;]*/g, "'EB Garamond', Georgia, serif");
originalBodyContent = originalBodyContent.replace(/font-family:[^;]*playfair display[^;]*/gi, "font-family: 'Playfair Display', Georgia, serif");
originalBodyContent = originalBodyContent.replace(/font-family:[^;]*great vibes[^;]*/gi, "font-family: 'Great Vibes', cursive");
originalBodyContent = originalBodyContent.replace(/font-family:[^;]*abhaya libre[^;]*/gi, "font-family: 'Abhaya Libre', serif");
originalBodyContent = originalBodyContent.replace(/font-family:[^;]*eb garamond[^;]*/gi, "font-family: 'EB Garamond', Georgia, serif");

// Add Google Fonts link to head just in case
const googleFonts = `<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Great+Vibes&family=Abhaya+Libre:wght@400;500;600&family=EB+Garamond:wght@400;500;600&display=swap" rel="stylesheet">\n`;
if (!html.includes('fonts.googleapis.com')) {
    html = html.replace('</head>', googleFonts + '</head>');
}

// 4. Remove the broken original hamburger menu completely (fixed regex!)
originalBodyContent = originalBodyContent.replace(/<div class="fixed bottom-5 left-5 z-40[^>]*>[\s\S]*?<\/button><\/div>/i, '');

// 4.1 Fix corrupted inline styles from saveweb2zip (which broke the RSVP borders)
originalBodyContent = originalBodyContent.replace(/1px="" solid=""/g, '1px solid');
originalBodyContent = originalBodyContent.replace(/rgba\(([^)]*)\)/g, (match) => match.replace(/=""/g, ''));

// 4.5. Update text details (Names, Date, Hotel) and emblem image
originalBodyContent = originalBodyContent.replace(/>Nipuni</g, '>Nirasha<');
originalBodyContent = originalBodyContent.replace(/>Imash</g, '>Lasitha<');
originalBodyContent = originalBodyContent.replace(/21<sup class="text-\[0\.62em\]">st<\/sup>/g, '02<sup class="text-[0.62em]">nd</sup>');
originalBodyContent = originalBodyContent.replace(/21st November/g, '02nd November');
originalBodyContent = originalBodyContent.replace(/21 November/g, '02 November');
originalBodyContent = originalBodyContent.replace(/21 \. 11 \. 26/g, '02 . 11 . 26');
originalBodyContent = originalBodyContent.replace(/1st November 2026/g, '20th November 2026');
originalBodyContent = originalBodyContent.replace(/aria-label="Scroll down" class="/i, 'aria-label="Scroll down" class="floating-bob ');
originalBodyContent = originalBodyContent.replace(/<p[^>]*>Created with[\s\S]*?INVITATION\.LK<\/a><\/p>/i, '');
originalBodyContent = originalBodyContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ''); // Remove all original scripts (React/Next.js hydration) to fix IDE syntax errors
originalBodyContent = originalBodyContent.replace(/ITC Ratnadipa/gi, 'Grand Royal Pinnalanda');
originalBodyContent = originalBodyContent.replace(/21 Galle Face Centre Road, Colombo 00100, Sri Lanka/g, 'Pinnawala, Sri Lanka');
originalBodyContent = originalBodyContent.replace(/q=ITC%20Ratnadipa[^&"]*/gi, 'q=Grand%20Royal%20Pinnalanda');
originalBodyContent = originalBodyContent.replace(/query=ITC%20Ratnadipa[^&"]*/gi, 'query=Grand%20Royal%20Pinnalanda');
originalBodyContent = originalBodyContent.replace(/Colombo/gi, 'Pinnawala');
originalBodyContent = originalBodyContent.replace(/5:00 PM/g, '10.03 A.M');
originalBodyContent = originalBodyContent.replace(/6:30 PM/g, '9.00 A.M');
originalBodyContent = originalBodyContent.replace(/images\/emblem\.webp/gi, 'images/emblem.png');

// 5. The Overlays (Envelope + Card + Custom Menu)
const overlayHtml = `
<style>@keyframes floatEnvelope { 0% { transform: translateY(0px); } 50% { transform: translateY(-12px); } 100% { transform: translateY(0px); } } .floating-envelope-wrapper { animation: floatEnvelope 4s ease-in-out infinite; margin-bottom: 45px; }    .floating-bob { animation: floatEnvelope 4s ease-in-out infinite; }
</style>
<!-- FULL SCREEN OVERLAY CONTAINER -->
<div id="intro-sequence-container" style="position:fixed; top:0; left:0; width:100%; height:100%; z-index:999999; background-color: #F9F3EC; background-image: url('images/silk-web.webp'); background-size: cover; background-position: center;">
    <!-- ENVELOPE OVERLAY -->
    <div id="envelope-overlay" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:10; display:flex; flex-direction:column; justify-content:center; align-items:center; transition: opacity 1s ease, transform 1s ease; cursor:pointer;">
        <div style="text-align:center; color: #946123; display: flex; flex-direction: column; align-items: center;">
            <div style="width: 5px; height: 5px; background: #946123; transform: rotate(45deg); margin-bottom: 25px;"></div>
            <p style="font-family: 'EB Garamond', Georgia, serif; font-size: 11px; font-weight: 600; letter-spacing: 0.4em; text-transform: uppercase; margin: 0 0 15px 0;">The Wedding Of</p>
            <h1 style="font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-size: 55px; letter-spacing: 0.02em; margin: 0 0 25px 0; font-weight: 500;">Nirasha & Lasitha</h1>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#946123" stroke="#946123" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 20px;"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path></svg>
            <p style="font-family: 'Great Vibes', cursive, serif; font-size: 28px; line-height: 1.3; margin: 0 0 50px 0; color: #946123;">We invite you to celebrate<br>our special day</p>
            <div class="floating-envelope-wrapper"><img src="images/envelope-closed.webp" alt="Envelope" style="max-width: 90%; width: 420px; filter: drop-shadow(0 15px 30px rgba(0,0,0,0.1)); transition: transform 0.3s ease; margin: 0 auto; display: block;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'"/></div>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="#946123" stroke="#946123" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 15px;"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path></svg>
            <p style="font-family: 'EB Garamond', Georgia, serif; color: #946123; letter-spacing: 0.25em; font-size: 11px; text-transform: uppercase; margin: 0 0 10px 0; font-weight: bold;">Tap the envelope</p>
            <p style="font-family: 'EB Garamond', Georgia, serif; color: #946123; letter-spacing: 0.2em; font-size: 9px; text-transform: uppercase; margin: 0; opacity: 0.7;">To open your invitation</p>
        </div>
    </div>
    <!-- 3D FOLDING CARD CONTAINER -->
    <div id="card-wrapper" class="floating-bob" style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; justify-content:center; align-items:center; perspective: 1800px; opacity:0; pointer-events:none; transition: opacity 1s ease;">
        <div id="folding-card" style="width: 330px; position: relative; transform-style: preserve-3d; transform: scale(0.6) translateY(50px); transition: transform 2s cubic-bezier(0.4, 0, 0.2, 1);">
            <div class="panel-middle" style="width: 100%; height: 260px; background: #FCF8F0; position: relative; z-index: 2; box-shadow: 0 15px 40px rgba(0,0,0,0.2);">
                <img src="images/middle.png" style="width: 100%; height: 100%; object-fit: cover; display: block;" alt="Middle Content" />
            </div>
            <div id="panel-top" style="width: 100%; height: 230px; position: absolute; top: -230px; left: 0; transform-origin: bottom; transform: rotateX(-179deg); transition: transform 1.5s cubic-bezier(0.4, 0, 0.2, 1); transform-style: preserve-3d; z-index: 3;">
                <div style="position: absolute; width:100%; height:100%; background: #FCF8F0; backface-visibility: hidden;">
                    <img src="images/top.png" style="width: 100%; height: 100%; object-fit: cover; display: block;" alt="Top Content" />
                </div>
                <div style="position: absolute; width:100%; height:100%; background: #fdfaf6; box-sizing: border-box; backface-visibility: hidden; transform: rotateX(180deg); box-shadow: inset 0 -10px 20px rgba(0,0,0,0.05);"></div>
            </div>
            <div id="panel-bottom" style="width: 100%; height: 260px; position: absolute; bottom: -260px; left: 0; transform-origin: top; transform: rotateX(179deg); transition: transform 1.5s cubic-bezier(0.4, 0, 0.2, 1); transition-delay: 0.4s; transform-style: preserve-3d; z-index: 4;">
                <div style="position: absolute; width:100%; height:100%; background: #FCF8F0; backface-visibility: hidden;">
                    <img src="images/bottom.png" style="width: 100%; height: 100%; object-fit: cover; display: block;" alt="Bottom Content" />
                </div>
                <div style="position: absolute; width:100%; height:100%; background: #fdfaf6; box-sizing: border-box; backface-visibility: hidden; transform: rotateX(180deg); box-shadow: 0 -5px 15px rgba(0,0,0,0.1);"></div>
            </div>
        </div>
    </div>
</div>

<!-- CUSTOM HAMBURGER MENU -->
<div id="custom-menu-container" style="position: fixed; bottom: 1.25rem; left: 1.25rem; z-index: 100000; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; pointer-events: none;">
    <div id="custom-menu-list" style="display: flex; flex-direction: column; gap: 10px; opacity: 0; transform: translateY(20px); transition: all 0.3s ease; pointer-events: none;">
        
        <a href="#hero" class="custom-menu-item" style="pointer-events: auto; display: flex; align-items: center; gap: 12px; background: #FCF8F0; border: 1px solid #D6B77A; border-radius: 9999px; padding: 6px 20px 6px 6px; text-decoration: none; box-shadow: 0 4px 10px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.2s;">
            <div style="background: #7A4E1C; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBF4E4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <span style="font-family: 'EB Garamond', Georgia, serif; color: #7A4E1C; font-weight: 700; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;">HOME</span>
        </a>
        
        <a href="#story" class="custom-menu-item" style="pointer-events: auto; display: flex; align-items: center; gap: 12px; background: #FCF8F0; border: 1px solid #D6B77A; border-radius: 9999px; padding: 6px 20px 6px 6px; text-decoration: none; box-shadow: 0 4px 10px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.2s;">
            <div style="background: #7A4E1C; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBF4E4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M4 12H1"/><path d="M23 12h-3"/><path d="M19 19l-2-2"/><path d="M7 7 5 5"/><path d="M19 5l-2 2"/><path d="M7 19l-2 2"/></svg>
            </div>
            <span style="font-family: 'EB Garamond', Georgia, serif; color: #7A4E1C; font-weight: 700; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;">DETAILS</span>
        </a>
        
        <a href="#venue" class="custom-menu-item" style="pointer-events: auto; display: flex; align-items: center; gap: 12px; background: #FCF8F0; border: 1px solid #D6B77A; border-radius: 9999px; padding: 6px 20px 6px 6px; text-decoration: none; box-shadow: 0 4px 10px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.2s;">
            <div style="background: #7A4E1C; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBF4E4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <span style="font-family: 'EB Garamond', Georgia, serif; color: #7A4E1C; font-weight: 700; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;">VENUE</span>
        </a>

        <a href="#events" class="custom-menu-item" style="pointer-events: auto; display: flex; align-items: center; gap: 12px; background: #FCF8F0; border: 1px solid #D6B77A; border-radius: 9999px; padding: 6px 20px 6px 6px; text-decoration: none; box-shadow: 0 4px 10px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.2s;">
            <div style="background: #7A4E1C; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBF4E4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            </div>
            <span style="font-family: 'EB Garamond', Georgia, serif; color: #7A4E1C; font-weight: 700; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;">EVENTS</span>
        </a>

        <a href="#rsvp" class="custom-menu-item" style="pointer-events: auto; display: flex; align-items: center; gap: 12px; background: #FCF8F0; border: 1px solid #D6B77A; border-radius: 9999px; padding: 6px 20px 6px 6px; text-decoration: none; box-shadow: 0 4px 10px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.2s;">
            <div style="background: #7A4E1C; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBF4E4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <span style="font-family: 'EB Garamond', Georgia, serif; color: #7A4E1C; font-weight: 700; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;">RSVP</span>
        </a>
    </div>

    <button id="custom-menu-toggle" style="pointer-events: auto; background: linear-gradient(135deg, #946123, #7A4E1C); border: 1px solid rgba(122, 78, 28, 0.5); width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 14px 28px -14px rgba(110,77,28,0.65); transition: transform 0.2s; margin-top: 5px;">
        <svg id="icon-hamburger" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FBF4E4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>
        <svg id="icon-close" style="display: none;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FBF4E4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        // Original intro animation script
        document.body.style.overflow = 'hidden';
        window.scrollTo({ top: 0, behavior: 'instant' });

        document.getElementById('envelope-overlay').addEventListener('click', function() {
            this.style.opacity = '0';
            this.style.transform = 'scale(1.1)';
            this.style.pointerEvents = 'none';
            
            // Auto-play music on envelope open
            if (typeof window.toggleAudio === 'function') {
                window.toggleAudio(true);
            }
            
            const wrapper = document.getElementById('card-wrapper');
            wrapper.style.opacity = '1';

            setTimeout(() => {
                const cardHeight = 750;
                const targetScale = Math.min(0.95, (window.innerHeight * 0.95) / cardHeight);
                document.getElementById('folding-card').style.transform = \`scale(\${targetScale}) translateY(0)\`;
                
                setTimeout(() => { document.getElementById('panel-top').style.transform = 'rotateX(0deg)'; }, 300);
                setTimeout(() => { document.getElementById('panel-bottom').style.transform = 'rotateX(0deg)'; }, 800);

                setTimeout(() => {
                    const introContainer = document.getElementById('intro-sequence-container');
                    introContainer.style.transition = 'opacity 1.5s ease';
                    introContainer.style.opacity = '0';
                    introContainer.style.pointerEvents = 'none';
                    document.body.style.overflow = 'auto';
                    
                    setTimeout(() => { introContainer.style.display = 'none'; }, 1500);
                }, 5000);

            }, 500);
            setTimeout(() => { this.style.display = 'none'; }, 1000);
        });

        window.addEventListener('resize', () => {
            const cardHeight = 750;
            const targetScale = Math.min(0.95, (window.innerHeight * 0.95) / cardHeight);
            if(document.getElementById('folding-card')) {
                document.getElementById('folding-card').style.transform = \`scale(\${targetScale}) translateY(0)\`;
            }
        });

        // Custom Menu Script
        let menuOpen = false;
        const menuToggle = document.getElementById('custom-menu-toggle');
        if(menuToggle) {
            menuToggle.addEventListener('click', function() {
                menuOpen = !menuOpen;
                const list = document.getElementById('custom-menu-list');
                const hamburger = document.getElementById('icon-hamburger');
                const closeIcon = document.getElementById('icon-close');
                
                if (menuOpen) {
                    list.style.opacity = '1';
                    list.style.transform = 'translateY(0)';
                    list.style.pointerEvents = 'auto';
                    hamburger.style.display = 'none';
                    closeIcon.style.display = 'block';
                    this.style.transform = 'rotate(90deg)';
                } else {
                    list.style.opacity = '0';
                    list.style.transform = 'translateY(20px)';
                    list.style.pointerEvents = 'none';
                    hamburger.style.display = 'block';
                    closeIcon.style.display = 'none';
                    this.style.transform = 'rotate(0deg)';
                }
            });
        }

        // Close menu when clicking a link
        document.querySelectorAll('.custom-menu-item').forEach(item => {
            item.addEventListener('mouseenter', () => item.style.transform = 'scale(1.03)');
            item.addEventListener('mouseleave', () => item.style.transform = 'scale(1)');
            item.addEventListener('click', () => {
                if(menuOpen) document.getElementById('custom-menu-toggle').click();
            });
        });

        // Custom Countdown Logic
        const targetDate = new Date("2026-11-02T10:00:00").getTime();
        setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance > 0) {
                const d = Math.floor(distance / (1000 * 60 * 60 * 24));
                const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((distance % (1000 * 60)) / 1000);

                const updateBox = (label, val) => {
                    const spans = Array.from(document.querySelectorAll('span')).filter(el => el.textContent.trim() === label);
                    if (spans.length > 0) {
                        const labelSpan = spans[spans.length - 1];
                        const numberSpan = labelSpan.previousElementSibling;
                        if (numberSpan) {
                            numberSpan.textContent = String(val).padStart(2, '0');
                        }
                    }
                };

                updateBox("Days", d);
                updateBox("Hours", h);
                updateBox("Minutes", m);
                updateBox("Seconds", s);
            }
        }, 1000);

        // Custom RSVP Logic
        const rsvpForm = document.querySelector('form');
        if (rsvpForm) {
            const decreaseBtn = document.querySelector('button[aria-label="Decrease guest count"]');
            const increaseBtn = document.querySelector('button[aria-label="Increase guest count"]');
            
            if (decreaseBtn && increaseBtn) {
                const countSpan = decreaseBtn.nextElementSibling;
                decreaseBtn.addEventListener('click', () => {
                    let current = parseInt(countSpan.textContent, 10);
                    if (current > 1) countSpan.textContent = current - 1;
                });
                increaseBtn.addEventListener('click', () => {
                    let current = parseInt(countSpan.textContent, 10);
                    if (current < 8) countSpan.textContent = current + 1;
                });
            }

            const buttons = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('Joyfully Accept') || b.textContent.includes('Regretfully Decline'));
            let selectedStatus = null;
            
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    buttons.forEach(b => {
                        b.style.background = 'transparent';
                        b.style.color = '#7C746A';
                        b.style.border = '1px solid rgba(148, 97, 35, 0.45)';
                    });
                    btn.style.background = 'linear-gradient(135deg, #946123, #7A4E1C)';
                    btn.style.color = '#FFFCF5';
                    btn.style.border = '1px solid #7A4E1C';
                    selectedStatus = btn.textContent.includes('Accept') ? 'yes' : 'no';
                });
            });

            rsvpForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (!selectedStatus) {
                    alert('Please choose whether you can attend.');
                    return;
                }
                
                const nameInput = rsvpForm.querySelector('input[type="text"]');
                const name = nameInput ? nameInput.value.trim() : '';
                
                if (!name) {
                    alert('Please enter your name.');
                    return;
                }
                
                const decreaseBtn = rsvpForm.querySelector('button[aria-label="Decrease guest count"]');
                const count = decreaseBtn ? decreaseBtn.nextElementSibling.textContent : '1';
                
                const submitBtn = rsvpForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = 'Sending...';
                submitBtn.disabled = true;

                const token = '8998101320:AAGtj5DFxhrJ3TC0v_cvacEhJiK37MRwXQY';
                const chatId = '5342723025';
                const statusText = selectedStatus === 'yes' ? '✅ Joyfully Accepting' : '❌ Regretfully Declining';
                const text = '🎉 <b>New RSVP Received!</b>\\n\\n👤 <b>Name:</b> ' + name + '\\n📌 <b>Status:</b> ' + statusText + '\\n👥 <b>Guests:</b> ' + count;
                
                fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: text,
                        parse_mode: 'HTML'
                    })
                })
                .then(response => response.json())
                .then(data => {
                    const thankYouMsg = selectedStatus === 'yes' ? "We can't wait to celebrate with you!" : "We'll miss you. Thank you for letting us know.";
                    rsvpForm.innerHTML = '<div style="text-align: center; padding: 40px 20px;"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#7A4E1C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 20px auto;"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path></svg><h3 style="font-family: \\'Playfair Display\\', Georgia, serif; font-size: 24px; color: #7A4E1C; margin-bottom: 10px;">Thank You!</h3><p style="font-family: \\'EB Garamond\\', Georgia, serif; color: #7C746A;">' + thankYouMsg + '</p></div>';
                })
                .catch(err => {
                    console.error('Telegram Error:', err);
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    alert('Oops! Something went wrong. Please try again.');
                });
            });
        }

        // Custom Audio Logic
        const audioBtn = document.querySelector('button[aria-label="Turn music on"]') || document.querySelector('button[title="Turn music on"]');
        const audioEl = document.querySelector('audio');
        
        if (audioBtn && audioEl) {
            const volumeOnSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2 h-5 w-5" aria-hidden="true"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>';
            const volumeOffSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-x h-5 w-5" aria-hidden="true"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"></path><line x1="22" x2="16" y1="9" y2="15"></line><line x1="16" x2="22" y1="9" y2="15"></line></svg>';

            window.toggleAudio = function(forcePlay) {
                if (audioEl.paused || forcePlay) {
                    audioEl.play().then(() => {
                        audioBtn.innerHTML = volumeOnSvg;
                        audioBtn.setAttribute('aria-label', 'Turn music off');
                        audioBtn.setAttribute('title', 'Turn music off');
                    }).catch(e => console.log('Playback blocked', e));
                } else {
                    audioEl.pause();
                    audioBtn.innerHTML = volumeOffSvg;
                    audioBtn.setAttribute('aria-label', 'Turn music on');
                    audioBtn.setAttribute('title', 'Turn music on');
                }
            };

            audioBtn.addEventListener('click', () => window.toggleAudio());
        }
    });
</script>
`;

const newHtml = '<body' + originalBodyAttrs + '>' + overlayHtml + originalBodyContent + '</body>';
html = html.replace(bodyRegex, newHtml);
html = html.replace(/<script\b[^>]*src="js\/[^>]*>[\s\S]*?<\/script>/gi, ''); // Clean up head scripts

fs.writeFileSync(indexPath, html);
console.log('HTML updated to remove the old overlapping hamburger menu!');








