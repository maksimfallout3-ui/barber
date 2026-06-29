import { useEffect, useState } from 'react';
import { NAV_ITEMS, SITE } from '../data/site';
import './Header.css';

export default function Header({ activeSection }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navigate = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        <div className="container header__inner">
          <button className="header__brand" onClick={() => navigate('hero')} aria-label="На главную">
            <img src={SITE.logo} alt="" className="header__logo" width="40" height="40" />
            <div className="header__brand-text">
              <span className="header__name">{SITE.fullName}</span>
              <span className="header__city">Москва · м. Вавиловская</span>
            </div>
          </button>

          <nav className="header__nav" aria-label="Основная навигация">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`header__link ${activeSection === item.id ? 'header__link--active' : ''}`}
                onClick={() => navigate(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="header__actions">
            <a href={`tel:${SITE.phoneMain}`} className="header__phone">
              {SITE.phones[0]}
            </a>
            <a href={SITE.bookingUrl} className="btn btn-primary header__cta" target="_blank" rel="noreferrer">
              Записаться
            </a>
            <button
              className={`header__burger ${menuOpen ? 'header__burger--open' : ''}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-nav ${menuOpen ? 'mobile-nav--open' : ''}`} aria-hidden={!menuOpen}>
        <nav className="mobile-nav__list">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`mobile-nav__link ${activeSection === item.id ? 'mobile-nav__link--active' : ''}`}
              onClick={() => navigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mobile-nav__footer">
          <a href={`tel:${SITE.phoneMain}`} className="mobile-nav__phone">
            {SITE.phones[0]}
          </a>
          <a href={SITE.bookingUrl} className="btn btn-primary" target="_blank" rel="noreferrer">
            Записаться онлайн
          </a>
        </div>
      </div>
    </>
  );
}
