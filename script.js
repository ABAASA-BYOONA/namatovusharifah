// --- Cursor ---
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mx = window.innerWidth/2, my = window.innerHeight/2;
let rx = mx, ry = my;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

function animateCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// --- Loader sequence ---
  (function() {
    const name = 'Namatovu Sharifah';
    const nameEl = document.getElementById('ldr-name-el');
    name.split('').forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'ldr-char';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.animationDelay = (0.55 + i * 0.04) + 's';
      nameEl.appendChild(span);
    });
    const statuses = ['Initialising portfolio','Loading brand work','Crafting the experience','Almost ready'];
    const numEl = document.getElementById('ldr-num');
    const barEl = document.getElementById('ldr-bar');
    const statusEl = document.getElementById('ldr-status');
    let pct = 0, statusIdx = 0;
    function tick() {
      pct = Math.min(100, pct + Math.random() * 4 + 1);
      numEl.textContent = Math.floor(pct);
      barEl.style.width = pct + '%';
      const newIdx = Math.min(statuses.length - 1, Math.floor((pct / 100) * statuses.length));
      if (newIdx !== statusIdx) {
        statusIdx = newIdx;
        statusEl.style.opacity = '0';
        setTimeout(() => { statusEl.textContent = statuses[statusIdx]; statusEl.style.opacity = '1'; statusEl.style.transition = 'opacity 0.4s'; }, 200);
      }
      if (pct < 100) {
        setTimeout(tick, 35 + Math.random() * 50);
      } else {
        numEl.textContent = '100'; barEl.style.width = '100%';
        setTimeout(() => {
          document.getElementById('ldr-wipe').classList.add('gone');
          document.getElementById('loader').classList.add('hidden');
        }, 650);
      }
    }
    setTimeout(tick, 700);
  })();

// --- Nav scroll ---
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 80);
});

// --- Marquee ---
const marquee = document.getElementById('marquee');
let mPos = 0;
function animateMarquee() {
  mPos -= 0.5;
  if (mPos <= -marquee.children[0].offsetWidth) mPos = 0;
  marquee.style.transform = `translateX(${mPos}px)`;
  requestAnimationFrame(animateMarquee);
}
animateMarquee();

// --- Reveal on scroll ---
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => revealObs.observe(el));

// --- Three.js Background ---
(function initBg() {
  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const matWire = new THREE.MeshBasicMaterial({ color: 0xC9A96E, wireframe: true, opacity: 0.06, transparent: true });
  const matWire2 = new THREE.MeshBasicMaterial({ color: 0x8B3A1E, wireframe: true, opacity: 0.04, transparent: true });
  const matWire3 = new THREE.MeshBasicMaterial({ color: 0x4A5240, wireframe: true, opacity: 0.05, transparent: true });

  const shapes = [];

  function addShape(geo, mat, x, y, z, sx=1, sy=1, sz=1) {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.scale.set(sx, sy, sz);
    mesh.userData = { rx: Math.random()*0.003-0.0015, ry: Math.random()*0.005-0.0025, rz: Math.random()*0.002-0.001, fy: Math.sin(Math.random()*Math.PI*2), fSpeed: 0.0005 + Math.random()*0.0005 };
    scene.add(mesh);
    shapes.push(mesh);
  }

  addShape(new THREE.IcosahedronGeometry(1.2, 1), matWire, -3.5, 1, -1);
  addShape(new THREE.OctahedronGeometry(0.9), matWire2, 3.2, -1.5, -0.5);
  addShape(new THREE.TorusGeometry(0.8, 0.04, 8, 40), matWire3, 0, 2.5, -2);
  addShape(new THREE.IcosahedronGeometry(0.6, 0), matWire, 2.5, 2, -1);
  addShape(new THREE.OctahedronGeometry(0.5), matWire2, -2.5, -2, -1);
  addShape(new THREE.TorusKnotGeometry(0.5, 0.1, 50, 8), matWire, 3.8, 0.5, -2);
  addShape(new THREE.IcosahedronGeometry(0.4, 1), matWire3, -3.8, -0.5, -1.5);

  // Particles
  const particleCount = 200;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    pPos[i*3] = (Math.random()-0.5)*14;
    pPos[i*3+1] = (Math.random()-0.5)*10;
    pPos[i*3+2] = (Math.random()-0.5)*4 - 1;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xC9A96E, size: 0.015, transparent: true, opacity: 0.25 });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;
    shapes.forEach((m, i) => {
      m.rotation.x += m.userData.rx;
      m.rotation.y += m.userData.ry;
      m.rotation.z += m.userData.rz;
      m.position.y += Math.sin(t * m.userData.fSpeed * 100 + m.userData.fy) * 0.0008;
    });
    particles.rotation.y += 0.0002;
    camera.position.x += (mouseX - camera.position.x) * 0.03;
    camera.position.y += (-mouseY - camera.position.y) * 0.03;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

// --- 3D Card Tilt ---
document.querySelectorAll('.project-card, .proj3-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x*6}deg) rotateX(${-y*6}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
    card.style.transition = 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
  });
});

// --- Modal ---
const projects = {
    organic: {
      title: 'Organic Roasts',
      type: 'Branding & Packaging · Solo Project',
      sub: '2026 · Kampala, Uganda',
      role: 'Solo Designer — Brand Identity, Packaging, Research',
      desc: 'A premium artisanal snack brand built around traditional Ugandan organic seeds. The challenge was bridging a critical perception gap — locally wood-roasted seeds were seen as street food despite their artisanal quality. Organic Roasts reframes them as a luxury export through intentional material choices, quiet branding, and sustainable packaging.',
      highlights: ['Borosilicate glass jar — clarity, purity, product visibility','Bamboo lid — eco-conscious premium seal','Ebyayi banana fiber binding — artisan structural support','Laser-engraved branding directly on glass','Vertical transparent flavor strip with QR code','Miniature wooden spoon as integrated design element','Refill pouch with matte finish & die-cut window','Cormorant Garamond + Montserrat typography system'],
      palette: ['#1C1A17','#4A5240','#C9A96E','#F2EDE4'],
      extra: { label: 'Seed Profile', items: ['Nutty Jackfruit Seeds','Velvet Earthy Pepitas','Crispy Sunflower Seeds','Crunchy Cowpeas','Silk Simsim Seeds'] },
      quote: 'Transform traditional Ugandan snacks into a modern luxury experience that commands respect and value.'
    },
    tinybeaks: {
      title: 'TinyBeaks',
      type: 'UX Research · App Design · Group Project',
      sub: 'Web Media Project VCM 3210 · Makerere University',
      role: 'Head of Research',
      desc: 'TinyBeaks is a poultry monitoring app designed to support farmers through the critical early stages of chick development. Farmers typically rely on memory and handwritten notes for vaccination, feeding, and disease monitoring — leading to preventable losses. TinyBeaks replaces that uncertainty with a simple, data-driven digital assistant featuring AI guidance.',
      highlights: ['AI Assistant for real-time 24/7 veterinary guidance','Vaccination reminders & schedule management','30-Day chick development journey tracker','Daily signs & symptoms checker','Feeding schedule & consumption tracker','Environment monitoring: temperature, humidity, lighting','Death count logging & mortality tracking','Sora typeface · #3B2416 · #2AACE2 · #FCEE21 colour system'],
      palette: ['#3B2416','#2AACE2','#FCEE21','#FFFFFF'],
      extra: { label: 'Team', items: ['Ssegawa Kevin — General Coordinator & UI Designer','Nanteza Arabella Krystal — UI Designer','Agaba Emmanuella — UX Designer','Benson Akandanwaho — UX Designer','Namatovu Sharifah — Head of Research'] },
      quote: 'Easy use. Easy growth. A digital assistant that reduces chick mortality and simplifies farm management.'
    }
  };

function showProject(key) {
    const p = projects[key];
    if (!p) return;
    const modal = document.getElementById('modal');
    const mContent = document.getElementById('modal-content');

    const swatches = p.palette.map(c =>
      `<div style="width:36px;height:36px;background:${c};border:1px solid rgba(242,237,228,0.08);flex-shrink:0;" title="${c}"></div>`
    ).join('');

    const hiList = p.highlights.map(h =>
      `<li style="padding:0.7rem 0;border-bottom:1px solid rgba(242,237,228,0.05);font-family:'Montserrat',sans-serif;font-size:0.72rem;font-weight:300;color:rgba(242,237,228,0.65);letter-spacing:0.04em;display:flex;align-items:flex-start;gap:0.75rem;"><span style="color:var(--gold);flex-shrink:0;">—</span>${h}</li>`
    ).join('');

    const extraList = p.extra ? p.extra.items.map(t =>
      `<div style="font-family:'Montserrat',sans-serif;font-size:0.7rem;font-weight:300;color:rgba(242,237,228,0.6);padding:0.4rem 0;border-bottom:1px solid rgba(242,237,228,0.05);">${t}</div>`
    ).join('') : '';

    const isGroup = p.type.includes('Group');
    const badgeColor = isGroup ? '#2AACE2' : 'var(--gold)';
    const badgeBorder = isGroup ? 'rgba(42,172,226,0.3)' : 'rgba(201,169,110,0.3)';

    mContent.innerHTML = `
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;">
        <span style="font-family:'Montserrat',sans-serif;font-size:0.58rem;font-weight:500;letter-spacing:0.3em;text-transform:uppercase;color:${badgeColor};padding:0.3rem 0.8rem;border:1px solid ${badgeBorder};">${isGroup ? 'Group Project' : 'Solo Project'}</span>
      </div>
      <p style="font-family:'Montserrat',sans-serif;font-size:0.6rem;font-weight:500;letter-spacing:0.35em;text-transform:uppercase;color:rgba(242,237,228,0.4);margin-bottom:0.75rem;">${p.type}</p>
      <h2 style="font-family:'Cormorant Garamond',serif;font-size:clamp(2.5rem,5vw,4.5rem);font-weight:300;color:var(--cream);line-height:1;margin-bottom:0.75rem;">${p.title}</h2>
      <p style="font-family:'Montserrat',sans-serif;font-size:0.65rem;font-weight:300;color:rgba(242,237,228,0.35);letter-spacing:0.12em;margin-bottom:0.5rem;">${p.sub}</p>
      <p style="font-family:'Montserrat',sans-serif;font-size:0.65rem;font-weight:500;color:var(--rust-light);letter-spacing:0.08em;margin-bottom:3rem;">Role: ${p.role}</p>

      <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:4rem;align-items:start;">
        <div>
          <h4 style="font-family:'Montserrat',sans-serif;font-size:0.58rem;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:var(--gold);margin-bottom:1.25rem;">Overview</h4>
          <p style="font-family:'Montserrat',sans-serif;font-size:0.82rem;font-weight:300;line-height:1.9;color:rgba(242,237,228,0.7);margin-bottom:2.5rem;">${p.desc}</p>
          <h4 style="font-family:'Montserrat',sans-serif;font-size:0.58rem;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:var(--gold);margin-bottom:1rem;">Key Features & Design Decisions</h4>
          <ul style="list-style:none;">${hiList}</ul>
        </div>
        <div>
          <h4 style="font-family:'Montserrat',sans-serif;font-size:0.58rem;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:var(--gold);margin-bottom:1rem;">Colour Palette</h4>
          <div style="display:flex;gap:0.5rem;margin-bottom:2.5rem;">${swatches}</div>
          ${p.extra ? `
          <h4 style="font-family:'Montserrat',sans-serif;font-size:0.58rem;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:var(--gold);margin-bottom:1rem;">${p.extra.label}</h4>
          <div style="margin-bottom:2.5rem;">${extraList}</div>` : ''}
          <div style="padding:1.75rem;border:1px solid rgba(242,237,228,0.07);">
            <p style="font-family:'Cormorant Garamond',serif;font-size:1.25rem;font-weight:300;font-style:italic;color:rgba(242,237,228,0.22);line-height:1.6;">"${p.quote}"</p>
          </div>
        </div>
      </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.body.style.overflow = '';
}

document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

(function() {
  const img = document.getElementById('hero-img');
  // Update the path relative to where your HTML file is running
  img.src = 'assets/images/owner.png';
})();