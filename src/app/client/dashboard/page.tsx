'use client';

import React from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useLoad } from '@/lib/use-load';
import type { Booking } from '@/types';
import RoleGuard from '@/components/RoleGuard';
import BookingListItem, { ACTIVE_STATUSES } from '@/components/BookingListItem';
import { EmptyState, ErrorState, Spinner, primaryButton } from '@/components/ui';

export default function ClientDashboardPage() {
  return <RoleGuard allowedRoles={['CLIENT']}><MyBookings /></RoleGuard>;
}

function MyBookings() {
  const { data, error, loading, reload } = useLoad(() => api<Booking[]>('/api/bookings'), []);

  const upcoming = (data ?? []).filter((b) => ACTIVE_STATUSES.includes(b.status));
  const past = (data ?? []).filter((b) => !ACTIVE_STATUSES.includes(b.status)).reverse();

  return (
    <div className="min-h-screen bg-sand px-4 py-8 paper-grain">
      <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl font-black text-ink">My bookings</h1>
        <Link href="/search" className={primaryButton}>Book a service</Link>
      </div>

      {loading && !data ? <Spinner label="Loading your bookings..." /> : error ? <ErrorState message={error} onRetry={reload} /> : (
        <>
          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Upcoming</h2>
            {upcoming.length === 0
              ? <EmptyState title="No upcoming bookings.">Find a provider and pick a time that suits you.</EmptyState>
              : <ul className="space-y-2">{upcoming.map((b) => <BookingListItem key={b.id} booking={b} party="provider" />)}</ul>}
          </section>
          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Past</h2>
            {past.length === 0
              ? <EmptyState title="No past bookings yet." />
              : (
                <ul className="space-y-2">
                  {past.map((b) => (
                    <BookingListItem key={b.id} booking={b} party="provider">
                      {b.actions.includes('REVIEW') && <span className="text-xs font-semibold text-amber-700">Waiting for your review</span>}
                    </BookingListItem>
                  ))}
                </ul>
              )}
          </section>
        </>
      )}
      </div>
    </div>
  );
}
