function hamburg() {
    const navbar = document.querySelector('.dropdown');
    navbar.classList.add('active');
    document.querySelector('nav').classList.add('active');
}
function cancel() {
    const navbar = document.querySelector('.dropdown');
    navbar.classList.remove('active');
    document.querySelector('nav').classList.remove('active');
}

const texts =
    ["Developer", "IT STUDENT", "Content Creator", "Gamer"];

const speed = 100;
const textElement = document.querySelector('.typewriter-text');

let textIndex = 0;
let charIndex = 0;

function typeWriter() {
    if (charIndex < texts[textIndex].length) {
        textElement.innerHTML += texts[textIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, speed);
    } else {
        setTimeout(eraseText, 100);
    }
}

function eraseText() {
    if (textElement.innerHTML.length > 0) {
        textElement.innerHTML = textElement.innerHTML.slice(0, -1);
        setTimeout(eraseText, 50);
    } else {
        textIndex = (textIndex + 1) % texts.length;
        charIndex = 0;
        setTimeout(typeWriter, 500);
    }
}

window.onload = () => {
    typeWriter();
    initParticles();
}

/* ================= PARTICLE SYSTEM ================= */
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 100;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = '#30b3e7';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function createParticles() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.strokeStyle = `rgba(48, 179, 231, ${1 - distance / 100})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }

    createParticles();
    animate();
}

/* ================= SCROLL REVEAL ================= */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Triggers slightly before the element hits the threshold
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
        } else {
            entry.target.classList.remove('reveal');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.main-container, .about-container, .education-container, .skills-container, .projects-container, .contact-container');
    sections.forEach(section => {
        observer.observe(section);
    });

    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
});

/* ================= EDUCATION GALLERY ================= */
let currentImageIndex = 1;
const totalImages = 10;

function updateGallery() {
    const activeCard = document.getElementById('active-card');
    const prevCard = document.getElementById('prev-card');
    const nextCard = document.getElementById('next-card');

    if (!activeCard || !prevCard || !nextCard) return;

    const activeImg = activeCard.querySelector('img');
    const prevImg = prevCard.querySelector('img');
    const nextImg = nextCard.querySelector('img');

    const prevIndex = (currentImageIndex - 2 + totalImages) % totalImages + 1;
    const nextIndex = (currentImageIndex % totalImages) + 1;

    // Apply switching state for smooth fade and scale
    const cards = [activeCard, prevCard, nextCard];
    cards.forEach(card => card.classList.add('switching'));

    setTimeout(() => {
        activeImg.src = `Images/${currentImageIndex}C.jpg`;
        prevImg.src = `Images/${prevIndex}C.jpg`;
        nextImg.src = `Images/${nextIndex}C.jpg`;

        setTimeout(() => {
            cards.forEach(card => card.classList.remove('switching'));
        }, 100);
    }, 150);
}

function nextImage() {
    currentImageIndex = (currentImageIndex % totalImages) + 1;
    updateGallery();
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 2 + totalImages) % totalImages + 1;
    updateGallery();
}

// Initial update
document.addEventListener('DOMContentLoaded', () => {
    updateGallery();

    // Intersection Observer for Autoplay Video
    const video = document.getElementById('capstone-video');
    if (video) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(error => {
                        console.log("Autoplay prevented:", error);
                    });
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.5 }); // Play when 50% visible

        observer.observe(video);
    }
    // Project Video Control (Autoplay on Hover + Reset)
    const projectVideo = document.getElementById('project1-video');
    if (projectVideo) {
        const projectCard = projectVideo.closest('.project-card');

        projectCard.addEventListener('mouseover', () => {
            projectVideo.play().catch(error => {
                console.log("Hover play prevented:", error);
            });
        });

        projectCard.addEventListener('mouseout', () => {
            if (!projectCard.classList.contains('focused')) {
                projectVideo.pause();
                projectVideo.currentTime = 0; // Reset to start
            }
        });

        // Click to Focus/See Clearly
        projectCard.addEventListener('click', (e) => {
            // Don't focus if a link inside was clicked
            if (e.target.closest('a')) return;

            const isFocused = projectCard.classList.contains('focused');

            // Remove focus from all other cards first
            document.querySelectorAll('.project-card').forEach(card => {
                card.classList.remove('focused');
                const v = card.querySelector('video');
                if (v && v !== projectVideo) {
                    v.pause();
                    v.currentTime = 0;
                }
            });

            if (!isFocused) {
                projectCard.classList.add('focused');
                projectVideo.play();
            } else {
                projectCard.classList.remove('focused');
            }
        });
    }

    // Close focus when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.project-card')) {
            document.querySelectorAll('.project-card').forEach(card => {
                card.classList.remove('focused');
                const v = card.querySelector('video');
                if (v) {
                    v.pause();
                    v.currentTime = 0;
                }
            });
        }
    });
});
