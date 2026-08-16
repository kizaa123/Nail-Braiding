'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { fileToStyleImage, type StyleDraft, type StudioStyle } from '@/lib/studio-styles';
import { DEFAULT_CATEGORIES } from '@/lib/studio-categories';
import { useStudioCategories } from '@/hooks/use-studio-categories';
import { CatalogImage } from '@/components/ui/catalog-image';

const emptyDraft = (kind: 'HAIR' | 'NAILS' = 'HAIR'): StyleDraft => ({
  name: '',
  kind,
  categoryName: '',
  description: '',
  imageUrl: '',
  startingPriceMinor: 0,
  durationMinutes: 0,
  location: 'Cape Coast, UCC Campus',
  artistIds: [],
  featured: false,
  published: true,
});

function fromStyle(style: StudioStyle): StyleDraft {
  return {
    id: style.id,
    name: style.name,
    kind: style.kind,
    categoryName: style.categoryName,
    description: style.description,
    imageUrl: style.imageUrl,
    startingPriceMinor: style.startingPriceMinor,
    durationMinutes: style.durationMinutes,
    location: style.location || 'Cape Coast, UCC Campus',
    artistIds: style.artistIds ?? [],
    featured: style.featured,
    published: style.published,
  };
}

function ImageGlyph() {
  return (
    <svg className="h-10 w-10 text-[#C9A46A]" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8.5" cy="10" r="1.6" fill="currentColor" />
      <path d="M7 16l3.2-3.4a1.5 1.5 0 012.2 0L16 16l1.2-1.3a1.5 1.5 0 012.1 0L21 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const fieldClass =
  'mt-1.5 min-h-11 w-full rounded-xl border border-[#EADBCE] bg-white px-3.5 text-sm text-[#171211] outline-none transition-colors focus:border-[#D98282]';

export function StyleEditorModal({
  open,
  style,
  onClose,
  onSave,
}: {
  open: boolean;
  style: StudioStyle | null;
  onClose: () => void;
  onSave: (draft: StyleDraft) => void | Promise<void>;
}) {
  const { categories } = useStudioCategories();
  const [draft, setDraft] = useState<StyleDraft>(emptyDraft());
  const [mounted, setMounted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setDraft(style ? fromStyle(style) : emptyDraft());
    if (fileRef.current) fileRef.current.value = '';
  }, [open, style]);

  const kindCategories = categories[draft.kind].length ? categories[draft.kind] : DEFAULT_CATEGORIES[draft.kind];
  const categoryOptions = kindCategories.includes(draft.categoryName)
    ? kindCategories
    : draft.categoryName
      ? [draft.categoryName, ...kindCategories]
      : kindCategories;
  const priceCedis = draft.startingPriceMinor / 100;
  const canSave =
    Boolean(draft.name.trim() && draft.categoryName.trim() && draft.startingPriceMinor > 0 && draft.durationMinutes > 0) &&
    (!draft.published || Boolean(draft.imageUrl));

  const onPickImage = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const imageUrl = await fileToStyleImage(file);
      setDraft((current) => ({ ...current, imageUrl }));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Could not upload that photo.');
    } finally {
      setUploading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
          <motion.button
            type="button"
            aria-label="Close style editor"
            className="absolute inset-0 bg-[#171211]/55 backdrop-blur-[2px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative z-10 flex max-h-[min(92dvh,100%)] w-full max-w-[480px] flex-col overflow-hidden rounded-t-[24px] border border-[#EADBCE] bg-[#FAF7F2] shadow-[0_24px_60px_rgba(23,18,17,0.28)] sm:rounded-[24px]"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#EADBCE] bg-[#FAF7F2] px-4 py-3 sm:px-5 sm:py-3.5">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D98282]">Atelier</p>
            <h2 className="font-display text-2xl leading-tight text-[#171211]">
              {style ? 'Edit look' : 'Add look'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#EADBCE] bg-white text-[#171211] shadow-sm"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <form
          className="min-h-0 flex-1 space-y-3.5 overflow-y-auto px-4 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-5"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!canSave || saving) return;
            setSaving(true);
            try {
              await onSave({
                ...draft,
                location: 'Cape Coast, UCC Campus',
                artistIds: style?.artistIds ?? [],
              });
            } catch (error) {
              window.alert(error instanceof Error ? error.message : 'Could not save this look.');
            } finally {
              setSaving(false);
            }
          }}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*,image/jpeg,image/png,image/webp,image/heic"
            className="sr-only"
            onChange={(event) => {
              void onPickImage(event.target.files?.[0]);
            }}
          />

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="group relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#D9C7B4] bg-[#F3EBE1]"
          >
            {draft.imageUrl ? (
              <>
                <CatalogImage src={draft.imageUrl} alt="" className="object-cover" />
                <span className="absolute inset-0 flex items-center justify-center bg-[#171211]/35 text-[10px] font-bold uppercase tracking-widest text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {uploading ? 'Uploading…' : 'Change photo'}
                </span>
              </>
            ) : (
              <span className="flex flex-col items-center gap-2 text-[#7A6E68]">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <ImageGlyph />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {uploading ? 'Uploading…' : 'Add photo'}
                </span>
              </span>
            )}
          </button>

          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">Name</span>
            <input
              required
              value={draft.name}
              onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
              placeholder="Look name"
              className={fieldClass}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">Kind</span>
              <select
                value={draft.kind}
                onChange={(event) => {
                  const kind = event.target.value as 'HAIR' | 'NAILS';
                  const nextCategories = categories[kind].length ? categories[kind] : DEFAULT_CATEGORIES[kind];
                  setDraft((current) => ({
                    ...current,
                    kind,
                    categoryName: nextCategories.includes(current.categoryName) ? current.categoryName : '',
                  }));
                }}
                className={fieldClass}
              >
                <option value="HAIR">Hair Braiding</option>
                <option value="NAILS">Nail Couture</option>
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">Category</span>
              <select
                required
                value={draft.categoryName}
                onChange={(event) => setDraft((current) => ({ ...current, categoryName: event.target.value }))}
                className={`${fieldClass} ${draft.categoryName ? '' : 'text-[#A99B95]'}`}
              >
                <option value="" disabled>
                  Select category
                </option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">Price · GH₵</span>
              <input
                required
                type="number"
                min={1}
                step={1}
                value={priceCedis > 0 ? priceCedis : ''}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    startingPriceMinor: Math.max(0, Math.round(Number(event.target.value || 0) * 100)),
                  }))
                }
                placeholder="Price"
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">Duration · min</span>
              <input
                required
                type="number"
                min={15}
                step={15}
                value={draft.durationMinutes > 0 ? draft.durationMinutes : ''}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, durationMinutes: Number(event.target.value || 0) }))
                }
                placeholder="Minutes"
                className={fieldClass}
              />
            </label>
          </div>

          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">Description</span>
            <textarea
              rows={2}
              value={draft.description}
              onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
              placeholder="Short description"
              className="mt-1.5 w-full resize-none rounded-xl border border-[#EADBCE] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#D98282]"
            />
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDraft((current) => ({ ...current, featured: !current.featured }))}
              className={`rounded-full px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 ${
                draft.featured ? 'bg-[#C9A46A] text-[#171211]' : 'border border-[#EADBCE] bg-white text-[#7A6E68]'
              }`}
            >
              Featured
            </button>
            <button
              type="button"
              onClick={() => setDraft((current) => ({ ...current, published: !current.published }))}
              className={`rounded-full px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 ${
                draft.published ? 'bg-[#171211] text-white' : 'border border-[#EADBCE] bg-white text-[#7A6E68]'
              }`}
            >
              {draft.published ? 'Published' : 'Draft'}
            </button>
          </div>

          <button
            type="submit"
            disabled={!canSave || uploading || saving}
            className="min-h-11 w-full rounded-xl bg-[#C9A46A] text-[10px] font-bold uppercase tracking-[0.16em] text-[#171211] transition-opacity disabled:opacity-40"
          >
            {saving ? 'Saving…' : style ? 'Save changes' : 'Add look'}
          </button>
          {draft.published && !draft.imageUrl ? (
            <p className="text-center text-[11px] text-[#D98282]">Add a photo before publishing.</p>
          ) : null}
        </form>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
