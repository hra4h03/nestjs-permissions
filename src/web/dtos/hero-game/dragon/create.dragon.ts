import { createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export namespace CreateDragon {
  export const Schema = z
    .object({
      name: z.string().describe("Dragon's name"),
    })
    .strict();

  export class Dto extends createZodDto(Schema) {}

  export const OpenApi = zodToOpenAPI(Schema);
}
