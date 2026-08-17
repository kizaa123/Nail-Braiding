'use client';

import { useMemo, useState } from 'react';
import { CatalogImage } from '@/components/ui/catalog-image';
import { useStudioBookings } from '@/hooks/use-studio-bookings';
import {
  deleteStudioBooking,
  formatBookingWhen,
  patchStudioBooking,
  type BookingStatus,
  type StudioBooking,
} from '@/lib/studio-bookings';

type Filter = 'all' | 'WAITING' | 'APPROVED' | 'SERVED' | 'DECLINED';

const filters: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'WAITING', label: 'Pending' },
  { id: 'APPROVED', label: 'Waiting' },
  { id: 'SERVED', label: 'Served' },
  { id: 'DECLINED', label: 'Declined' },
];

function statusLabel(status: BookingStatus) {
  if (status === 'WAITING') return 'Pending';
  if (status === 'APPROVED') return 'Waiting';
  if (status === 'SERVED') return 'Served';
  return 'Declined';
}

function statusClass(status: BookingStatus) {
  if (status === 'WAITING') return 'bg-[#C9A46A]/15 text-[#8C6D14]';
  if (status === 'APPROVED') return 'bg-[#D98282]/15 text-[#D98282]';
  if (status === 'SERVED') return 'bg-[#2D6A4F]/12 text-[#2D6A4F]';
  return 'bg-black/5 text-[#7A6E68]';
}

export default function AdminBookingsPage() {
  const { bookings, ready } = useStudioBookings();
  const [filter, setFilter] = useState<Filter>('all');

  const counts = useMemo(
    () => ({
      WAITING: bookings.filter((item) => item.status === 'WAITING').length,
      APPROVED: bookings.filter((item) => item.status === 'APPROVED').length,
      SERVED: bookings.filter((item) => item.status === 'SERVED').length,
      DECLINED: bookings.filter((item) => item.status === 'DECLINED').length,
    }),
    [bookings],
  );

  const rows = useMemo(
    () => (filter === 'all' ? bookings : bookings.filter((item) => item.status === filter)),
    [bookings, filter],
  );

  return (
    <div>
      <div className="border-b border-[#EADBCE] pb-6">
        <h2 className="font-display text-4xl font-normal text-[#171211]">
          Client <span className="font-script text-[#D98282]">bookings.</span>
        </h2>
        <p className="mt-2 max-w-xl text-sm text-[#A99B95]">
          Approve new requests, then mark approved clients as waiting or served.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Pending approval', value: counts.WAITING, hint: 'Needs approve or decline' },
          { label: 'Waiting', value: counts.APPROVED, hint: 'Approved, not yet served' },
          { label: 'Served', value: counts.SERVED, hint: 'Approved and completed' },
          { label: 'Declined', value: counts.DECLINED, hint: 'Not going ahead' },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-[#EADBCE] bg-white p-4 transition-transform duration-300 hover:-translate-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A99B95]">{item.label}</p>
            <p className="mt-2 font-display text-4xl text-[#171211]">{ready ? item.value : '—'}</p>
            <p className="mt-1 text-[11px] text-[#A99B95]">{item.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200 ${
              filter === item.id ? 'bg-[#171211] text-white' : 'border border-[#EADBCE] bg-white text-[#7A6E68]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {!ready ? (
        <p className="mt-8 text-sm text-[#A99B95]">Loading bookings…</p>
      ) : rows.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-[#EADBCE] bg-white p-12 text-center">
          <p className="font-display text-3xl text-[#171211]">No bookings in this view</p>
          <p className="mt-2 text-sm text-[#A99B95]">New client requests will appear in this table.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-[#EADBCE] bg-white no-scrollbar">
          <table className="min-w-[920px] w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#EADBCE] bg-[#FAF7F2] text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">
                <th className="px-4 py-3 font-bold">Product</th>
                <th className="px-4 py-3 font-bold">Client name</th>
                <th className="px-4 py-3 font-bold">Phone number</th>
                <th className="px-4 py-3 font-bold">Date and time</th>
                <th className="px-4 py-3 font-bold">Location</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((booking) => (
                <BookingRow key={booking.id} booking={booking} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function BookingRow({ booking }: { booking: StudioBooking }) {
  const { day, time } = formatBookingWhen(booking);

  return (
    <tr className="border-b border-[#EADBCE] last:border-b-0">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#F7F1EA]">
            <CatalogImage src={booking.imageUrl} alt={booking.styleName} className="object-cover" sizes="48px" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-[#171211]">{booking.styleName}</p>
            <p className="text-[11px] text-[#A99B95]">
              {booking.categoryName}
              {booking.destination === 'WHATSAPP' ? ' · WhatsApp' : ' · Portal'}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 font-medium text-[#171211]">{booking.clientName}</td>
      <td className="px-4 py-3 text-[#171211]">{booking.clientPhone || '—'}</td>
      <td className="px-4 py-3">
        <p className="text-[#171211]">{day}</p>
        <p className="text-[11px] text-[#A99B95]">{time || 'Time not set'}</p>
      </td>
      <td className="px-4 py-3 text-[#171211]">{booking.location || '—'}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusClass(booking.status)}`}>
          {statusLabel(booking.status)}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          {booking.status === 'WAITING' ? (
            <>
              <button
                type="button"
                onClick={() => patchStudioBooking(booking.id, { status: 'APPROVED' })}
                className="rounded-full bg-[#2D6A4F] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => patchStudioBooking(booking.id, { status: 'DECLINED' })}
                className="rounded-full border border-[#EADBCE] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#7A6E68]"
              >
                Decline
              </button>
            </>
          ) : null}
          {booking.status === 'APPROVED' ? (
            <button
              type="button"
              onClick={() => patchStudioBooking(booking.id, { status: 'SERVED' })}
              className="rounded-full bg-[#C9A46A] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#171211]"
            >
              Mark served
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete booking for ${booking.clientName}?`)) deleteStudioBooking(booking.id);
            }}
            className="rounded-full border border-[#D98282]/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#D98282]"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
