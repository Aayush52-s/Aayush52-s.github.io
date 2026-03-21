// Typing Effect for Role
const typeText = document.querySelector('.typing-text');
const roles = ['Network Security Engineer'];
let roleIndex = 0;
let charIndex = 0;
let isTyping = true;
let isDeleting = false;

function type() {
    if (isTyping) {
        if (!isDeleting && charIndex < roles[roleIndex].length) {
            typeText.textContent += roles[roleIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        } else if (isDeleting && charIndex > 0) {
            typeText.textContent = roles[roleIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(type, 50);
        } else {
            isDeleting = !isDeleting;
            if (!isDeleting) {
                roleIndex = (roleIndex + 1) % roles.length;
            }
            setTimeout(type, isDeleting ? 2000 : 500);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    typeText.textContent = '';
    setTimeout(type, 1000);
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when link is clicked
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Fade in elements on scroll
const fadeElements = document.querySelectorAll('.fade-in');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeElements.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Terminal random lines generator
const terminalBody = document.querySelector('.terminal-body');
const terminalLines = [
    '<span class="prompt root">root@sec-ops:~#</span> nmap -sV 10.0.0.0/24',
    '<span class="output">Starting Nmap 7.92...</span>',
    '<span class="output">Scan complete: 256 IP addresses scanned.</span>',
    '<span class="prompt root">root@sec-ops:~#</span> tail -f /var/log/auth.log',
    '<span class="output">Accepted publickey for admin from 192.168.1.50</span>',
    '<span class="prompt root">root@sec-ops:~#</span> tcpdump -i eth0',
    '<span class="output">Listening on eth0, link-type EN10MB...</span>',
    '<span class="prompt root">root@sec-ops:~#</span> ping 8.8.8.8 -c 1',
    '<span class="output">64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=14.2 ms</span>'
];

function triggerTerminalUpdate() {
    let delay = Math.random() * 5000 + 2000;
    setTimeout(() => {
        const randomLine = terminalLines[Math.floor(Math.random() * terminalLines.length)];
        // remove blink cursor
        const blinkCursor = terminalBody.querySelector('.blink');
        if (blinkCursor) {
            blinkCursor.remove();
        }
        
        const newLine = document.createElement('p');
        newLine.innerHTML = randomLine;
        newLine.style.opacity = 0;
        
        terminalBody.appendChild(newLine);
        
        // fade in
        setTimeout(() => { newLine.style.opacity = 1; }, 100);
        
        // re-add blink cursor on a final line
        const newCursorLine = document.createElement('p');
        newCursorLine.innerHTML = '<span class="prompt root">root@sec-ops:~#</span> <span class="blink">_</span>';
        terminalBody.appendChild(newCursorLine);
        
        // keep it clean
        if (terminalBody.childElementCount > 8) {
            terminalBody.removeChild(terminalBody.children[0]);
            terminalBody.removeChild(terminalBody.children[0]);
        }
        
        triggerTerminalUpdate();
    }, delay);
}

// Start terminal simulation
setTimeout(triggerTerminalUpdate, 3000);

// ==========================================
// Network Particle Background
// ==========================================
const canvas = document.getElementById('network-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, particles;

    function initNetwork() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        
        const particleCount = Math.floor((width * height) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                radius: Math.random() * 2 + 1
            });
        }
    }

    function animateNetwork() {
        requestAnimationFrame(animateNetwork);
        ctx.clearRect(0, 0, width, height);
        
        ctx.fillStyle = 'rgba(0, 240, 255, 0.6)';
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 150) {
                    const opacity = 1 - (dist / 150);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${opacity * 0.5})`;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    initNetwork();
    animateNetwork();
    
    window.addEventListener('resize', () => {
        initNetwork();
    });
}
