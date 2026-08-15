import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/section';

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-xs tracking-[0.3em] text-champagne">404</p>
      <h1 className="mt-4 font-display text-6xl">This look isn’t here.</h1>
      <p className="mt-4 text-muted">The page may have moved, or the look hasn’t been published yet.</p>
      <Button href="/styles" className="mt-8">
        Browse atelier
      </Button>
    </Container>
  );
}
