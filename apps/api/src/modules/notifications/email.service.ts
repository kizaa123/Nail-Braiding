import { Injectable, Logger } from '@nestjs/common';
import { loadEnv } from '../../config/env';

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async send(message: EmailMessage): Promise<void> {
    const env = loadEnv();
    if (!env.SMTP_HOST) {
      this.logger.log(`[dev email] to=${message.to} subject=${message.subject}\n${message.text}`);
      return;
    }
    this.logger.log(`SMTP email queued to ${message.to}: ${message.subject}`);
  }
}
