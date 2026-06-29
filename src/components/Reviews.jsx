import { useState } from 'react';
import { INITIAL_VISIBLE, REVIEW_ASPECTS, YANDEX_REVIEWS } from '../data/reviews';
import { SITE } from '../data/site';
import './Reviews.css';

const PREVIEW_LENGTH = 220;

function Stars({ rating, size = 'md' }) {
  return (
    <div className={`stars stars--${size}`} aria-label={`Оценка ${rating} из 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? 'stars__item stars__item--filled' : 'stars__item'}>
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > PREVIEW_LENGTH;
  const visibleText = expanded || !isLong ? review.text : `${review.text.slice(0, PREVIEW_LENGTH).trim()}…`;

  const initials = review.author
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="review-card card">
      <div className="review-card__header">
        <div className="review-card__author">
          {review.avatar ? (
            <img src={review.avatar} alt="" className="review-card__avatar" loading="lazy" />
          ) : (
            <div className="review-card__avatar review-card__avatar--fallback">{initials}</div>
          )}
          <div>
            <strong>{review.author}</strong>
            <span>{review.date}</span>
          </div>
        </div>
        <Stars rating={review.rating} size="sm" />
      </div>

      <p className="review-card__text">{visibleText}</p>

      {isLong && (
        <button type="button" className="review-card__toggle" onClick={() => setExpanded((v) => !v)}>
          {expanded ? 'Свернуть' : 'Читать полностью'}
        </button>
      )}

      <div className="review-card__footer">
        <span className="review-card__source">{review.source}</span>
      </div>
    </article>
  );
}

export default function Reviews() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const visibleReviews = YANDEX_REVIEWS.slice(0, visibleCount);
  const hasMore = visibleCount < YANDEX_REVIEWS.length;

  return (
    <section id="reviews" className="section reviews">
      <div className="container">
        <span className="section-label">Отзывы</span>
        <div className="reviews__header">
          <div>
            <h2 className="section-title">Что говорят гости</h2>
            <p className="section-subtitle reviews__subtitle">
              Рейтинг {SITE.rating.toFixed(1)} — {SITE.reviewsCount} отзывов с{' '}
              <a href={SITE.yandexMapsUrl} target="_blank" rel="noreferrer">
                Яндекс Карт
              </a>
              . Ниже — реальные отзывы посетителей барбершопа.
            </p>
          </div>

          <div className="reviews__summary card">
            <div className="reviews__score">{SITE.rating.toFixed(1)}</div>
            <Stars rating={5} />
            <span>{SITE.reviewsCount} отзывов</span>
            <a href={SITE.yandexMapsUrl} target="_blank" rel="noreferrer" className="btn btn-secondary reviews__link-btn">
              Все на Яндекс Картах
            </a>
          </div>
        </div>

        <div className="reviews__aspects">
          {REVIEW_ASPECTS.map((aspect) => (
            <div key={aspect.name} className="reviews__aspect card">
              <div className="reviews__aspect-top">
                <span>{aspect.name}</span>
                <strong>{aspect.positive}%</strong>
              </div>
              <div className="reviews__aspect-bar">
                <span style={{ width: `${aspect.positive}%` }} />
              </div>
              <small>{aspect.count} отзывов</small>
            </div>
          ))}
        </div>

        <div className="reviews__list">
          {visibleReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        <div className="reviews__actions">
          {hasMore ? (
            <button type="button" className="btn btn-secondary" onClick={() => setVisibleCount(YANDEX_REVIEWS.length)}>
              Показать ещё отзывы ({YANDEX_REVIEWS.length - visibleCount})
            </button>
          ) : (
            <a href={SITE.yandexMapsUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
              Больше отзывов на Яндекс Картах
            </a>
          )}
          <a href={SITE.yandexMapsUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
            Оставить отзыв
          </a>
        </div>
      </div>
    </section>
  );
}
