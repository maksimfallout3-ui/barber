import { MASTERS } from '../data/masters';
import './Masters.css';

export default function Masters() {
  return (
    <section id="masters" className="section masters">
      <div className="container">
        <span className="section-label">Команда</span>
        <h2 className="section-title">Мастера, которым доверяют</h2>
        <p className="section-subtitle">
          Профессиональные барберы с опытом — в отзывах гостей чаще всего упоминают Жусупа, Джони и Али.
        </p>

        <div className="masters__grid">
          {MASTERS.map((master, index) => (
            <article key={master.name} className="master-card card">
              <div className="master-card__avatar" aria-hidden="true">
                {master.name.charAt(0)}
              </div>
              <div className="master-card__header">
                <h3>{master.name}</h3>
                <span>{master.role}</span>
              </div>
              <p className="master-card__exp">Опыт: {master.experience}</p>
              <p className="master-card__desc">{master.description}</p>
              {master.highlight && <span className="master-card__highlight">{master.highlight}</span>}
              <a href="https://bs-garage.ru" className="btn btn-secondary master-card__btn" target="_blank" rel="noreferrer">
                Записаться к {master.name}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
