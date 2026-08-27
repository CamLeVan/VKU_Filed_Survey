const AWARDS = [
  {
    icon: '🥇',
    iconClass: 'award-icon-gold',
    year: '2026',
    title: 'Top 30 Finalist — LG Dream Code 2026',
    org: 'LG Electronics R&D Vietnam',
    desc: 'Lọt vào Top 30 trong cuộc thi lập trình quốc tế được tổ chức bởi LG Electronics R&D Vietnam, cạnh tranh cùng hàng trăm thí sinh trên toàn quốc.',
  },
  {
    icon: '🏆',
    iconClass: 'award-icon-gold',
    year: '2025',
    title: 'Giải Khuyến khích — AI for Life 2025',
    org: 'Ban Tổ chức Danang AI4Life 2025',
    desc: 'Giải Khuyến khích với tư cách Team Leader tại cuộc thi Danang AI4Life 2025. Dự án Smart Fingerling Tracker ứng dụng Computer Vision để theo dõi cá giống thông minh.',
  },
  {
    icon: '🌐',
    iconClass: 'award-icon-silver',
    year: '2023',
    title: 'Thành viên — VKU ICPC Training Team',
    org: 'Trường Đại học VKU',
    desc: 'Được tuyển chọn vào đội tuyển lập trình thi đấu ICPC của trường, rèn luyện tư duy giải thuật và kỹ năng competitive programming.',
  },
];

export default function Awards() {
  return (
    <section className="awards-section" id="awards" aria-label="Awards and achievements">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">// achievements</div>
          <h2 className="section-title">Giải thưởng & Thành tích</h2>
          <p className="section-subtitle">
            Những dấu mốc quan trọng trong hành trình học tập và phát triển
          </p>
        </div>

        <div className="awards-timeline">
          {AWARDS.map((award, idx) => (
            <div className="award-item" key={idx}>
              <div className={`award-icon-wrapper ${award.iconClass}`}>
                <span role="img" aria-label={award.title}>{award.icon}</span>
              </div>
              <div className="award-content">
                <div className="award-year">📅 {award.year}</div>
                <h3 className="award-title">{award.title}</h3>
                <div className="award-org">🏛 {award.org}</div>
                <p className="award-desc">{award.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
