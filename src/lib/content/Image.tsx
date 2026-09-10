import type { ResolvedImage } from '../../build/types';
export function Image({ image, priority = false }: { image: ResolvedImage; priority?: boolean }) {
  return (
    <figure className="editorial-image">
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes="(max-width: 720px) 100vw, 900px"
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
      <figcaption>
        {image.caption && <span>{image.caption} </span>}
        <span>
          Crédito: {image.credit}
          {image.license ? ` · ${image.license}` : ''}
        </span>
      </figcaption>
    </figure>
  );
}
