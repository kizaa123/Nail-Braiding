'use client';

import { useEffect, useRef, useState } from 'react';
import { CatalogImage } from '@/components/ui/catalog-image';
import { useStudioSession } from '@/hooks/use-studio-session';
import { studioRequest, requestError } from '@/lib/studio-http';
import {
  normalizeStudioProfile,
  saveCachedStudioProfile,
  toWhatsAppDigits,
  type StudioAdminSettings,
  type StudioPublicProfile,
} from '@/lib/studio-profile';
import { saveStudioSession } from '@/lib/studio-session';
import { fileToStyleImage } from '@/lib/studio-styles';

const fieldClass =
  'mt-1.5 min-h-11 w-full rounded-xl border border-[#EADBCE] bg-white px-3.5 text-sm text-[#171211] outline-none transition-colors focus:border-[#D98282]';

export default function AdminSettingsPage() {
  const { session } = useStudioSession();
  const fileRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<StudioPublicProfile>(normalizeStudioProfile());
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasPassword, setHasPassword] = useState(false);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    void studioRequest<{ settings?: StudioAdminSettings }>('/api/studio/settings').then((result) => {
      if (cancelled) return;
      if (result.ok && result.data?.settings) {
        const next = normalizeStudioProfile(result.data.settings);
        setDraft(next);
        setHasPassword(Boolean(result.data.settings.hasPassword));
        saveCachedStudioProfile(next);
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const patch = (update: Partial<StudioPublicProfile>) => {
    setDraft((current) => ({ ...current, ...update }));
  };

  const onPickPhoto = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const profileImageUrl = await fileToStyleImage(file);
      patch({ profileImageUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not upload that photo.');
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setError('');
    setMessage('');
    if (newPassword && newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    setSaving(true);
    const result = await studioRequest<{ settings?: StudioAdminSettings; error?: string }>('/api/studio/settings', {
      method: 'PATCH',
      body: JSON.stringify({
        ownerName: draft.ownerName,
        email: draft.email,
        displayPhone: draft.displayPhone,
        location: draft.location,
        hours: draft.hours,
        profileImageUrl: draft.profileImageUrl,
        currentPassword: newPassword ? currentPassword : undefined,
        newPassword: newPassword || undefined,
      }),
    });
    setSaving(false);
    if (!result.ok || !result.data?.settings) {
      setError(requestError(result, 'Could not save settings.'));
      return;
    }
    const next = normalizeStudioProfile(result.data.settings);
    setDraft(next);
    setHasPassword(Boolean(result.data.settings.hasPassword));
    saveCachedStudioProfile(next);
    if (session) {
      saveStudioSession({ ...session, email: next.email });
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage('Settings saved. Phone, photo, and login details are live for the shop.');
  };

  return (
    <div>
      <div className="border-b border-[#EADBCE] pb-6">
        <h2 className="font-display text-4xl font-normal text-[#171211]">
          Studio <span className="font-script text-[#D98282]">settings.</span>
        </h2>
        <p className="mt-2 max-w-xl text-sm text-[#A99B95]">
          Update the shop phone, profile photo, location, and login password used on the public site and WhatsApp.
        </p>
      </div>

      {!ready ? (
        <p className="mt-8 text-sm text-[#A99B95]">Loading settings…</p>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <section className="rounded-2xl border border-[#EADBCE] bg-white p-5 shadow-[0_8px_24px_rgba(23,18,17,0.04)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D98282]">Profile photo</p>
            <div className="relative mx-auto mt-5 h-36 w-36 overflow-hidden rounded-full bg-[#F7F1EA]">
              {draft.profileImageUrl ? (
                <CatalogImage src={draft.profileImageUrl} alt="" className="object-cover" sizes="144px" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-[#A99B95]">No photo</div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                void onPickPhoto(event.target.files?.[0]);
                event.target.value = '';
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-5 min-h-11 w-full rounded-full bg-[#171211] text-[10px] font-bold uppercase tracking-[0.16em] text-white"
            >
              {uploading ? 'Uploading…' : 'Change photo'}
            </button>
            {draft.profileImageUrl ? (
              <button
                type="button"
                onClick={() => patch({ profileImageUrl: '' })}
                className="mt-2 min-h-11 w-full rounded-full border border-[#EADBCE] text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]"
              >
                Remove photo
              </button>
            ) : null}
          </section>

          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              void save();
            }}
          >
            <section className="rounded-2xl border border-[#EADBCE] bg-white p-5 shadow-[0_8px_24px_rgba(23,18,17,0.04)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D98282]">Shop details</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">Owner name</span>
                  <input
                    value={draft.ownerName}
                    onChange={(event) => patch({ ownerName: event.target.value })}
                    className={fieldClass}
                    placeholder="Studio owner"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">Login email</span>
                  <input
                    type="email"
                    value={draft.email}
                    onChange={(event) => patch({ email: event.target.value })}
                    className={fieldClass}
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">Phone number</span>
                  <input
                    value={draft.displayPhone}
                    onChange={(event) => patch({ displayPhone: event.target.value })}
                    className={fieldClass}
                    placeholder="0559535682"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">WhatsApp number</span>
                  <input
                    value={toWhatsAppDigits(draft.displayPhone)}
                    readOnly
                    className={`${fieldClass} bg-[#FAF7F2] text-[#7A6E68]`}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">Location</span>
                  <input
                    value={draft.location}
                    onChange={(event) => patch({ location: event.target.value })}
                    className={fieldClass}
                    placeholder="Cape Coast, UCC Campus"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">Hours</span>
                  <input
                    value={draft.hours}
                    onChange={(event) => patch({ hours: event.target.value })}
                    className={fieldClass}
                    placeholder="Monday – Sunday · 9:00 AM – 5:00 PM"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-[#EADBCE] bg-white p-5 shadow-[0_8px_24px_rgba(23,18,17,0.04)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D98282]">Password</p>
              <p className="mt-1 text-sm text-[#A99B95]">
                {hasPassword
                  ? 'A custom studio password is already set. Enter the current one to change it.'
                  : 'Leave blank to keep the current login password. Fill these only if you want to change it.'}
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">Current password</span>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    className={fieldClass}
                    autoComplete="current-password"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">New password</span>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className={fieldClass}
                    autoComplete="new-password"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">Confirm new password</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className={fieldClass}
                    autoComplete="new-password"
                  />
                </label>
              </div>
            </section>

            {error ? (
              <p className="rounded-2xl border border-[#D98282]/30 bg-[#D98282]/10 px-4 py-3 text-sm text-[#171211]">{error}</p>
            ) : null}
            {message ? (
              <p className="rounded-2xl border border-[#2D6A4F]/20 bg-[#2D6A4F]/10 px-4 py-3 text-sm text-[#171211]">{message}</p>
            ) : null}

            <button
              type="submit"
              disabled={saving || uploading}
              className="min-h-11 rounded-full bg-[#C9A46A] px-6 text-[10px] font-bold uppercase tracking-[0.16em] text-[#171211] disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save settings'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
