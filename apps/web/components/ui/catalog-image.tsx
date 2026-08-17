'use client';

import { useEffect, useState } from 'react';
import { isPublicLookImageUrl } from '@/lib/studio-styles';

export function CatalogImage({
  src,
  alt = '',
  className,
  fill = true,
}: {
  src: string;
  alt?: string;
  className?: string;
  sizes?: string;
  fill?: boolean;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const publicSrc = isPublicLookImageUrl(src) || src?.startsWith('data:image/') ? src : '';

  useEffect(() => {
    setFailed(false);
  }, [publicSrc]);

  if (!publicSrc || failed) {
    return <div className={fill ? `absolute inset-0 bg-[#EDE4D8] ${className ?? ''}` : `bg-[#EDE4D8] ${className ?? ''}`} />;
  }

  return (
    // Uploaded catalog photos may be Cloudinary files or, on localhost only, data URLs.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={publicSrc}
      alt={alt}
      className={fill ? `absolute inset-0 h-full w-full object-cover ${className ?? ''}` : className}
      referrerPolicy="no-referrer"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
