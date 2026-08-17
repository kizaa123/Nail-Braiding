'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { formatCedis } from '@/lib/api';
import { CatalogImage } from '@/components/ui/catalog-image';
import {
  BOOKING_TIME_SLOTS,
  DISPLAY_PHONE,
  STUDIO_NAME,
  createStudioBooking,
  formatBookingDate,
  formatBookingTime,
  openWhatsAppBooking,
  type BookableLook,
} from '@/lib/studio-bookings';
import { useStudioProfile } from '@/hooks/use-studio-profile';
import { cachedWhatsAppPhone } from '@/lib/studio-profile';

function todayValue() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 10h18" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3v4M16 3v4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="7" y="13" width="3" height="3" rx="0.6" fill="currentColor" />
      <rect x="11.5" y="13" width="3" height="3" rx="0.6" fill="currentColor" />
    </svg>
  );
}

function SuccessCheck() {
  return (
    <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
      <span className="booking-check-ring absolute inset-0 rounded-full bg-[#2D6A4F]/20" />
      <svg className="booking-check h-20 w-20" viewBox="0 0 52 52" aria-hidden="true">
        <circle cx="26" cy="26" r="24" fill="#E8F5EE" />
        <circle
          className="booking-check-circle"
          cx="26"
          cy="26"
          r="24"
          fill="none"
          stroke="#2D6A4F"
          strokeWidth="2.5"
        />
        <path
          className="booking-check-mark"
          fill="none"
          stroke="#2D6A4F"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 27.2l7.2 7.2L36.4 20"
        />
      </svg>
    </div>
  );
}

export function BookingModal({
  open,
  look,
  destination = 'PORTAL',
  onClose,
}: {
  open: boolean;
  look: BookableLook | null;
  destination?: 'PORTAL' | 'WHATSAPP';
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [done, setDone] = useState<'PORTAL' | 'WHATSAPP' | null>(null);
  const [reference, setReference] = useState('');
  const [whatsappHref, setWhatsappHref] = useState('#');
  const [formError, setFormError] = useState('');
  const [mounted, setMounted] = useState(false);
  const minDate = useMemo(() => todayValue(), []);
  const { profile } = useStudioProfile();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setName('');
    setContact('');
    setDate('');
    setTime('');
    setLocation('');
    setNotes('');
    setDone(null);
    setReference('');
    setWhatsappHref('#');
    setFormError('');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!mounted || !open || !look) return null;

  const missingFields = () => {
    const missing: string[] = [];
    if (!name.trim()) missing.push('name');
    if (!date) missing.push('date');
    if (!time) missing.push('time');
    if (!location.trim()) missing.push('location');
    if (destination === 'PORTAL' && !contact.trim()) missing.push('contact');
    return missing;
  };

  const submit = (selectedDestination: 'PORTAL' | 'WHATSAPP') => {
    const missing = missingFields();
    if (missing.length) {
      setFormError(`Please add ${missing.join(', ')}.`);
      return;
    }
    setFormError('');
    const booking = createStudioBooking({
      look,
      clientName: name,
      clientPhone: selectedDestination === 'PORTAL' ? contact : undefined,
      location,
      scheduledDate: date,
      scheduledTime: time,
      notes,
      destination: selectedDestination,
    });
    let href = '#';
    if (selectedDestination === 'WHATSAPP') {
      try {
        href = openWhatsAppBooking({
          studioName: STUDIO_NAME,
          clientName: name,
          location,
          styleName: look.name,
          categoryName: look.categoryName,
          slug: look.slug,
          imageUrl: look.imageUrl,
          durationMinutes: look.durationMinutes,
          priceMinor: look.startingPriceMinor,
          scheduledDate: date,
          scheduledTime: time,
          notes,
        });
      } catch {
        href = `https://wa.me/${cachedWhatsAppPhone()}`;
      }
    }
    setReference(booking.reference);
    setWhatsappHref(href);
    setDone(selectedDestination);
  };

  const closeAfterSuccess = () => {
    onClose();
    router.push('/styles');
  };

  return createPortal(
    <div className={`fixed inset-0 z-[80] flex justify-center p-3 sm:items-center sm:p-6 ${done ? 'items-center pb-28' : 'items-end'}`}>
      <button
        type="button"
        aria-label="Close booking form"
        className="absolute inset-0 bg-[#171211]/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        className="relative z-10 max-h-[min(92dvh,720px)] w-full max-w-[420px] overflow-hidden overflow-y-auto no-scrollbar rounded-[28px] border border-[#EADBCE] bg-[#FAF7F2] shadow-[0_24px_60px_rgba(23,18,17,0.28)]"
      >
        <div className="flex items-center gap-3 border-b border-[#EADBCE] px-4 py-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-[#F7F1EA]">
            <CatalogImage src={look.imageUrl} alt="" className="object-cover" sizes="48px" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D98282]">
              {destination === 'WHATSAPP' ? 'Book via WhatsApp' : 'Book via Portal'}
            </p>
            <h2 id="booking-modal-title" className="truncate font-display text-xl leading-tight text-[#171211]">
              {look.name}
            </h2>
            <p className="text-[11px] text-[#A99B95]">
              {formatCedis(look.startingPriceMinor)} · {look.categoryName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#171211]/70 hover:bg-black/5"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {done ? (
          <div className="space-y-4 px-4 pb-6 pt-3 text-center sm:py-8">
            <SuccessCheck />
            <div className="booking-success-copy space-y-2">
              <p className="font-display text-3xl text-[#171211]">Booking confirmed</p>
              <p className="text-sm text-[#7A6E68]">
                {done === 'WHATSAPP'
                  ? `WhatsApp should open with this booking ready to send to ${profile.displayPhone || DISPLAY_PHONE}. Check the admin portal for the style image.`
                  : 'This booking is now on the studio portal board.'}
              </p>
              {done === 'PORTAL' ? (
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#A99B95]">Ref {reference}</p>
              ) : null}
            </div>
            <div className="booking-success-copy flex flex-col gap-2 pt-1">
              {done === 'WHATSAPP' ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#128C7E] text-xs font-bold uppercase tracking-[0.16em] text-white"
                >
                  Re-open WhatsApp
                </a>
              ) : null}
              <button
                type="button"
                onClick={closeAfterSuccess}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[#EADBCE] text-xs font-bold uppercase tracking-[0.16em] text-[#171211]"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form
            className="space-y-3 px-4 py-4"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              submit(destination);
            }}
          >
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">
                Name <span className="text-[#D98282]">*</span>
              </span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your full name"
                className="mt-1 min-h-11 w-full rounded-2xl border border-[#EADBCE] bg-white px-3 text-sm text-[#171211] outline-none placeholder:text-[#A99B95] focus:border-[#D98282]"
              />
            </label>

            {destination === 'PORTAL' ? (
              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">
                  Contact <span className="text-[#D98282]">*</span>
                </span>
                <input
                  type="tel"
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                  placeholder="Phone or WhatsApp number"
                  className="mt-1 min-h-11 w-full rounded-2xl border border-[#EADBCE] bg-white px-3 text-sm text-[#171211] outline-none placeholder:text-[#A99B95] focus:border-[#D98282]"
                />
              </label>
            ) : null}

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">
                  Date <span className="text-[#D98282]">*</span>
                </span>
                <span className="relative mt-1 block">
                  <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#A99B95]">
                    <CalendarIcon />
                  </span>
                  <input
                    type="date"
                    min={minDate}
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="booking-date-input min-h-11 w-full rounded-2xl border border-[#EADBCE] bg-white pl-10 pr-3 text-sm text-[#171211] outline-none focus:border-[#D98282]"
                  />
                </span>
              </label>
              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">
                  Time <span className="text-[#D98282]">*</span>
                </span>
                <select
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="mt-1 min-h-11 w-full rounded-2xl border border-[#EADBCE] bg-white px-3 text-sm text-[#171211] outline-none focus:border-[#D98282]"
                >
                  <option value="">Select time</option>
                  {BOOKING_TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {formatBookingTime(slot)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">
                Location <span className="text-[#D98282]">*</span>
              </span>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Your location"
                className="mt-1 min-h-11 w-full rounded-2xl border border-[#EADBCE] bg-white px-3 text-sm text-[#171211] outline-none placeholder:text-[#A99B95] focus:border-[#D98282]"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">Small note (optional)</span>
              <textarea
                rows={2}
                maxLength={240}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Hair length, colour, or anything we should know"
                className="mt-1 w-full resize-none rounded-2xl border border-[#EADBCE] bg-white px-3 py-2 text-sm text-[#171211] outline-none placeholder:text-[#A99B95] focus:border-[#D98282]"
              />
            </label>

            {date ? (
              <p className="text-center text-[11px] text-[#7A6E68]">
                {formatBookingDate(date)}
                {time ? ` · ${formatBookingTime(time)}` : ''}
                {location.trim() ? ` · ${location.trim()}` : ''}
              </p>
            ) : null}

            {formError ? <p className="text-center text-[12px] text-[#D98282]">{formError}</p> : null}

            <button
              type="button"
              onClick={() => submit(destination)}
              className={`min-h-11 w-full rounded-2xl text-[10px] font-bold uppercase tracking-[0.14em] ${
                destination === 'WHATSAPP' ? 'bg-[#128C7E] text-white' : 'bg-[#C9A46A] text-[#171211]'
              }`}
            >
              {destination === 'WHATSAPP' ? 'Confirm & send WhatsApp' : 'Confirm & save to portal'}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}

export function BookNowButton({
  look,
  destination = 'PORTAL',
  children,
  className,
}: {
  look: BookableLook;
  destination?: 'PORTAL' | 'WHATSAPP';
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      <BookingModal open={open} look={look} destination={destination} onClose={() => setOpen(false)} />
    </>
  );
}
