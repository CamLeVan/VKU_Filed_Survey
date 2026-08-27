import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

// ─── Skills Data ────────────────────────────────────────────────
const SKILL_BUBBLES = [
  // Backend
  { label: 'Java', color: '#e76f51', textColor: '#fff', radius: 52 },
  { label: 'Spring Boot', color: '#6db33f', textColor: '#fff', radius: 60 },
  { label: 'Spring Security', color: '#4caf50', textColor: '#fff', radius: 58 },
  { label: 'REST API', color: '#0288d1', textColor: '#fff', radius: 48 },
  // Database
  { label: 'PostgreSQL', color: '#336791', textColor: '#fff', radius: 55 },
  { label: 'Redis', color: '#dc382d', textColor: '#fff', radius: 44 },
  { label: 'MySQL', color: '#4479a1', textColor: '#fff', radius: 44 },
  // Mobile / Frontend
  { label: 'Flutter', color: '#54c5f8', textColor: '#fff', radius: 54 },
  { label: 'Dart', color: '#0175c2', textColor: '#fff', radius: 46 },
  { label: 'React', color: '#61dafb', textColor: '#222', radius: 46 },
  // AI / ML
  { label: 'YOLOv8', color: '#8b5cf6', textColor: '#fff', radius: 50 },
  { label: 'FastAPI', color: '#009688', textColor: '#fff', radius: 50 },
  { label: 'Python', color: '#3776ab', textColor: '#fff', radius: 48 },
  // DevOps / Tools
  { label: 'Docker', color: '#2496ed', textColor: '#fff', radius: 46 },
  { label: 'Git', color: '#f05032', textColor: '#fff', radius: 44 },
  { label: 'Linux', color: '#fcc624', textColor: '#222', radius: 42 },
];

const SKILL_CATEGORIES = [
  {
    icon: '☕',
    name: 'Backend',
    tags: ['Java', 'Spring Boot', 'Spring Security', 'REST API', 'Microservices'],
  },
  {
    icon: '🗄️',
    name: 'Database & Cache',
    tags: ['PostgreSQL', 'MySQL', 'Redis', 'Hibernate / JPA'],
  },
  {
    icon: '📱',
    name: 'Mobile / Frontend',
    tags: ['Flutter', 'Dart', 'React', 'HTML/CSS', 'JavaScript'],
  },
  {
    icon: '🤖',
    name: 'AI & ML',
    tags: ['YOLOv8', 'FastAPI', 'Python', 'OpenCV', 'NumPy'],
  },
  {
    icon: '🛠️',
    name: 'DevOps & Tools',
    tags: ['Docker', 'Git', 'Linux', 'GitHub Actions', 'Postman'],
  },
];

// ─── Physics Canvas ─────────────────────────────────────────────
function PhysicsCanvas() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const runnerRef = useRef(null);
  const mouseRef = useRef(null);
  const mouseConstraintRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const W = container.clientWidth;
    const H = container.clientHeight;

    const { Engine, Render, Runner, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = Matter;

    // Engine
    const engine = Engine.create({ gravity: { x: 0, y: 0 } });
    engineRef.current = engine;

    // Renderer
    const render = Render.create({
      element: container,
      engine,
      canvas: canvasRef.current,
      options: {
        width: W,
        height: H,
        background: 'transparent',
        wireframes: false,
        pixelRatio: window.devicePixelRatio || 1,
      },
    });
    renderRef.current = render;

    // Runner
    const runner = Runner.create();
    runnerRef.current = runner;

    // ── Walls (invisible boundaries) ──────────────────────────────
    const wallOpts = { isStatic: true, render: { fillStyle: 'transparent' } };
    const walls = [
      Bodies.rectangle(W / 2, -25, W + 100, 50, wallOpts),      // top
      Bodies.rectangle(W / 2, H + 25, W + 100, 50, wallOpts),   // bottom
      Bodies.rectangle(-25, H / 2, 50, H + 100, wallOpts),      // left
      Bodies.rectangle(W + 25, H / 2, 50, H + 100, wallOpts),   // right
    ];

    // ── Bubble Bodies ──────────────────────────────────────────────
    const bubbles = SKILL_BUBBLES.map((skill) => {
      const x = Math.random() * (W - skill.radius * 2) + skill.radius;
      const y = Math.random() * (H - skill.radius * 2) + skill.radius;
      const body = Bodies.circle(x, y, skill.radius, {
        restitution: 0.7,
        friction: 0.01,
        frictionAir: 0.015,
        density: 0.002,
        render: {
          fillStyle: skill.color,
          strokeStyle: 'rgba(255,255,255,0.2)',
          lineWidth: 2,
        },
        label: skill.label,
        plugin: { skill },
      });
      // Random initial velocity
      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 4,
      });
      return body;
    });

    Composite.add(engine.world, [...walls, ...bubbles]);

    // ── Anti-gravity: constant gentle force toward center ─────────
    Events.on(engine, 'beforeUpdate', () => {
      const cx = W / 2;
      const cy = H / 2;
      bubbles.forEach((body) => {
        const dx = cx - body.position.x;
        const dy = cy - body.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 10) {
          const forceMag = 0.000004 * body.mass;
          Body.applyForce(body, body.position, {
            x: (dx / dist) * forceMag,
            y: (dy / dist) * forceMag,
          });
        }
      });
    });

    // ── Mouse interaction ─────────────────────────────────────────
    const mouse = Mouse.create(canvasRef.current);
    mouseRef.current = mouse;
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    mouseConstraintRef.current = mouseConstraint;
    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // ── Custom rendering: draw text on bubbles ────────────────────
    Events.on(render, 'afterRender', () => {
      const ctx = render.context;
      bubbles.forEach((body) => {
        const { x, y } = body.position;
        const skill = body.plugin?.skill;
        if (!skill) return;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(body.angle);

        // Glow
        ctx.shadowColor = skill.color;
        ctx.shadowBlur = 20;

        // Text
        const fontSize = Math.max(11, Math.min(14, skill.radius * 0.26));
        ctx.font = `700 ${fontSize}px 'Space Grotesk', 'Inter', sans-serif`;
        ctx.fillStyle = skill.textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 0;
        ctx.fillText(skill.label, 0, 0);

        ctx.restore();
      });
    });

    // ── Click to burst ─────────────────────────────────────────────
    Events.on(mouseConstraint, 'mousedown', () => {
      const mousePos = mouse.position;
      bubbles.forEach((body) => {
        const dx = body.position.x - mousePos.x;
        const dy = body.position.y - mousePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < body.plugin?.skill?.radius + 30) {
          const forceMag = 0.008 * body.mass;
          Body.applyForce(body, body.position, {
            x: (dx / (dist + 1)) * forceMag,
            y: (dy / (dist + 1)) * forceMag,
          });
        }
      });
    });

    // ── Start ─────────────────────────────────────────────────────
    Render.run(render);
    Runner.run(runner, engine);

    // ── Resize ────────────────────────────────────────────────────
    const handleResize = () => {
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      render.canvas.width = newW;
      render.canvas.height = newH;
      render.options.width = newW;
      render.options.height = newH;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="skills-physics-container"
      aria-label="Interactive skill bubbles - click and drag to interact"
    >
      <canvas ref={canvasRef} className="skills-physics-canvas" />
      <div className="skills-hint">✨ Click & kéo để tương tác với các bong bóng kỹ năng</div>
    </div>
  );
}

// ─── Main Skills Component ───────────────────────────────────────
export default function Skills() {
  return (
    <section className="skills-section" id="skills" aria-label="Skills">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">// skills</div>
          <h2 className="section-title">Kỹ năng & Công nghệ</h2>
          <p className="section-subtitle">
            Tương tác với các bong bóng bên dưới — kéo, thả, và click để khám phá
          </p>
        </div>

        {/* Physics antigravity bubbles */}
        <PhysicsCanvas />

        {/* Skill Categories */}
        <div className="skills-categories" style={{ marginTop: '40px' }}>
          {SKILL_CATEGORIES.map((cat) => (
            <div className="skill-category-card" key={cat.name}>
              <div className="skill-category-icon">{cat.icon}</div>
              <div className="skill-category-name">{cat.name}</div>
              <div className="skill-tags">
                {cat.tags.map((tag) => (
                  <span className="skill-tag" key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
