import { Injectable } from '@nestjs/common';
import { loadEnv } from '../../config/env';
import { Errors } from '../../common/errors';
import { toE164Digits } from '../../common/utils';

export interface WhatsAppMessageInput {
  professionalName: string;
  phoneE164: string;
  reference: string;
  serviceName: string;
  scheduledAt: Date;
  customerFirstName: string;
  timezone?: string;
}

@Injectable()
export class WhatsAppService {
  buildClickToChatUrl(input: WhatsAppMessageInput): string {
    const env = loadEnv();
    if (!/^\+[1-9]\d{7,14}$/.test(input.phoneE164)) {
      throw Errors.validation('Professional WhatsApp number is invalid.');
    }
    const digits = toE164Digits(input.phoneE164);
    const date = new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      timeZone: input.timezone ?? 'Africa/Accra',
    }).format(input.scheduledAt);
    const time = new Intl.DateTimeFormat('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: input.timezone ?? 'Africa/Accra',
    }).format(input.scheduledAt);

    const message = [
      `Hello ${input.professionalName} 👋🏾`,
      '',
      'I would like to book an appointment.',
      '',
      `Booking Reference: ${input.reference}`,
      '',
      'Service:',
      input.serviceName,
      '',
      'Date:',
      date,
      '',
      'Time:',
      time,
      '',
      'Customer:',
      input.customerFirstName,
      '',
      'Please confirm my appointment.',
    ].join('\n');

    return `${env.WHATSAPP_CLICK_TO_CHAT_BASE}/${digits}?text=${encodeURIComponent(message)}`;
  }
}
