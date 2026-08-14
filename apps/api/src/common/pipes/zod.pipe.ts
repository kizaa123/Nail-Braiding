import { PipeTransform } from '@nestjs/common';
import type { ZodType } from 'zod';
import { Errors } from '../errors';

export class ZodPipe<T> implements PipeTransform {
  constructor(private readonly schema: ZodType<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const details: Record<string, string> = {};
      for (const issue of result.error.issues) {
        details[issue.path.join('.') || 'root'] = issue.message;
      }
      throw Errors.validation('Invalid request', details);
    }
    return result.data;
  }
}
