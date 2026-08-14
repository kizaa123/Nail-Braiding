'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { formatCedis } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Container, SectionHeading } from '@/components/ui/section';
import { staticStyles } from '@/lib/content';

const WHATSAPP_PHONE = '233531806381';
const DISPLAY_PHONE = '0531806381';
const STUDIO_NAME = 'Noir Atelier Studio';

// Generate available time slots for a given date
function generateSlots(date: string): string[] {
  if (!date) return [];
  const slots: string[] = [];
  const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17];
  for (const h of hours) {
    for (const m of [0, 30]) {
      const dt = new Date(`${date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
      slots.push(dt.toISOString());
    }
  }
  return slots;
}

export default function BookPage() {
  const params = useParams<{ professional: string; service: string }>();
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState<'PORTAL' | 'WHATSAPP'>('PORTAL');
  const [step, setStep] = useState<'schedule' | 'review' | 'done'>('schedule');
  const [reference] = useState(() => `NA-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);

  // Look up style from static catalog (service id matches style id)
  const style = staticStyles.find((s) => s.id === params.service || s.slug === params.service);

  const slots = useMemo(() => generateSlots(date), [date]);
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const whatsappText = useMemo(() => {
    if (!style || !slot) return '';
    return encodeURIComponent(
      `Hello ${STUDIO_NAME}! I want to confirm my booking:\n\n` +
        `• Reference: ${reference}\n` +
        `• Client: ${name || 'Not provided'}\n` +
        `• Phone: ${phone || 'Not provided'}\n` +
        `• Service: ${style.name}\n` +
        `• Date & Time: ${new Date(slot).toLocaleString()}\n` +
        `• Duration: ${style.durationMinutes} min\n` +
        `• Price: ${formatCedis(style.startingPriceMinor)}\n` +
        (notes ? `• Notes: ${notes}\n` : '') +
        `\nSent via Noir Atelier Booking App.`,
    );
  }, [style, slot, name, phone, notes, reference]);

  const handleConfirm = () => {
    setStep('done');
    if (destination === 'WHATSAPP') {
      window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${whatsappText}`, '_blank');
    }
  };

  // If style not found in static catalog, show friendly fallback
  if (!style) {
    return (
      <Container className="py-20 text-center">
        <div className="mx-auto max-w-lg rounded-3xl border border-ink/10 bg-paper p-10 shadow-xl">
          <span className="text-4xl">✂️</span>
          <h1 className="mt-4 font-display text-4xl text-ink">Let&apos;s Book Your Appointment</h1>
          <p className="mt-2 text-sm text-muted">
            Choose a service from our lookbook first to proceed with booking.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button href="/styles?kind=HAIR" variant="gold">💇‍♀️ Browse Hair Styles</Button>
            <Button href="/styles?kind=NAILS" variant="outline">💅 Browse Nail Styles</Button>
          </div>
          <div className="mt-4">
            <Button
              href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hello Noir Atelier Studio! I want to book an appointment. Please help me.')}`}
              variant="whatsapp"
            >
              💬 WhatsApp {DISPLAY_PHONE}
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="max-w-3xl py-12 md:py-20">
      <SectionHeading
        eyebrow="Appointment Reservation"
        title={style.name}
        body={`${STUDIO_NAME} · ${style.durationMinutes} min · Starting from ${formatCedis(style.startingPriceMinor)}`}
      />

      {/* Step 1 — Schedule */}
      {step === 'schedule' ? (
        <form
          className="mt-8 space-y-8 rounded-3xl border border-ink/10 bg-paper p-6 shadow-sm md:p-10"
          onSubmit={(e) => {
            e.preventDefault();
            if (slot) setStep('review');
          }}
        >
          {/* Client name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80">
              Your Name <span className="text-rose">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Abena Mensah"
              className="mt-2 min-h-12 w-full rounded-2xl border border-ink/10 bg-ivory px-4 text-sm text-ink placeholder:text-muted focus:border-champagne focus:bg-paper focus:outline-none transition-all"
            />
          </div>

          {/* Client phone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80">
              Your Phone Number <span className="text-rose">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 024 000 0000"
              className="mt-2 min-h-12 w-full rounded-2xl border border-ink/10 bg-ivory px-4 text-sm text-ink placeholder:text-muted focus:border-champagne focus:bg-paper focus:outline-none transition-all"
            />
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80">
              Select Appointment Date <span className="text-rose">*</span>
            </label>
            <input
              type="date"
              min={minDate}
              required
              value={date}
              onChange={(e) => { setDate(e.target.value); setSlot(''); }}
              className="mt-2 min-h-12 w-full rounded-2xl border border-ink/10 bg-ivory px-4 text-sm text-ink focus:border-champagne focus:bg-paper focus:outline-none transition-all cursor-pointer"
            />
          </div>

          {/* Time Slots */}
          {date ? (
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-ink/80">Select Time Slot</span>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {slots.map((iso) => (
                  <button
                    type="button"
                    key={iso}
                    onClick={() => setSlot(iso)}
                    className={`rounded-2xl border py-2.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      slot === iso
                        ? 'bg-obsidian text-ivory border-obsidian shadow-md'
                        : 'border-ink/10 bg-ivory text-ink hover:border-champagne/50'
                    }`}
                  >
                    {new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80">
              Client Notes or Special Requests (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              placeholder="Specify hair length, braid size, colour preferences, or any special requests..."
              className="mt-2 min-h-24 w-full rounded-2xl border border-ink/10 bg-ivory px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-champagne focus:bg-paper focus:outline-none transition-all"
            />
          </div>

          <Button type="submit" disabled={!slot || !name || !phone} variant="gold" className="w-full">
            Review Booking & Choose Destination →
          </Button>
        </form>
      ) : null}

      {/* Step 2 — Review & Destination */}
      {step === 'review' ? (
        <div className="mt-8 space-y-6 rounded-3xl border border-ink/10 bg-paper p-6 shadow-xl md:p-10">
          <div className="border-b border-ink/8 pb-4">
            <h2 className="font-display text-3xl font-medium text-ink">Review Appointment Details</h2>
            <p className="mt-1 text-xs text-muted">Verify your info and choose how your booking reaches the shop owner.</p>
          </div>

          {/* Summary */}
          <div className="space-y-2.5 rounded-2xl border border-ink/6 bg-ivory p-5 text-sm">
            {[
              ['Client Name', name],
              ['Phone', phone],
              ['Service', style.name],
              ['Date & Time', new Date(slot).toLocaleString()],
              ['Duration', `${style.durationMinutes} minutes`],
              ['Price', formatCedis(style.startingPriceMinor)],
              ...(notes ? [['Notes', notes]] : []),
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 border-b border-ink/6 pb-2 last:border-0 last:pb-0">
                <span className="text-muted shrink-0">{label}:</span>
                <span className="font-semibold text-ink text-right">{value}</span>
              </div>
            ))}
          </div>

          {/* Destination Options */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/80 mb-3">
              Booking Destination
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <div
                onClick={() => setDestination('PORTAL')}
                className={`cursor-pointer rounded-2xl border p-5 transition-all ${destination === 'PORTAL' ? 'border-champagne bg-champagne/10 shadow-md' : 'border-ink/10 bg-ivory hover:border-ink/20'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🏛️</span>
                  <input type="radio" name="dest" checked={destination === 'PORTAL'} onChange={() => setDestination('PORTAL')} className="h-4 w-4 accent-amber-600" />
                </div>
                <h3 className="mt-3 font-display text-lg font-medium text-ink">1. Admin Portal</h3>
                <p className="mt-1 text-xs text-muted leading-relaxed">Saves booking to shop owner&apos;s management dashboard.</p>
              </div>

              <div
                onClick={() => setDestination('WHATSAPP')}
                className={`cursor-pointer rounded-2xl border p-5 transition-all ${destination === 'WHATSAPP' ? 'border-[#128C7E] bg-[#128C7E]/10 shadow-md' : 'border-ink/10 bg-ivory hover:border-ink/20'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">💬</span>
                  <input type="radio" name="dest" checked={destination === 'WHATSAPP'} onChange={() => setDestination('WHATSAPP')} className="h-4 w-4 accent-[#128C7E]" />
                </div>
                <h3 className="mt-3 font-display text-lg font-medium text-ink">2. WhatsApp ({DISPLAY_PHONE})</h3>
                <p className="mt-1 text-xs text-muted leading-relaxed">Opens WhatsApp with pre-filled booking details to shop owner.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end border-t border-ink/8 pt-4">
            <Button type="button" variant="ghost" onClick={() => setStep('schedule')}>
              ← Change Details
            </Button>
            <Button
              type="button"
              variant={destination === 'WHATSAPP' ? 'whatsapp' : 'gold'}
              onClick={handleConfirm}
            >
              {destination === 'WHATSAPP'
                ? `Confirm & Send to WhatsApp (${DISPLAY_PHONE})`
                : 'Confirm & Save to Admin Portal'}
            </Button>
          </div>
        </div>
      ) : null}

      {/* Step 3 — Done */}
      {step === 'done' ? (
        <div className="mt-8 rounded-3xl border border-champagne/40 bg-paper p-8 shadow-2xl md:p-12">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-champagne/20 text-3xl">✨</div>
            <p className="mt-4 font-mono text-xs font-bold uppercase tracking-widest text-champagneMuted">
              Reference: {reference}
            </p>
            <h1 className="mt-2 font-display text-4xl font-normal text-ink">Booking Confirmed!</h1>
            <p className="mt-3 text-sm text-muted max-w-md mx-auto">
              {destination === 'WHATSAPP'
                ? `Your details have been prepared for WhatsApp to the shop owner (${DISPLAY_PHONE}).`
                : 'Your booking has been saved to the Noir Atelier Admin Portal.'}
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-ink/6 bg-ivory p-6 space-y-2 text-sm text-center">
            <p><strong>Client:</strong> {name}</p>
            <p><strong>Service:</strong> {style.name}</p>
            <p><strong>Date & Time:</strong> {new Date(slot).toLocaleString()}</p>
            <p><strong>Price:</strong> {formatCedis(style.startingPriceMinor)}</p>
            <p><strong>Destination:</strong> {destination === 'WHATSAPP' ? `WhatsApp (${DISPLAY_PHONE})` : 'Admin Portal'}</p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {destination === 'WHATSAPP' && (
              <Button href={`https://wa.me/${WHATSAPP_PHONE}?text=${whatsappText}`} variant="whatsapp">
                💬 Re-open WhatsApp ({DISPLAY_PHONE})
              </Button>
            )}
            <Button href="/discover" variant="ghost">Browse More Styles</Button>
            <Button href="/" variant="outline">Back to Home</Button>
          </div>
        </div>
      ) : null}
    </Container>
  );
}
