import { z } from 'zod';

export const eventSchema = z.object({
  eventName: z.string().min(1, 'Event name is required'),
  landscapePoster: z.string().url('Landscape poster URL is required'),
  portraitPoster: z.string().url('Portrait poster URL is required'),
  date: z.string(),
  time: z.string().min(1, 'Time is required'),
  duration: z.string().min(1, 'Duration is required'),
  ageLimit: z.string().min(1, 'Age limit is required'),
  language: z.string().min(1, 'Language is required'),
  category: z.string().min(1, 'Category is required'),
  eventType: z.string().min(1, 'Event type is required'),
  venue: z.string().min(1, 'Venue is required'),
  price: z.string().min(1, 'Price is required'),
  description: z.string().min(1, 'Description is required'),
  performers: z.string().min(1, 'Performers are required'),
});

export type EventFormData = z.infer<typeof eventSchema>;