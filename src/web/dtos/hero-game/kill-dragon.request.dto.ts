import { z } from 'nestjs-zod/z';
import { createZodDto, zodToOpenAPI } from 'nestjs-zod';

export namespace KillDragonRequest {
  export const Schema = z
    .object({
      dragonId: z.number(),
      heroId: z.number(),
    })
    .strict();

  export class Dto extends createZodDto(Schema) {}

  export const OpenApi = zodToOpenAPI(Schema);
}
