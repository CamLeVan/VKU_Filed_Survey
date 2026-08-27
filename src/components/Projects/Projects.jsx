const PROJECTS = [
  {
    id: 'aquatrade',
    icon: '🐟',
    title: 'AquaTrade AI',
    badge: { text: 'AI Platform', type: 'ai' },
    desc: 'Nền tảng phân phối thủy sản thông minh tích hợp YOLOv8 để nhận diện và phân loại cá tự động qua camera, kết hợp FastAPI backend và Spring Boot microservices cho hiệu suất cao.',
    tech: ['YOLOv8', 'FastAPI', 'Spring Boot', 'PostgreSQL', 'Flutter', 'Redis', 'Docker'],
    banner: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #0288d1 100%)',
    github: 'https://github.com/CamLeVan',
    demo: null,
  },
  {
    id: 'fingerling',
    icon: '🔬',
    title: 'Smart Fingerling Tracker',
    badge: { text: '🏆 Giải Khuyến khích', type: 'award' },
    desc: 'Hệ thống AI theo dõi và đo lường kích thước cá giống bằng Computer Vision (YOLOv8). Đạt giải Khuyến khích tại cuộc thi Danang AI4Life 2025. Team Leader với giả định đầu vào kích thước cá đồng đều.',
    tech: ['YOLOv8', 'OpenCV', 'Python', 'FastAPI', 'NumPy', 'Matplotlib'],
    banner: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%)',
    github: 'https://github.com/CamLeVan',
    demo: null,
  },
];

export default function Projects() {
  return (
    <section className="projects-section" id="projects" aria-label="Projects">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">// projects</div>
          <h2 className="section-title">Dự án nổi bật</h2>
          <p className="section-subtitle">
            Những sản phẩm thể hiện tư duy kỹ thuật và khả năng ứng dụng AI
          </p>
        </div>

        <div className="projects-grid">
          {PROJECTS.map((project) => (
            <article className="project-card" key={project.id} id={`project-${project.id}`}>
              {/* Banner */}
              <div
                className="project-banner"
                style={{ background: project.banner }}
              >
                <span className="project-banner-icon" role="img" aria-label={project.title}>
                  {project.icon}
                </span>
                <div
                  className={`project-badge ${
                    project.badge.type === 'award' ? 'badge-award' : 'badge-ai'
                  }`}
                >
                  {project.badge.text}
                </div>
              </div>

              {/* Content */}
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.desc}</p>

                <div className="project-tech-stack">
                  {project.tech.map((t) => (
                    <span className="tech-tag" key={t}>{t}</span>
                  ))}
                </div>

                <div className="project-links">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                    id={`link-${project.id}-github`}
                  >
                    🔗 GitHub
                  </a>
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                      id={`link-${project.id}-demo`}
                    >
                      🌐 Live Demo
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
