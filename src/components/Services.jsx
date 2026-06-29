import { useEffect, useState } from 'react';
import {
  formatPrice,
  INCLUDED_EXTRAS,
  SERVICE_CATEGORIES,
  SERVICES_INITIAL_COUNT,
} from '../data/services';
import { SITE } from '../data/site';
import './Services.css';

function isTopBarber(name) {
  return name.includes('ТОП Барбер');
}

export default function Services() {
  const [activeTab, setActiveTab] = useState(SERVICE_CATEGORIES[0].id);
  const [expanded, setExpanded] = useState(false);

  const activeCategory =
    SERVICE_CATEGORIES.find((cat) => cat.id === activeTab) ?? SERVICE_CATEGORIES[0];

  useEffect(() => {
    setExpanded(false);
  }, [activeTab]);

  const visibleItems = expanded
    ? activeCategory.items
    : activeCategory.items.slice(0, SERVICES_INITIAL_COUNT);

  const hiddenCount = activeCategory.items.length - SERVICES_INITIAL_COUNT;
  const hasMore = hiddenCount > 0;

  return (
    <section id="services" className="section services">
      <div className="container">
        <span className="section-label">Услуги и цены</span>
        <h2 className="section-title">Всё для вашего образа</h2>
        <p className="section-subtitle">
          Классические и современные мужские стрижки, борода, бритьё и дополнительные процедуры.
        </p>

        <div className="services__tabs" role="tablist" aria-label="Категории услуг">
          {SERVICE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={activeTab === category.id}
              className={`services__tab ${activeTab === category.id ? 'services__tab--active' : ''}`}
              onClick={() => setActiveTab(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="services__panel" role="tabpanel">
          <div className="services__grid">
            {visibleItems.map((item) => (
              <article
                key={item.name}
                className={`service-card card ${isTopBarber(item.name) ? 'service-card--top' : ''}`}
              >
                {isTopBarber(item.name) && <span className="service-card__badge">ТОП Барбер</span>}
                <h4 className="service-card__title">{item.name}</h4>
                <p className="service-card__desc">{activeCategory.label}</p>
                <div className="service-card__footer">
                  <span className="service-card__price">{formatPrice(item.price)}</span>
                  <a href={SITE.bookingUrl} className="btn btn-ghost" target="_blank" rel="noreferrer">
                    Записаться →
                  </a>
                </div>
              </article>
            ))}
          </div>

          {hasMore && (
            <div className="services__more">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded
                  ? 'Свернуть'
                  : `Показать все услуги (+${hiddenCount})`}
              </button>
            </div>
          )}
        </div>

        <div className="services__extras card">
          <h3>Дополнительно включено</h3>
          <div className="services__extras-list">
            {INCLUDED_EXTRAS.map((extra) => (
              <span key={extra}>{extra}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
