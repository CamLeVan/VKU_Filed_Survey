import { useState, useEffect, useRef } from 'react';

const TYPING_ROLES = [
  'Backend Developer',
  'Spring Boot Engineer',
  'Flutter & Dart TA',
  'AI Enthusiast',
  'Software Engineer',
];

// Particle star effect
function StarCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let stars = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Init stars
    for (let i = 0; i < 180; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.2,
        alpha: Math.random(),
        speed: Math.random() * 0.004 + 0.001,
        dx: (Math.random() - 0.5) * 0.15,
        dy: (Math.random() - 0.5) * 0.15,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0) s.speed *= -1;
        s.x += s.dx;
        s.y += s.dy;
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165, 180, 252, ${s.alpha * 0.7})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-canvas"
      aria-hidden="true"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef(null);

  // Typing animation
  useEffect(() => {
    const currentRole = TYPING_ROLES[roleIdx];
    const typingSpeed = isDeleting ? 50 : 80;
    const pauseDuration = isDeleting ? 0 : 1800;

    if (!isDeleting && displayed === currentRole) {
      timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseDuration);
      return;
    }
    if (isDeleting && displayed === '') {
      setIsDeleting(false);
      setRoleIdx((prev) => (prev + 1) % TYPING_ROLES.length);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setDisplayed((prev) =>
        isDeleting ? prev.slice(0, -1) : currentRole.slice(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeoutRef.current);
  }, [displayed, isDeleting, roleIdx]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="home" aria-label="Introduction">
      <StarCanvas />

      <div className="hero-content">
        {/* Left: Text content */}
        <div className="hero-left">
          <div className="hero-badge animate-in">
            <span className="hero-badge-dot" />
            Available for opportunities
          </div>

          <h1 className="hero-name animate-in animate-delay-1">
            Lê Văn Cảm
          </h1>

          <div className="hero-title-line animate-in animate-delay-2">
            <span>@CamLeVan</span>
            <span className="hero-title-separator" />
            <span className="hero-typing-text">{displayed}</span>
          </div>

          <p className="hero-desc animate-in animate-delay-3">
            Sinh viên năm 3 <strong>Kỹ thuật Phần mềm</strong> tại VKU. Đam mê xây dựng hệ thống{' '}
            <strong>backend hiệu suất cao</strong> với Java & Spring Boot, phát triển{' '}
            <strong>ứng dụng di động</strong> với Flutter, và ứng dụng{' '}
            <strong>AI vào thực tế</strong> (YOLOv8, FastAPI).
          </p>

          <div className="hero-actions animate-in animate-delay-4">
            <button
              className="btn-primary"
              onClick={() => scrollToSection('projects')}
              id="btn-view-projects"
            >
              🚀 Xem dự án
            </button>
            <button
              className="btn-secondary"
              onClick={() => scrollToSection('contact')}
              id="btn-contact"
            >
              ✉️ Liên hệ ngay
            </button>
          </div>

          <div className="hero-stats animate-in animate-delay-4">
            <div className="hero-stat">
              <span className="hero-stat-num">3+</span>
              <span className="hero-stat-label">Năm học tập</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">2</span>
              <span className="hero-stat-label">Dự án nổi bật</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">4</span>
              <span className="hero-stat-label">Giải thưởng</span>
            </div>
          </div>
        </div>

        {/* Right: Code card */}
        <div className="hero-visual animate-in animate-delay-2">
          <div className="hero-code-card">
            <div className="code-card-header">
              <span className="code-dot code-dot-red" />
              <span className="code-dot code-dot-yellow" />
              <span className="code-dot code-dot-green" />
              <span className="code-card-filename">developer.java</span>
            </div>
            <div className="code-card-body">
              {[
                { ln: '1', content: <><span className="code-keyword">public class</span> <span className="code-function">LeVanCam</span> <span className="code-bracket">{'{'}</span></> },
                { ln: '2', content: <></> },
                { ln: '3', content: <>&nbsp;&nbsp;<span className="code-property">String</span> <span className="code-operator">name</span> = <span className="code-string">"Lê Văn Cảm"</span>;</> },
                { ln: '4', content: <>&nbsp;&nbsp;<span className="code-property">String</span> <span className="code-operator">school</span> = <span className="code-string">"VKU"</span>;</> },
                { ln: '5', content: <>&nbsp;&nbsp;<span className="code-property">int</span> <span className="code-operator">year</span> = <span className="code-number">3</span>;</> },
                { ln: '6', content: <></> },
                { ln: '7', content: <>&nbsp;&nbsp;<span className="code-comment">// Core expertise</span></> },
                { ln: '8', content: <>&nbsp;&nbsp;<span className="code-property">String[]</span> <span className="code-operator">skills</span> = <span className="code-bracket">{'{'}</span></> },
                { ln: '9', content: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-string">"Java"</span>, <span className="code-string">"Spring Boot"</span>,</> },
                { ln: '10', content: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-string">"Flutter"</span>, <span className="code-string">"PostgreSQL"</span>,</> },
                { ln: '11', content: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-string">"Redis"</span>, <span className="code-string">"YOLOv8"</span></> },
                { ln: '12', content: <>&nbsp;&nbsp;<span className="code-bracket">{'}'}</span>;</> },
                { ln: '13', content: <></> },
                { ln: '14', content: <>&nbsp;&nbsp;<span className="code-comment">// 🏆 Top 30 LG Dream Code 2026</span></> },
                { ln: '15', content: <><span className="code-bracket">{'}'}</span></> },
              ].map(({ ln, content }) => (
                <div className="code-line" key={ln}>
                  <span className="code-ln">{ln}</span>
                  <span className="code-content">{content}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info cards */}
          <div className="hero-info-cards">
            <div className="hero-info-card">
              <span className="info-card-icon">🎓</span>
              <span className="info-card-label">Trường</span>
              <span className="info-card-value">VKU - Năm 3</span>
            </div>
            <div className="hero-info-card">
              <span className="info-card-icon">🏫</span>
              <span className="info-card-label">Vai trò</span>
              <span className="info-card-value">TA Flutter & Dart</span>
            </div>
            <div className="hero-info-card">
              <span className="info-card-icon">📍</span>
              <span className="info-card-label">Địa điểm</span>
              <span className="info-card-value">Đà Nẵng, VN</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
