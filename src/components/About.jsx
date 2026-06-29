import { SITE } from '../data/site';
import './About.css';

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="container about__grid">
        <div className="about__media">
          <img src={SITE.interiorImage} alt="Интерьер барбершопа" className="about__image" loading="lazy" />
          <div className="about__floating card">
            <span className="about__floating-label">Рейтинг</span>
            <strong>{SITE.rating.toFixed(1)} / 5.0</strong>
            <span>{SITE.reviewsCount} отзывов</span>
          </div>
        </div>

        <div className="about__content">
          <span className="section-label">О барбершопе</span>
          <h2 className="section-title">Место, где стиль встречается с атмосферой</h2>
          <p className="about__lead">{SITE.description}</p>

          <ul className="about__features">
            {SITE.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>

          <div className="about__promos">
            {SITE.promos.map((promo) => (
              <div key={promo.title} className="about__promo card">
                <span className="about__promo-title">{promo.title}</span>
                <p>{promo.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
