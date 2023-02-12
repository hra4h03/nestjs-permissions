import { createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export namespace Login {
  export const Schema = z
    .object({
      username: z.string().describe("Dragon's name"),
      password: z
        .password()
        .atLeastOne('digit')
        .atLeastOne('lowercase')
        .atLeastOne('uppercase')
        .describe('User password'),
    })
    .strict();
  export class Dto extends createZodDto(Schema) {}
  export const OpenApi = zodToOpenAPI(Schema);
}
