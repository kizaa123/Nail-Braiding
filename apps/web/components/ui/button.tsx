import Link from 'next/link';

const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ');

const variants = {
  primary:
    'bg-obsidian text-ivory hover:bg-espresso shadow-md hover:shadow-lg active:scale-[0.98] px-6 py-3 text-sm font-medium tracking-wider uppercase',
  gold:
    'bg-gradient-to-r from-champagne via-[#E5C158] to-champagne text-obsidian font-semibold hover:shadow-gold active:scale-[0.98] px-6 py-3 text-sm tracking-wider uppercase shadow-md',
  ghost:
    'border border-ink/15 bg-transparent text-ink hover:border-ink/40 hover:bg-ink/5 active:scale-[0.98] px-6 py-3 text-sm font-medium',
  outline:
    'border border-champagne/40 bg-transparent text-ink hover:border-champagne hover:bg-champagne/10 active:scale-[0.98] px-6 py-3 text-sm font-medium',
  glass:
    'glass-panel text-ink hover:bg-paper/90 shadow-sm active:scale-[0.98] px-6 py-3 text-sm font-medium',
  whatsapp:
    'bg-[#128C7E] text-white hover:bg-[#0e6e63] shadow-md hover:shadow-lg active:scale-[0.98] px-6 py-3 text-sm font-medium tracking-wide',
};

export function Button({
  href,
  children,
  variant = 'primary',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: keyof typeof variants;
}) {
  const classes = cx(
    'inline-flex items-center justify-center rounded-full transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none min-h-12 cursor-pointer',
    variants[variant],
    className,
  );
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

