'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Brush, CarFront, Droplets, Hammer, Lightbulb, Sparkles, Wrench } from 'lucide-react';
import AIProblemChat from '@/components/AIProblemChat';
import ProviderCard from '@/components/ProviderCard';
import { EmptyState, ErrorState, Spinner, primaryButton } from '@/components/ui';
import type { Category, ProviderProfile } from '@/types';

const iconFor = (slug: string) => ({ mechanic: CarFront, cleaning: Sparkles, electrician: Lightbulb, plumber: Droplets, painter: Brush, carpenter: Hammer }[slug] ?? Wrench);
const stickerColors = ['bg-mustard', 'bg-tomato text-white', 'bg-teal text-white', 'bg-paper', 'bg-success text-white', 'bg-mustard'];

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    Promise.all([fetch('/api/categories').then((r) => r.json()), fetch('/api/providers/search?radius=25').then((r) => r.json())])
      .then(([categoryResult, providerResult]) => { if (!categoryResult.success || !providerResult.success) throw new Error('Could not load local services.'); setCategories(categoryResult.data); setProviders(providerResult.data.slice(0, 4)); })
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Could not load local services.'))
      .finally(() => setLoading(false));
  }, []);

  return <div className="overflow-hidden">
    <section className="paper-grain border-b-2 border-ink bg-sand px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pb-24 lg:pt-24">
      <div className="mx-auto max-w-7xl"><div className="grid items-center gap-12 lg:grid-cols-[.88fr_1.12fr]">
        <div><p className="mb-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.22em] text-tomato"><span className="h-2 w-2 bg-tomato" /> Greater Tunis, one good fix away</p><h1 className="font-display text-5xl font-black leading-[.93] tracking-[-.045em] text-ink sm:text-7xl">A neighbour who knows <span className="text-teal">what to do.</span></h1><p className="mt-6 max-w-md text-base leading-7 text-ink/70">No hunting through categories. Tell ProxiService what is happening and we&apos;ll help you find the right hands nearby.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="#categories" className={primaryButton}>Browse the workshop <ArrowRight className="h-4 w-4" /></Link><span className="border-l-2 border-ink/30 pl-3 pt-2 text-xs font-bold text-ink/60">English / Français / Derja</span></div></div>
        <AIProblemChat />
      </div></div>
    </section>
    <section id="categories" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.2em] text-tomato">The neighborhood board</p><h2 className="font-display text-4xl font-black tracking-tight">Pick a trade, or let us listen.</h2></div><Link href="/search" className="text-sm font-black text-teal underline decoration-tomato decoration-2 underline-offset-4">See all providers <ArrowRight className="ml-1 inline h-4 w-4" /></Link></div>{loading ? <Spinner label="Setting up the board..." /> : error ? <ErrorState message={error} /> : categories.length === 0 ? <EmptyState title="The board is empty." /> : <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">{categories.map((category, index) => { const Icon = iconFor(category.slug); return <Link key={category.id} href={`/search?category=${category.slug}`} className={`group min-h-[150px] border-2 border-ink p-4 shadow-hard-sm transition hover:rotate-0 hover:bg-paper ${stickerColors[index % stickerColors.length]} ${index % 2 ? '-rotate-2' : 'rotate-2'}`}><Icon className="mb-7 h-8 w-8" /><span className="block font-display text-xl font-black leading-none">{category.name}</span><span className="mt-2 block text-xs font-bold opacity-70">{category.badgeCount ?? 0} local pros</span></Link>; })}</div>}</section>
    <section className="border-y-2 border-ink bg-teal px-4 py-14 text-sand sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="mb-10 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.2em] text-mustard">People with a plan</p><h2 className="font-display text-4xl font-black">How it works</h2></div><p className="max-w-sm text-sm leading-6 text-sand/75">From “something is wrong” to “it is sorted” in three clear steps.</p></div><div className="grid gap-0 md:grid-cols-3">{[['01', 'Tell us the story', 'Write it plainly. Our assistant understands English, French, and Derja.'], ['02', 'Choose your hands', 'See nearby people, real reviews, clear prices, and the next free time.'], ['03', 'Get it sorted', 'Book a slot, follow the request, and keep the provider’s number when accepted.']].map(([number, title, text], index) => <div key={number} className={`border-2 border-sand/50 p-6 ${index === 1 ? 'bg-sand text-ink' : ''}`}><span className="font-display text-5xl font-black text-tomato">{number}</span><h3 className="mt-5 font-display text-2xl font-black">{title}</h3><p className="mt-2 text-sm leading-6 opacity-75">{text}</p></div>)}</div></div></section>
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.2em] text-tomato">Already on the road</p><h2 className="font-display text-4xl font-black">Good people nearby.</h2></div><Link href="/search" className="inline-flex items-center gap-1 text-sm font-black text-teal underline decoration-tomato decoration-2 underline-offset-4">Open the map <ArrowRight className="h-4 w-4" /></Link></div>{loading ? <Spinner label="Finding local pros..." /> : providers.length ? <div className="grid gap-5 md:grid-cols-2">{providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div> : <EmptyState title="No providers to show yet." />}</section>
  </div>;
}
