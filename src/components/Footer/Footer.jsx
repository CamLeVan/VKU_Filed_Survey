const SOCIAL_LINKS = [
  { icon: '🐙', href: 'https://github.com/CamLeVan', label: 'GitHub' },
  { icon: '💼', href: 'https://linkedin.com/in/camlevan', label: 'LinkedIn' },
  { icon: '📧', href: 'mailto:levancamp@gmail.com', label: 'Email' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" aria-label="Footer">
      <div className="footer-inner">
        <div className="footer-text">
          <span>© {year} </span>
          <strong>Lê Văn Cảm</strong>
          <span> · Built with ❤️ using React + Matter.js · Deployed on Cloudflare Pages</span>
        </div>

        <nav className="footer-social" aria-label="Social links">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label={link.label}
            >
              {link.icon}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
