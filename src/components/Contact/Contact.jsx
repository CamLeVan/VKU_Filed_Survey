import { useState } from 'react';

const CONTACT_LINKS = [
  {
    icon: '📧',
    label: 'Email',
    value: 'levancamp@gmail.com',
    href: 'mailto:levancamp@gmail.com',
  },
  {
    icon: '🐙',
    label: 'GitHub',
    value: 'github.com/CamLeVan',
    href: 'https://github.com/CamLeVan',
  },
  {
    icon: '💼',
    label: 'LinkedIn',
    value: 'linkedin.com/in/camlevan',
    href: 'https://linkedin.com/in/camlevan',
  },
  {
    icon: '📍',
    label: 'Địa chỉ',
    value: 'Đà Nẵng, Việt Nam',
    href: 'https://maps.google.com/?q=Da+Nang,+Vietnam',
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate sending (replace with EmailJS or real API call)
    await new Promise((r) => setTimeout(r, 1800));
    setStatus('sent');
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <section className="contact-section" id="contact" aria-label="Contact">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">// contact</div>
          <h2 className="section-title">Liên hệ với tôi</h2>
          <p className="section-subtitle">
            Sẵn sàng cho các cơ hội hợp tác và dự án mới
          </p>
        </div>

        <div className="contact-grid">
          {/* Left: Info */}
          <div className="contact-info">
            <h3 className="contact-heading">
              Hãy cùng xây dựng<br />
              điều gì đó tuyệt vời! 🚀
            </h3>
            <p className="contact-subheading">
              Tôi luôn sẵn sàng lắng nghe về các dự án thú vị, cơ hội thực tập,
              hay chỉ đơn giản là một cuộc trò chuyện về công nghệ.
            </p>

            <div className="contact-links">
              {CONTACT_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="contact-link-item"
                  id={`contact-link-${link.label.toLowerCase()}`}
                >
                  <div className="contact-link-icon">{link.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                      {link.label}
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {link.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Fun status */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px 20px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 'var(--radius-md)',
                marginTop: '8px',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>💚</span>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                  Trạng thái hiện tại
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-green)' }}>
                  Sẵn sàng nhận dự án / thực tập
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="contact-form-wrapper">
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Tên của bạn</label>
                  <input
                    id="contact-name"
                    className="form-input"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    className="form-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="hello@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-subject">Chủ đề</label>
                <input
                  id="contact-subject"
                  className="form-input"
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Cơ hội hợp tác / Dự án mới"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">Tin nhắn</label>
                <textarea
                  id="contact-message"
                  className="form-textarea"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Xin chào Cảm! Tôi muốn trao đổi về..."
                  required
                />
              </div>

              <button
                type="submit"
                className="form-submit"
                id="btn-send-message"
                disabled={status === 'sending'}
              >
                {status === 'idle' && '✉️ Gửi tin nhắn'}
                {status === 'sending' && '⏳ Đang gửi...'}
                {status === 'sent' && '✅ Đã gửi thành công!'}
                {status === 'error' && '❌ Thử lại'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
