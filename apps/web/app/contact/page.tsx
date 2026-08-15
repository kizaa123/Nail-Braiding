'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/section';
import { DISPLAY_PHONE, WHATSAPP_PHONE } from '@/lib/studio-bookings';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const whatsappHref = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    [`Hello LUXÉ Beauty Studio`, name ? `My name is ${name}.` : '', message || 'I would like to get in touch about a booking.'].filter(Boolean).join('\n'),
  )}`;

  return (
    <div className="bg-[#F7F1EA]">
      <section className="bg-[#171211] py-10 text-white md:py-24">
        <Container>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#D98282]">✦ Get in touch</p>
          <h1 className="mt-3 font-display text-[2.15rem] font-normal leading-tight md:mt-4 md:text-7xl">
            Contact <span className="font-script italic text-[#D98282]">us.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#A99B95] md:mt-5 md:text-base">
            Questions about a look, timing, or your booking? Message the studio directly — we reply on WhatsApp.
          </p>
        </Container>
      </section>

      <Container className="flex flex-col gap-6 py-8 md:gap-10 md:py-20 lg:grid lg:grid-cols-2 lg:items-start">
        <div className="relative z-10 order-1 space-y-3 md:space-y-4">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="block rounded-2xl border border-[#EADBCE] bg-white p-4 transition-shadow hover:shadow-[0_12px_32px_rgba(23,18,17,0.08)] md:rounded-[24px] md:p-6"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D98282]">WhatsApp</p>
            <p className="mt-1.5 font-display text-2xl text-[#171211] md:mt-2 md:text-3xl">{DISPLAY_PHONE}</p>
            <p className="mt-1 text-sm text-[#7A6E68]">Fastest way to reach the shop owner.</p>
          </a>

          <div className="rounded-2xl border border-[#EADBCE] bg-white p-4 md:rounded-[24px] md:p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D98282]">Location</p>
            <p className="mt-1.5 font-display text-2xl text-[#171211] md:mt-2 md:text-3xl">Cape Coast, UCC Campus</p>
            <p className="mt-1 text-sm text-[#7A6E68]">Appointments only — please book a look first.</p>
          </div>

          <div className="rounded-2xl border border-[#EADBCE] bg-white p-4 md:rounded-[24px] md:p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D98282]">Hours</p>
            <p className="mt-1.5 text-sm font-medium text-[#171211] md:mt-2">Monday – Sunday · 9:00 AM – 5:00 PM</p>
            <p className="mt-1 text-sm text-[#7A6E68]">Open every day — appointments recommended.</p>
          </div>
        </div>

        <form
          className="relative z-0 order-2 rounded-2xl border border-[#EADBCE] bg-white p-4 shadow-[0_12px_32px_rgba(23,18,17,0.06)] md:rounded-[28px] md:p-8"
          onSubmit={(event) => {
            event.preventDefault();
            window.open(whatsappHref, '_blank');
          }}
        >
          <h2 className="font-display text-2xl text-[#171211] md:text-3xl">Send a message</h2>
          <p className="mt-1 text-sm text-[#7A6E68]">We’ll open WhatsApp with your note ready to send.</p>
          <label className="mt-5 block md:mt-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="mt-2 min-h-11 w-full rounded-2xl border border-[#EADBCE] bg-[#FAF7F2] px-4 text-sm text-[#171211] outline-none focus:border-[#D98282] md:min-h-12"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">Message</span>
            <textarea
              rows={4}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Tell us what you need…"
              className="mt-2 w-full resize-none rounded-2xl border border-[#EADBCE] bg-[#FAF7F2] px-4 py-3 text-sm text-[#171211] outline-none focus:border-[#D98282]"
            />
          </label>
          <button
            type="submit"
            className="mt-5 min-h-11 w-full rounded-full bg-[#128C7E] text-xs font-bold uppercase tracking-widest text-white md:min-h-12"
          >
            Send on WhatsApp
          </button>
        </form>
      </Container>
    </div>
  );
}
