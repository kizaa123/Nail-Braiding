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
  script,
  body,
  action,
  dark = false,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  script?: string;
  body?: string;
  action?: React.ReactNode;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <div className={`mb-10 flex flex-col ${center ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'} gap-6`}>
      <div className={`max-w-2xl ${center ? 'mx-auto' : ''}`}>
        {eyebrow ? (
          <div
            className={`mb-3.5 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.2em] ${
              dark
                ? 'border border-white/20 bg-white/5 text-white/90'
                : 'border border-[#E2D5C8] bg-[#EFE7DE] text-[#7A665A]'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#D98282]" />
            {eyebrow}
          </div>
        ) : null}
        <h2 className={`font-display text-[1.85rem] font-normal leading-[1.08] tracking-tight md:text-5xl lg:text-[3.25rem] ${dark ? 'text-white' : 'text-[#171211]'}`}>
          {title}
          {script ? (
            <span className="ml-2 font-script text-[1.85rem] font-normal italic text-[#D98282] md:text-5xl lg:text-[3.25rem]">
              {script}
            </span>
          ) : null}
        </h2>
        
        {/* Subtle Diamond Sparkle Accent */}
        <div className={`flex items-center gap-2 mt-2 mb-2 text-[#C9A46A] ${center ? 'justify-center' : ''}`}>
          <span className="h-px w-6 bg-[#C9A46A]/35" />
          <span className="text-[9px]">✦</span>
          <span className="h-px w-6 bg-[#C9A46A]/35" />
        </div>

        {body ? (
          <p className={`text-sm md:text-[15px] leading-relaxed font-light ${dark ? 'text-white/70' : 'text-[#7A6E68]'}`}>
            {body}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

