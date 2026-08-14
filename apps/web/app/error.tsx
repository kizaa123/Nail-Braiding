'use client';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/section';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <Container className="py-24 text-center">
      <h1 className="font-display text-6xl">Something went wrong.</h1>
      <p className="mt-4 text-muted">Please try again.</p>
      <Button className="mt-8" onClick={reset}>
        Retry
      </Button>
    </Container>
  );
}
