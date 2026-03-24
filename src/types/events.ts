import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { EventFormData } from './schema';

export interface FormSectionBaseProps {
  register: UseFormRegister<EventFormData>;
  errors: FieldErrors<EventFormData>;
}

export interface FormSectionWithFileProps extends FormSectionBaseProps {
  onFileChange: (field: string, value: string) => void;
}

export interface EventResponse {
  id: string;
  event_name: string;
  slug: string;
  landscape_poster: string;
  portrait_poster: string;
  date: string | null;
  time: string;
  duration: string;
  age_limit: string;
  event_type: string;
  subtype_slug?: string;
  language: string;
  category: string;
  venue: string;
  price: string;
  description: string;
  performers: string;
  creator_email: string;
  created_at: string;
  updated_at: string;
}

export interface BookingResponse {
  id: string;
  event_id: string;
  user_email: string;
  quantity: number;
  amount_paise: number;
  status: 'pending' | 'paid' | 'confirmed' | 'cancelled';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  created_at: string;
  updated_at: string;
  event?: EventResponse;
}