const HOBBIES = [
  {
    emoji: '⚽',
    name: 'Bóng đá',
    desc: 'Teamwork & chiến lược',
  },
  {
    emoji: '🏸',
    name: 'Cầu lông',
    desc: 'Tốc độ & phản xạ',
  },
  {
    emoji: '🎵',
    name: 'Âm nhạc',
    desc: 'Thư giãn & sáng tạo',
  },
  {
    emoji: '📖',
    name: 'Đọc sách',
    desc: 'Tri thức & tư duy',
  },
  {
    emoji: '🤖',
    name: 'AI Research',
    desc: 'Khám phá công nghệ',
  },
  {
    emoji: '☕',
    name: 'Café Coding',
    desc: 'Code & cà phê',
  },
];

export default function Hobbies() {
  return (
    <section className="hobbies-section" id="hobbies" aria-label="Hobbies and interests">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">// hobbies</div>
          <h2 className="section-title">Sở thích</h2>
          <p className="section-subtitle">
            Những điều tôi yêu thích ngoài việc code
          </p>
        </div>

        <div className="hobbies-grid">
          {HOBBIES.map((hobby, idx) => (
            <div
              className="hobby-card"
              key={hobby.name}
              id={`hobby-${idx}`}
              tabIndex={0}
              role="button"
              aria-label={hobby.name}
            >
              <span className="hobby-emoji" role="img" aria-hidden="true">
                {hobby.emoji}
              </span>
              <div className="hobby-name">{hobby.name}</div>
              <div className="hobby-desc">{hobby.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
