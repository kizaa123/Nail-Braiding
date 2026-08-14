export function Container({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-6 md:px-10 ${className}`}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  action,
  dark = false,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  action?: React.ReactNode;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <div className={`mb-12 flex flex-col ${center ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'} gap-6`}>
      <div className={`max-w-2xl ${center ? 'mx-auto' : ''}`}>
        {eyebrow ? (
          <div className={`mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${dark ? 'bg-champagne/15 text-champagne-light border border-champagne/30' : 'bg-champagne/10 text-[#8C6D14] border border-champagne/20'}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-champagne animate-pulse" />
            {eyebrow}
          </div>
        ) : null}
        <h2 className={`font-display text-4xl leading-[1.05] tracking-tight md:text-5xl lg:text-6xl ${dark ? 'text-ivory' : 'text-ink'}`}>
          {title}
        </h2>
        {body ? <p className={`mt-4 text-base md:text-lg leading-relaxed ${dark ? 'text-ivory/70' : 'text-muted'}`}>{body}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

