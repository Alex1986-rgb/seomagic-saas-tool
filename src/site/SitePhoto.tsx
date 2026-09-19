import React from 'react';
import { PHOTOS } from './photos';

/**
 * Фото сайта в рамке-чертеже с дуотоном — перевод `<image-slot>` макета в обычный <img>.
 *
 * Пропорции задаёт вызывающий (aspect — как у рамки в макете), кадр кадрируется object-fit: cover.
 * Подпись автора Unsplash выводится поверх снимка — это условие лицензии, убирать нельзя.
 * lazy + decoding async: на блоге 28 снимков, грузить их все с первым экраном незачем.
 */
export const SitePhoto: React.FC<{
  id: keyof typeof PHOTOS | string;
  aspect: string;
  alt?: string;
  style?: React.CSSProperties;
  eager?: boolean;
  /** Без рамки-чертежа — когда рамку уже рисует родитель (карточка). */
  bare?: boolean;
}> = ({ id, aspect, alt, style, eager, bare }) => {
  const photo = PHOTOS[id];
  const box: React.CSSProperties = { padding: 0, aspectRatio: aspect, overflow: 'hidden', position: 'relative', ...style };
  const inner = (
    <div className="duotone site-photo" style={{ width: '100%', height: '100%', position: 'relative' }}>
      {photo ? (
        <img
          src={photo.src}
          alt={alt ?? photo.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      ) : (
        <div style={{ width: '100%', height: '100%', background: 'color-mix(in srgb,var(--color-text) 6%,transparent)' }} />
      )}
      {photo?.credit && (
        <span data-credit>
          {photo.creditHref ? (
            <a href={`${photo.creditHref}?utm_source=seomarket&utm_medium=referral`} target="_blank" rel="noopener noreferrer">
              {photo.credit.replace(/^Photo by /, '').replace(/ on Unsplash$/, '')}
            </a>
          ) : (
            photo.credit
          )}
          {' · '}
          <a href="https://unsplash.com/?utm_source=seomarket&utm_medium=referral" target="_blank" rel="noopener noreferrer">
            Unsplash
          </a>
        </span>
      )}
    </div>
  );
  if (bare) return <div style={box}>{inner}</div>;
  return (
    <div className="blueprint" style={{ ...box, overflow: 'visible' }}>
      <i className="corner tl" />
      <i className="corner tr" />
      <i className="corner bl" />
      <i className="corner br" />
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>{inner}</div>
    </div>
  );
};

export default SitePhoto;
