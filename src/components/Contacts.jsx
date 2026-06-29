import { SITE } from '../data/site';
import './Contacts.css';

export default function Contacts() {
  return (
    <section id="contacts" className="section contacts">
      <div className="container contacts__grid">
        <div className="contacts__info">
          <span className="section-label">Контакты</span>
          <h2 className="section-title">Приходите в гости</h2>
          <p className="section-subtitle">
            Барбершоп в закрытом комплексе недалеко от метро «Вавиловская». Есть парковка и онлайн-запись.
          </p>

          <div className="contacts__cards">
            <div className="contacts__card card">
              <span className="contacts__label">Адрес</span>
              <p>{SITE.address}</p>
              <div className="contacts__metro">
                {SITE.metro.map((m) => (
                  <span key={m.name} style={{ '--metro-color': m.color }}>
                    <i /> {m.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="contacts__card card">
              <span className="contacts__label">Телефоны</span>
              {SITE.phones.map((phone) => (
                <a key={phone} href={`tel:${phone.replace(/[^\d+]/g, '')}`}>
                  {phone}
                </a>
              ))}
            </div>

            <div className="contacts__card card">
              <span className="contacts__label">Сайт</span>
              <a href={SITE.siteUrl} target="_blank" rel="noreferrer" className="contacts__site">
                bs-garage.ru
              </a>
            </div>

            <div className="contacts__card card">
              <span className="contacts__label">Режим работы</span>
              <p>{SITE.hours}</p>
            </div>
          </div>

          <div className="contacts__social">
            <a href={SITE.social.vk} target="_blank" rel="noreferrer" className="btn btn-secondary">
              VK
            </a>
            <a href={SITE.social.telegram} target="_blank" rel="noreferrer" className="btn btn-secondary">
              Telegram
            </a>
            <a href={SITE.social.whatsapp} target="_blank" rel="noreferrer" className="btn btn-secondary">
              WhatsApp
            </a>
            <a href={SITE.bookingUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
              Записаться
            </a>
          </div>
        </div>

        <div className="contacts__map card">
          <iframe
            title="Барбершоп Гараж на карте"
            src="https://yandex.ru/map-widget/v1/?ll=37.538671%2C55.681605&z=16&l=map&pt=37.538671%2C55.681605,pm2rdm"
            loading="lazy"
            allowFullScreen
          />
          <a href={SITE.yandexMapsUrl} target="_blank" rel="noreferrer" className="contacts__map-link">
            Открыть в Яндекс Картах →
          </a>
        </div>
      </div>
    </section>
  );
}
