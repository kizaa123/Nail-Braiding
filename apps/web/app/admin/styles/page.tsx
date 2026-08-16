'use client';

import { useMemo, useState } from 'react';
import { formatCedis } from '@/lib/api';
import { useStudioCatalog } from '@/hooks/use-studio-catalog';
import {
  archiveStudioStyle,
  deleteStudioStyle,
  patchStudioStyle,
  restoreStudioStyle,
  upsertStudioStyle,
  type StyleDraft,
  type StudioStyle,
} from '@/lib/studio-styles';
import { CatalogImage } from '@/components/ui/catalog-image';
import { StyleEditorModal } from '@/components/admin/style-editor';
import { useStyleFavoriteCounts } from '@/hooks/use-style-favorites';

type Filter = 'active' | 'drafts' | 'archived' | 'all';

export default function AdminStylesPage() {
  const { styles, ready } = useStudioCatalog();
  const favoriteCounts = useStyleFavoriteCounts();
  const [filter, setFilter] = useState<Filter>('active');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<StudioStyle | null | undefined>(undefined);

  const rows = useMemo(() => {
    return styles.filter((style) => {
      const matchFilter =
        filter === 'all' ||
        (filter === 'archived' && style.archived) ||
        (filter === 'drafts' && !style.published && !style.archived) ||
        (filter === 'active' && style.published && !style.archived);
      const matchQuery =
        query === '' ||
        style.name.toLowerCase().includes(query.toLowerCase()) ||
        style.categoryName.toLowerCase().includes(query.toLowerCase());
      return matchFilter && matchQuery;
    });
  }, [styles, filter, query]);

  const save = async (draft: StyleDraft) => {
    await upsertStudioStyle(draft);
    setEditing(undefined);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-[#EADBCE] pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-4xl font-normal text-[#171211]">
            Atelier <span className="font-script text-[#D98282]">lookbook.</span>
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[#A99B95]">
            Add looks, upload photos, set price and category, then tap a card to edit.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(null)}
          className="rounded-full bg-[#C9A46A] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#171211]"
        >
          Add new look
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {([
            ['active', 'Published'],
            ['drafts', 'Unpublished'],
            ['archived', 'Archived'],
            ['all', 'All'],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200 ${
                filter === id ? 'bg-[#171211] text-white' : 'border border-[#EADBCE] bg-white text-[#7A6E68]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search catalog…"
          className="min-h-11 w-full max-w-xs rounded-full border border-[#EADBCE] bg-white px-4 text-sm outline-none focus:border-[#D98282]"
        />
      </div>

      {!ready ? (
        <p className="mt-10 text-sm text-[#A99B95]">Loading catalog…</p>
      ) : rows.length === 0 ? (
        <div className="mt-10 rounded-[24px] border border-black/5 bg-white p-12 text-center">
          <p className="font-display text-3xl text-[#171211]">
            {filter === 'active' && query === '' ? 'No looks yet' : 'No styles in this view'}
          </p>
          <p className="mt-2 text-sm text-[#A99B95]">
            {filter === 'active' && query === ''
              ? 'Tap Add new look to upload a photo, set price, and publish.'
              : 'Add a new look or switch filters.'}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {rows.map((style) => (
            <article
              key={style.id}
              className="group overflow-hidden rounded-2xl border border-[#EADBCE] bg-white shadow-[0_4px_16px_rgba(23,18,17,0.04)] transition-transform duration-300 hover:-translate-y-1"
            >
              <button
                type="button"
                onClick={() => setEditing(style)}
                className="block w-full text-left"
              >
                <div className="relative aspect-[5/4] bg-[#F7F1EA]">
                  <CatalogImage src={style.imageUrl} alt={style.name} className="object-cover" sizes="(max-width: 768px) 50vw, 20vw" />
                  <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                    <span className="rounded-full bg-[#D98282] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white">
                      {style.kind === 'HAIR' ? 'Hair' : 'Nails'}
                    </span>
                    {style.featured ? (
                      <span className="rounded-full bg-[#C9A46A] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-[#171211]">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <span className="absolute right-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-[#171211]">
                    {style.archived ? 'Archived' : style.published ? 'Live' : 'Draft'}
                  </span>
                  <span className="absolute inset-x-2 bottom-2 rounded-full bg-[#171211]/80 px-3 py-1.5 text-center text-[9px] font-bold uppercase tracking-widest text-white opacity-0 transition-opacity group-hover:opacity-100">
                    Edit look
                  </span>
                </div>
                <div className="px-3 pb-1 pt-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="line-clamp-1 min-w-0 font-display text-lg leading-tight text-[#171211]">{style.name}</p>
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#7A6E68]">
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#D98282" aria-hidden>
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {favoriteCounts[style.id] ?? 0}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-[#A99B95]">{style.categoryName}</p>
                  <p className="mt-1 text-xs font-semibold text-[#D98282]">{formatCedis(style.startingPriceMinor)}</p>
                </div>
              </button>

              <div className="flex flex-wrap gap-1 px-2.5 pb-2.5">
                <button
                  type="button"
                  onClick={() => setEditing(style)}
                  className="rounded-full bg-[#C9A46A] px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-[#171211]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void patchStudioStyle(style.id, { featured: !style.featured })}
                  className="rounded-full border border-[#EADBCE] px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest"
                >
                  {style.featured ? 'Unfeature' : 'Feature'}
                </button>
                {!style.archived ? (
                  <button
                    type="button"
                    onClick={() => void patchStudioStyle(style.id, { published: !style.published })}
                    className="rounded-full border border-[#EADBCE] px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest"
                  >
                    {style.published ? 'Unpublish' : 'Publish'}
                  </button>
                ) : null}
                {style.archived ? (
                  <button
                    type="button"
                    onClick={() => void restoreStudioStyle(style.id)}
                    className="rounded-full border border-[#EADBCE] px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest"
                  >
                    Restore
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => void archiveStudioStyle(style.id)}
                    className="rounded-full border border-[#EADBCE] px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest"
                  >
                    Archive
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete ${style.name} permanently?`)) void deleteStudioStyle(style.id);
                  }}
                  className="rounded-full border border-[#D98282]/40 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-[#D98282]"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <StyleEditorModal
        open={editing !== undefined}
        style={editing ?? null}
        onClose={() => setEditing(undefined)}
        onSave={save}
      />
    </div>
  );
}
