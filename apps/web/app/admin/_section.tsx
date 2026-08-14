import Link from 'next/link';
import { Container } from '@/components/ui/section';

export default function AdminSection({ title, endpoint }: { title: string; endpoint: string }) {
  return (
    <Container className="py-12 md:py-20">
      <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-champagne/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#8C6D14]">
            Admin Executive Suite
          </span>
          <h1 className="mt-3 font-display text-4xl font-normal text-ink md:text-5xl">{title}</h1>
        </div>
        <Link
          href="/admin"
          className="self-start rounded-full border border-ink/10 bg-paper px-4 py-2 text-xs font-semibold text-ink hover:border-champagne/50 transition-all md:self-auto"
        >
          ← Back to Admin Console
        </Link>
      </div>

      <div className="mt-8 rounded-3xl border border-ink/8 bg-paper p-8 shadow-sm">
        <p className="text-sm text-muted leading-relaxed">
          Protected administrative control route. Operations are secured via server-side session tokens enforcing the <span className="font-mono text-xs font-bold text-ink bg-ivory px-2 py-1 rounded">ADMIN</span> role.
        </p>
        <div className="mt-4 rounded-xl border border-ink/6 bg-ivory p-4 font-mono text-xs text-muted">
          Endpoint target: <span className="font-semibold text-ink">{endpoint}</span>
        </div>
      </div>
    </Container>
  );
}

