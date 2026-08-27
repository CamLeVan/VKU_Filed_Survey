import { useEffect, useRef } from 'react';

const ABOUT_DETAILS = [
  { icon: '🎓', label: 'Trường', value: 'VKU Đà Nẵng' },
  { icon: '📚', label: 'Chuyên ngành', value: 'Kỹ thuật Phần mềm' },
  { icon: '👨‍🏫', label: 'Vai trò', value: 'Teaching Assistant' },
  { icon: '💻', label: 'Chuyên môn', value: 'Backend Developer' },
  { icon: '📍', label: 'Địa điểm', value: 'Đà Nẵng, Việt Nam' },
  { icon: '🌐', label: 'Ngôn ngữ', value: 'Tiếng Việt & English' },
];

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.observe-me');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="about-section" id="about" ref={sectionRef} aria-label="About me">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">// about me</div>
          <h2 className="section-title">Tôi là ai?</h2>
          <p className="section-subtitle">
            Một developer đam mê xây dựng phần mềm có tác động thực tế
          </p>
        </div>

        <div className="about-grid">
          {/* Left: Avatar */}
          <div className="about-image-wrapper observe-me">
            <div className="about-avatar-ring-2" />
            <div className="about-avatar-ring" />
            <div className="about-avatar">
              <div className="about-avatar-inner">
                <span className="about-avatar-initials">LC</span>
                <span className="about-avatar-name">@CamLeVan</span>
              </div>
            </div>
            <div className="about-experience-badge">
              🏆 Top 30 LG Dream Code 2026
            </div>
          </div>

          {/* Right: Content */}
          <div className="about-text">
            <p className="about-intro observe-me">
              Xin chào! Tôi là <strong>Lê Văn Cảm</strong> — sinh viên năm 3 ngành{' '}
              <strong>Kỹ thuật Phần mềm</strong> tại Trường Đại học Công nghệ thông tin và Truyền thông Việt - Hàn (VKU).
            </p>

            <p className="about-intro observe-me" style={{ marginTop: '-8px' }}>
              Tôi đóng vai trò <strong>Teaching Assistant</strong> về Flutter & Dart,
              đồng thời hoạt động như một <strong>Backend Developer</strong> chuyên sâu về Java,
              Spring Boot và các hệ thống phân tán. Tôi có niềm đam mê đặc biệt với việc
              ứng dụng <strong>AI vào bài toán thực tiễn</strong>, được thể hiện qua các
              dự án với YOLOv8 và FastAPI.
            </p>

            <div className="about-details-grid observe-me">
              {ABOUT_DETAILS.map((detail) => (
                <div className="about-detail-item" key={detail.label}>
                  <span className="about-detail-icon">{detail.icon}</span>
                  <div className="about-detail-content">
                    <label>{detail.label}</label>
                    <span>{detail.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="hero-actions observe-me">
              <a
                href="/cv.pdf"
                className="btn-primary"
                id="btn-download-cv"
                download
              >
                📄 Tải CV
              </a>
              <a
                href="https://github.com/CamLeVan"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                id="btn-github-profile"
              >
                🔗 GitHub Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
