import Image from 'next/image';
import { editorialImages } from '@/lib/content';

export function MarqueeGallery() {
  const frames = [...editorialImages.braids, ...editorialImages.nails];
  const loop = [...frames, ...frames];
  return (
    <div className="relative overflow-hidden py-6" aria-hidden="true">
      {/* Edge Fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ivory to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ivory to-transparent" />

      <div className="marquee">
        {loop.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="group relative h-56 w-44 shrink-0 overflow-hidden rounded-2xl border border-ink/8 bg-cream shadow-sm transition-transform duration-500 hover:scale-105 md:h-72 md:w-56"
          >
            <Image src={src} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="224px" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute bottom-3 left-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="glass-badge rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ivory">
                Featured Look
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

