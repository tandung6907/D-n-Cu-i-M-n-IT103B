const solar = document.getElementById('solar-cursor');
const planets = document.querySelectorAll('.planet');
const lines = document.querySelectorAll('.orbit-line');

// Orbit distances in pixels
const distances = [35, 60, 90, 120, 165, 210, 255, 300];

// Initialize distances for planets and their orbit lines
planets.forEach((planet, index) => {
    const d = distances[index];
    planet.style.setProperty('--distance', `${d}px`);
    
    if (lines[index]) {
        lines[index].style.width = `${d * 2}px`;
        lines[index].style.height = `${d * 2}px`;
    }
});

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let currentX = mouseX;
let currentY = mouseY;

// Update mouse position
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Smooth follow animation (LERP)
function animate() {
    // Change 0.12 to adjust smoothness (higher = faster)
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    solar.style.left = `${currentX}px`;
    solar.style.top = `${currentY}px`;
    
    requestAnimationFrame(animate);
}

animate();