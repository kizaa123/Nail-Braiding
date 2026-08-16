import Image from 'next/image';

export function CatalogImage({
  src,
  alt,
  className,
  sizes,
  fill = true,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  fill?: boolean;
  priority?: boolean;
}) {
  if (!src) {
    return <div className={fill ? `absolute inset-0 bg-[#EDE4D8] ${className ?? ''}` : `bg-[#EDE4D8] ${className ?? ''}`} />;
  }

  if (src.startsWith('data:') || src.startsWith('blob:') || src.startsWith('http://') || src.startsWith('https://')) {
    return (
      // Uploaded catalog photos may be data URLs or hosted Supabase files.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={fill ? `absolute inset-0 h-full w-full object-cover ${className ?? ''}` : className} />
    );
  }

  return (
    <Image src={src} alt={alt} fill={fill} priority={priority} sizes={sizes} className={className} />
  );
}
