'use client';

import { useEffect, useState } from 'react';

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

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return <div className={fill ? `absolute inset-0 bg-[#EDE4D8] ${className ?? ''}` : `bg-[#EDE4D8] ${className ?? ''}`} />;
  }

  return (
    // Uploaded catalog photos may be data URLs, Cloudinary files, or local look paths.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={fill ? `absolute inset-0 h-full w-full object-cover ${className ?? ''}` : className}
      onError={() => setFailed(true)}
    />
  );
}
