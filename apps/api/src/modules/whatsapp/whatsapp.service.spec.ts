import { WhatsAppService } from './whatsapp.service';

describe('WhatsAppService', () => {
  const service = new WhatsAppService();

  it('builds a click-to-chat URL without exposing extra personal data', () => {
    const url = service.buildClickToChatUrl({
      professionalName: 'DEMO — Amara Beauty Studio',
      phoneE164: '+233200000010',
      reference: 'NB-48291',
      serviceName: 'Medium Knotless Braids',
      scheduledAt: new Date('2026-08-22T14:00:00.000Z'),
      customerFirstName: 'Jane',
      timezone: 'UTC',
    });

    expect(url.startsWith('https://wa.me/233200000010?text=')).toBe(true);
    const text = decodeURIComponent(url.split('text=')[1] ?? '');
    expect(text).toContain('NB-48291');
    expect(text).toContain('Medium Knotless Braids');
    expect(text).toContain('Jane');
    expect(text).not.toContain('@');
    expect(text).not.toContain('password');
  });

  it('rejects invalid phone numbers', () => {
    expect(() =>
      service.buildClickToChatUrl({
        professionalName: 'Studio',
        phoneE164: '0200000010',
        reference: 'NB-11111',
        serviceName: 'Gel',
        scheduledAt: new Date(),
        customerFirstName: 'Ama',
      }),
    ).toThrow();
  });
});
