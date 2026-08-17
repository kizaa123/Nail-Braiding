'use client';

import { useEffect, useRef, useState } from 'react';
import { CatalogImage } from '@/components/ui/catalog-image';
import { useStudioSession } from '@/hooks/use-studio-session';
import { studioRequest, requestError } from '@/lib/studio-http';
import {
  formatStudioHours,
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-[#EADBCE] py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A99B95]">{label}</p>
      <p className="text-sm font-medium text-[#171211] sm:max-w-[62%] sm:text-right">{value || '—'}</p>
    </div>
  );
}

export default function AdminSettingsPage() {
  const { session } = useStudioSession();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState<StudioPublicProfile>(normalizeStudioProfile());
  const [draft, setDraft] = useState<StudioPublicProfile>(normalizeStudioProfile());
  const [editing, setEditing] = useState(false);
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
        setSaved(next);
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

  const shown = editing ? draft : saved;

  const patch = (update: Partial<StudioPublicProfile>) => {
    setDraft((current) => ({ ...current, ...update }));
  };

  const startEdit = () => {
    setDraft(saved);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setMessage('');
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(saved);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setMessage('');
    setEditing(false);
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
        openTime: draft.openTime,
        closeTime: draft.closeTime,
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
    setSaved(next);
    setDraft(next);
    setHasPassword(Boolean(result.data.settings.hasPassword));
    saveCachedStudioProfile(next);
    if (session) {
      saveStudioSession({ ...session, email: next.email });
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setEditing(false);
    setMessage('Settings saved. Phone, photo, and login details are live for the shop.');
  };

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <div className="border-b border-[#EADBCE] pb-6">
        <h2 className="font-display text-4xl font-normal text-[#171211]">
          Studio <span className="font-script text-[#D98282]">settings.</span>
        </h2>
        <p className="mt-2 text-sm text-[#A99B95]">
          Profile and shop details used on the public site, WhatsApp, and login.
        </p>
      </div>

      {!ready ? (
        <p className="mt-8 text-sm text-[#A99B95]">Loading settings…</p>
      ) : (
        <div className="mt-8 space-y-5">
          <section className="rounded-2xl border border-[#EADBCE] bg-white p-6 shadow-[0_8px_24px_rgba(23,18,17,0.04)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D98282]">Profile</p>
            <div className="mt-5 flex flex-col items-center text-center">
              <div className="relative h-28 w-28 overflow-hidden rounded-full bg-[#F7F1EA]">
                {shown.profileImageUrl ? (
                  <CatalogImage src={shown.profileImageUrl} alt="" className="object-cover" sizes="112px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-[#A99B95]">No photo</div>
                )}
              </div>
              <h3 className="mt-4 font-display text-2xl text-[#171211]">{shown.ownerName || 'Studio owner'}</h3>
              <p className="mt-1 text-sm text-[#A99B95]">{shown.email}</p>
              {editing ? (
                <div className="mt-4 flex w-full flex-col gap-2">
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
                    className="min-h-11 rounded-full bg-[#171211] text-[10px] font-bold uppercase tracking-[0.16em] text-white"
                  >
                    {uploading ? 'Uploading…' : 'Change photo'}
                  </button>
                  {draft.profileImageUrl ? (
                    <button
                      type="button"
                      onClick={() => patch({ profileImageUrl: '' })}
                      className="min-h-11 rounded-full border border-[#EADBCE] text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]"
                    >
                      Remove photo
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-2xl border border-[#EADBCE] bg-white p-6 shadow-[0_8px_24px_rgba(23,18,17,0.04)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D98282]">Saved information</p>
                <p className="mt-1 text-sm text-[#A99B95]">
                  {editing ? 'Update the details, then save.' : 'These details are live for the shop.'}
                </p>
              </div>
              {!editing ? (
                <button
                  type="button"
                  onClick={startEdit}
                  className="shrink-0 rounded-full bg-[#171211] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white"
                >
                  Edit
                </button>
              ) : null}
            </div>

            {!editing ? (
              <div className="mt-4">
                <InfoRow label="Owner name" value={saved.ownerName} />
                <InfoRow label="Login email" value={saved.email} />
                <InfoRow label="Phone number" value={saved.displayPhone} />
                <InfoRow label="WhatsApp number" value={toWhatsAppDigits(saved.displayPhone)} />
                <InfoRow label="Location" value={saved.location} />
                <InfoRow label="Hours" value={formatStudioHours(saved.openTime, saved.closeTime)} />
                <InfoRow label="Password" value={hasPassword ? 'Custom password set' : 'Default studio password'} />
              </div>
            ) : (
              <form
                className="mt-5 space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  void save();
                }}
              >
                <label className="block">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">Owner name</span>
                  <input
                    value={draft.ownerName}
                    onChange={(event) => patch({ ownerName: event.target.value })}
                    className={fieldClass}
                    placeholder="Studio owner"
                  />
                </label>
                <label className="block">
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
                <label className="block">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">Location</span>
                  <input
                    value={draft.location}
                    onChange={(event) => patch({ location: event.target.value })}
                    className={fieldClass}
                    placeholder="Cape Coast, UCC Campus"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">Opens at</span>
                    <input
                      type="time"
                      value={draft.openTime}
                      onChange={(event) => patch({ openTime: event.target.value })}
                      className={fieldClass}
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">Finishes at</span>
                    <input
                      type="time"
                      value={draft.closeTime}
                      onChange={(event) => patch({ closeTime: event.target.value })}
                      className={fieldClass}
                    />
                  </label>
                </div>

                <div className="border-t border-[#EADBCE] pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">Password</p>
                  <p className="mt-1 text-sm text-[#A99B95]">
                    {hasPassword
                      ? 'A custom studio password is already set. Enter the current one to change it.'
                      : 'Leave blank to keep the current login password.'}
                  </p>
                  <label className="mt-3 block">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">Current password</span>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      className={fieldClass}
                      autoComplete="current-password"
                    />
                  </label>
                  <div className="mt-3 grid grid-cols-2 gap-3">
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
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]">Confirm</span>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className={fieldClass}
                        autoComplete="new-password"
                      />
                    </label>
                  </div>
                </div>

                {error ? (
                  <p className="rounded-xl border border-[#D98282]/30 bg-[#D98282]/10 px-4 py-3 text-sm text-[#171211]">{error}</p>
                ) : null}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="min-h-11 flex-1 rounded-full border border-[#EADBCE] text-[10px] font-bold uppercase tracking-[0.16em] text-[#7A6E68]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="min-h-11 flex-1 rounded-full bg-[#C9A46A] text-[10px] font-bold uppercase tracking-[0.16em] text-[#171211] disabled:opacity-60"
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </form>
            )}
          </section>

          {message && !editing ? (
            <p className="rounded-2xl border border-[#2D6A4F]/20 bg-[#2D6A4F]/10 px-4 py-3 text-sm text-[#171211]">{message}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
