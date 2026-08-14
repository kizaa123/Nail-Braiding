import { Container } from '@/components/ui/section';

export default function Loading() {
  return (
    <Container className="py-24">
      <div className="h-10 w-48 animate-pulse bg-cream" />
      <div className="mt-6 h-64 animate-pulse bg-cream" />
    </Container>
  );
}
