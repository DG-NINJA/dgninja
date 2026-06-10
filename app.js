gsap.registerPlugin(ScrollTrigger);

// ====== 1. LENIS SMOOTH SCROLL ENGINE ======
const lenis = new Lenis({
    duration: 1.2, 
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    smoothWheel: true
});
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0, 0);


// ====== 2. WA BUTTON ENTRANCE ======
gsap.from(".whatsapp-btn", {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: "back.out(1.5)"
});


// ====== 3. DYNAMIC THREE.JS ENGINE FOR HAYATO ======
const container = document.getElementById('3d-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 8); 

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Cinematic eSports Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
scene.add(ambientLight);

const goldLight = new THREE.DirectionalLight(0xfbc531, 2.5); 
goldLight.position.set(5, 5, 5);
scene.add(goldLight);

const crimsonLight = new THREE.DirectionalLight(0xff003c, 2); 
crimsonLight.position.set(-5, 2, -2);
scene.add(crimsonLight);

// Group to separate Scroll Animation from Mouse Animation
const hayatoGroup = new THREE.Group();
scene.add(hayatoGroup);

let hayatoModel;
const loader = new THREE.GLTFLoader();

// Make sure your extracted 3D file is named EXACTLY "hayato.glb" in the folder!
loader.load(
    'hayato.glb', 
    (gltf) => {
        hayatoModel = gltf.scene;
        
        // Base Setup (Adjust Y and Scale if your model is too big/small)
        hayatoModel.position.set(0, -2.2, 0); 
        hayatoModel.scale.set(2.3, 2.3, 2.3); 
        
        hayatoGroup.add(hayatoModel);
        
        // Initial Entry Animation
        gsap.from(hayatoModel.scale, {
            x: 0, y: 0, z: 0,
            duration: 1.5,
            ease: "back.out(1.2)"
        });

        // ====== 3.1 SCROLL ANIMATION (360 Spin & Aggressive Zoom) ======
        ScrollTrigger.create({
            trigger: ".scroll-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5, 
            onUpdate: (self) => {
                // Hayato slowly spins 360 degrees
                gsap.to(hayatoGroup.rotation, {
                    y: self.progress * (Math.PI * 2), 
                    duration: 0.5,
                    ease: "power1.out"
                });
                
                // Aggressive Zoom (comes closer to screen)
                gsap.to(hayatoGroup.position, {
                    z: self.progress * 3.5, 
                    y: -(self.progress * 1.5), 
                    duration: 0.5,
                    ease: "power1.out"
                });
            }
        });
    },
    (xhr) => { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
    (error) => { console.error('Error loading 3D asset:', error); }
);


// ====== 3.2 VERTICAL CURSOR MOVEMENT & TILT ======
let targetRotationX = 0;
let targetRotationY = 0;
let targetPositionY = -2.2; 

window.addEventListener('mousemove', (e) => {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = (e.clientY / window.innerHeight) * 2 - 1;
    
    targetRotationY = normX * 0.5; // Left/Right Look
    targetRotationX = normY * 0.2; // Up/Down Tilt
    
    // Vertical Float based on mouse Y
    targetPositionY = -2.2 + (-normY * 1.5); 
});

// Render Physics Loop
function animate() {
    requestAnimationFrame(animate);
    
    if (hayatoModel) {
        hayatoModel.rotation.y += (targetRotationY - hayatoModel.rotation.y) * 0.05;
        hayatoModel.rotation.x += (targetRotationX - hayatoModel.rotation.x) * 0.05;
        hayatoModel.position.y += (targetPositionY - hayatoModel.position.y) * 0.05;
    }
    
    renderer.render(scene, camera);
}
animate();

// Resize Fix
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// ====== 4. ZIG-ZAG CARD REVEAL ENGINE ======
const cards = document.querySelectorAll('.info-card');
cards.forEach((card) => {
    let isLeft = card.classList.contains('card-left');
    let xOffset = isLeft ? -150 : 150;

    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 85%", 
            toggleActions: "play reverse play reverse",
        },
        x: xOffset,
        opacity: 0,
        duration: 1.2, 
        ease: "back.out(1.2)"
    });
});