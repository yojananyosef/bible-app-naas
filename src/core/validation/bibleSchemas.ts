import { z } from 'zod';

export const MessageSchema = z.object({
    id: z.string(),
    speaker: z.string(),
    text: z.string(),
    verse: z.number(),
    isSectionTitle: z.boolean().optional(),
});

export const ChapterDataSchema = z.object({
    book: z.string(),
    chapter: z.number(),
    title: z.string(),
    messages: z.array(MessageSchema),
});

export type ValidatedChapterData = z.infer<typeof ChapterDataSchema>;
