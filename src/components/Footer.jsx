import { SITE } from '../data/site';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <img src={SITE.logo} alt="" width="48" height="48" />
          <div>
            <strong>{SITE.fullName}</strong>
            <span>{SITE.addressShort}</span>
          </div>
        </div>

        <div className="footer__links">
          <a href={SITE.siteUrl} target="_blank" rel="noreferrer">
            bs-garage.ru
          </a>
          <a href={SITE.yandexMapsUrl} target="_blank" rel="noreferrer">
            Яндекс Карты
          </a>
          <a href={SITE.social.vk} target="_blank" rel="noreferrer">
            VK
          </a>
          <a href={SITE.social.telegram} target="_blank" rel="noreferrer">
            Telegram
          </a>
          <a href={`tel:${SITE.phoneMain}`}>{SITE.phones[0]}</a>
        </div>

        <p className="footer__copy">© {year} {SITE.fullName}. Все права защищены.</p>
      </div>
    </footer>
  );
}
