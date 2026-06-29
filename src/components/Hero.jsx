import { SITE } from '../data/site';
import './Hero.css';

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero__bg">
        <img src={SITE.heroImage} alt="Интерьер барбершопа Гараж" className="hero__image" />
        <div className="hero__overlay" />
      </div>

      <div className="container hero__content">
        <div className="hero__badge">
          <span className="hero__rating">★ {SITE.rating.toFixed(1)}</span>
          <span>{SITE.reviewsCount} отзывов на Яндекс Картах</span>
        </div>

        <h1 className="hero__title">
          Барбершоп
          <em> «Гараж»</em>
        </h1>

        <p className="hero__text">{SITE.tagline}. Классические и современные стрижки, борода, кофе и атмосфера.</p>

        <div className="hero__actions">
          <a href={SITE.bookingUrl} className="btn btn-primary" target="_blank" rel="noreferrer">
            Записаться онлайн
          </a>
          <button className="btn btn-secondary" onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}>
            Смотреть отзывы
          </button>
        </div>

        <div className="hero__stats">
          <div className="hero__stat">
            <strong>09:00 — 21:00</strong>
            <span>Каждый день</span>
          </div>
          <div className="hero__stat">
            <strong>−20%</strong>
            <span>Первое посещение</span>
          </div>
          <div className="hero__stat">
            <strong>PS5</strong>
            <span>Game room</span>
          </div>
        </div>
      </div>

      <div className="hero__scroll-hint" aria-hidden="true">
        <span>Листайте</span>
      </div>
    </section>
  );
}
