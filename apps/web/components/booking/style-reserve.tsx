'use client';

import { BookNowButton } from '@/components/booking/booking-modal';
import type { BookableLook } from '@/lib/studio-bookings';

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 sm:h-[18px] sm:w-[18px]" aria-hidden="true">
      <path
        fill="#25D366"
        d="M12 2C6.48 2 2 6.26 2 11.5c0 1.86.54 3.6 1.48 5.1L2 22l5.58-1.44A10.2 10.2 0 0 0 12 21c5.52 0 10-4.26 10-9.5S17.52 2 12 2z"
      />
      <path
        fill="#fff"
        d="M16.72 14.38c-.22-.11-1.3-.64-1.5-.71-.2-.08-.35-.11-.5.11-.14.22-.57.71-.7.86-.13.14-.26.16-.48.05-.22-.11-.93-.34-1.77-1.09-.65-.58-1.1-1.3-1.22-1.52-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.4.11-.13.14-.22.22-.37.07-.14.04-.27-.02-.38-.06-.11-.5-1.2-.68-1.64-.18-.43-.36-.37-.5-.38h-.42c-.14 0-.37.05-.56.27-.19.22-.74.72-.74 1.76s.76 2.04.86 2.18c.11.14 1.5 2.29 3.63 3.21.51.22.9.35 1.21.45.51.16.97.14 1.34.08.41-.06 1.26-.51 1.44-.1.18-.49.18-.91.13-.99-.06-.08-.2-.13-.42-.24z"
      />
    </svg>
  );
}

export function StyleReserve({ look }: { look: BookableLook }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
      <BookNowButton
        look={look}
        destination="PORTAL"
        className="inline-flex min-h-11 w-full items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-r from-champagne via-[#E5C158] to-champagne px-2 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-obsidian shadow-md sm:w-auto sm:px-5 sm:text-xs sm:tracking-wider"
      >
        Book via Portal
      </BookNowButton>
      <BookNowButton
        look={look}
        destination="WHATSAPP"
        className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#128C7E] px-2 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-md hover:bg-[#0e6e63] sm:w-auto sm:gap-2 sm:px-5 sm:text-xs sm:tracking-wider"
      >
        <WhatsAppIcon />
        Book via WhatsApp
      </BookNowButton>
    </div>
  );
}
