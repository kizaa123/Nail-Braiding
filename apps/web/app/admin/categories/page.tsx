'use client';

import { useMemo, useState } from 'react';
import { useStudioCatalog } from '@/hooks/use-studio-catalog';
import { useStudioCategories } from '@/hooks/use-studio-categories';
import {
  addStudioCategory,
  deleteStudioCategory,
  renameStudioCategory,
  type StyleKind,
} from '@/lib/studio-categories';

const kinds: Array<{ id: StyleKind; label: string; hint: string }> = [
  { id: 'HAIR', label: 'Hair braiding', hint: 'Braids, locs, weaves, and protective styles' },
  { id: 'NAILS', label: 'Nail couture', hint: 'Art, shapes, gel, acrylic, and extensions' },
];

export default function AdminCategoriesPage() {
  const { categories, ready } = useStudioCategories();
  const { styles } = useStudioCatalog();
  const [drafts, setDrafts] = useState<Record<StyleKind, string>>({ HAIR: '', NAILS: '' });
  const [editing, setEditing] = useState<{ kind: StyleKind; name: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const style of styles) {
      if (style.archived) continue;
      map.set(style.categoryName, (map.get(style.categoryName) ?? 0) + 1);
    }
    return map;
  }, [styles]);

  const add = async (kind: StyleKind) => {
    const result = await addStudioCategory(kind, drafts[kind]);
    setMessage(result.ok ? null : result.message ?? null);
    if (result.ok) setDrafts((current) => ({ ...current, [kind]: '' }));
  };

  const saveRename = async () => {
    if (!editing) return;
    const result = await renameStudioCategory(editing.kind, editing.name, editValue);
    setMessage(result.ok ? null : result.message ?? null);
    if (result.ok) setEditing(null);
  };

  return (
    <div>
      <div className="border-b border-[#EADBCE] pb-6">
        <h2 className="font-display text-4xl font-normal text-[#171211]">
          Style <span className="font-script text-[#D98282]">categories.</span>
        </h2>
        <p className="mt-2 max-w-xl text-sm text-[#A99B95]">
          These names appear in the add-style form. Add a category here, then assign it when you upload a look.
        </p>
      </div>

      {message ? (
        <p className="mt-4 rounded-2xl border border-[#D98282]/30 bg-[#D98282]/10 px-4 py-3 text-sm text-[#171211]">{message}</p>
      ) : null}

      {!ready ? (
        <p className="mt-8 text-sm text-[#A99B95]">Loading categories…</p>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {kinds.map((kind) => (
            <section key={kind.id} className="rounded-2xl border border-[#EADBCE] bg-white p-5 shadow-[0_8px_24px_rgba(23,18,17,0.04)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D98282]">{kind.label}</p>
              <p className="mt-1 text-sm text-[#A99B95]">{kind.hint}</p>

              <form
                className="mt-4 flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  add(kind.id);
                }}
              >
                <input
                  value={drafts[kind.id]}
                  onChange={(event) => setDrafts((current) => ({ ...current, [kind.id]: event.target.value }))}
                  placeholder="New category name"
                  className="min-h-11 flex-1 rounded-full border border-[#EADBCE] px-4 text-sm outline-none focus:border-[#D98282]"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[#C9A46A] px-4 text-[10px] font-bold uppercase tracking-widest text-[#171211]"
                >
                  Add
                </button>
              </form>

              <ul className="mt-4 divide-y divide-[#EADBCE]">
                {categories[kind.id].map((name) => {
                  const count = counts.get(name) ?? 0;
                  const isEditing = editing?.kind === kind.id && editing.name === name;
                  return (
                    <li key={name} className="flex items-center gap-3 py-3">
                      {isEditing ? (
                        <input
                          autoFocus
                          value={editValue}
                          onChange={(event) => setEditValue(event.target.value)}
                          className="min-h-10 flex-1 rounded-full border border-[#D98282] px-3 text-sm outline-none"
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault();
                              saveRename();
                            }
                          }}
                        />
                      ) : (
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-[#171211]">{name}</p>
                          <p className="text-[11px] text-[#A99B95]">
                            {count} {count === 1 ? 'style' : 'styles'}
                          </p>
                        </div>
                      )}
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={saveRename}
                            className="rounded-full bg-[#171211] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditing(null)}
                            className="rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#7A6E68]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditing({ kind: kind.id, name });
                              setEditValue(name);
                              setMessage(null);
                            }}
                            className="rounded-full border border-[#EADBCE] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest"
                          >
                            Rename
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              const result = await deleteStudioCategory(kind.id, name);
                              setMessage(result.ok ? null : result.message ?? null);
                            }}
                            className="rounded-full border border-[#D98282]/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#D98282]"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
