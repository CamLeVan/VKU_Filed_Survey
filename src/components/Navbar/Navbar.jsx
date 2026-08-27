import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Giới thiệu', href: '#about' },
  { label: 'Kỹ năng', href: '#skills' },
  { label: 'Dự án', href: '#projects' },
  { label: 'Giải thưởng', href: '#awards' },
  { label: 'Sở thích', href: '#hobbies' },
  { label: 'Liên hệ', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);

      // Detect active section
      const sections = ['about', 'skills', 'projects', 'awards', 'hobbies', 'contact'];
      let current = '';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} aria-label="Main navigation">
        <div className="navbar-inner">
          {/* Logo */}
          <div
            className="navbar-logo"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            role="button"
            tabIndex={0}
            aria-label="Go to top"
          >
            &lt;LeVanCam /&gt;
          </div>

          {/* Desktop Links */}
          <ul className="navbar-links">
            {NAV_LINKS.map((link) => {
              const id = link.href.replace('#', '');
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={activeSection === id ? 'active' : ''}
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* CTA */}
          <div className="navbar-cta">
            <a
              href="#contact"
              className="btn-nav"
              onClick={(e) => handleNavClick(e, '#contact')}
            >
              Hire Me 🚀
            </a>
          </div>

          {/* Hamburger */}
          <button
            className={`navbar-hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>

        {/* Mobile Menu */}
        <ul className={`navbar-mobile ${menuOpen ? 'open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              style={{ color: 'var(--accent-primary)', fontWeight: 700 }}
            >
              ✉️ Hire Me
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
