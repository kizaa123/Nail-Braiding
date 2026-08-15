import Image from 'next/image';
import Link from 'next/link';

export const STUDIO_LOGO_SRC = '/kas-beauty-plus-logo-gold.png';
export const STUDIO_MOTTO = "adding values to God's creation";
export const STUDIO_LOGO_ALT = 'KAS Beauty Plus — Hair & Nails';

const sizes = {
  sm: { px: 96, className: 'h-[4.75rem] w-[4.75rem] md:h-24 md:w-24' },
  md: { px: 128, className: 'h-24 w-24 md:h-32 md:w-32' },
  lg: { px: 176, className: 'h-32 w-32 md:h-44 md:w-44' },
} as const;

type StudioLogoProps = {
  href?: string | null;
  size?: keyof typeof sizes;
  showMotto?: boolean;
  mottoTone?: 'light' | 'dark';
  className?: string;
};

export function StudioLogo({
  href = '/',
  size = 'sm',
  showMotto = true,
  mottoTone = 'light',
  className = '',
}: StudioLogoProps) {
  const dim = sizes[size];
  const mottoColor = mottoTone === 'dark' ? 'text-[#8C6D14]' : 'text-[#E8D5A3]';
  const mottoSize =
    size === 'lg'
      ? 'text-lg md:text-2xl'
      : size === 'md'
        ? 'text-sm md:text-base'
        : 'text-[9px] leading-tight md:text-[11px]';

  const mark = (
    <span className={`inline-flex min-w-0 flex-col items-center text-center ${className}`}>
      <span className={`relative shrink-0 overflow-hidden rounded-full ${dim.className}`}>
        <Image
          src={STUDIO_LOGO_SRC}
          alt={STUDIO_LOGO_ALT}
          width={dim.px}
          height={dim.px}
          className="h-full w-full object-cover"
          priority={size === 'sm'}
        />
      </span>
      {showMotto ? (
        <span className={`mt-1 max-w-[11rem] font-script italic ${mottoSize} ${mottoColor} md:max-w-[15rem]`}>
          {STUDIO_MOTTO}
        </span>
      ) : null}
    </span>
  );

  if (!href) return mark;

  return (
    <Link href={href} className="min-w-0" aria-label={`${STUDIO_LOGO_ALT}. ${STUDIO_MOTTO}`}>
      {mark}
    </Link>
  );
}
