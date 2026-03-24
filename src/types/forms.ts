import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { EventFormData } from './schema';

export interface FormSectionProps {
  register: UseFormRegister<EventFormData>;
  errors: FieldErrors<EventFormData>;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface FormSectionWithLocationProps extends FormSectionProps {
  setSelectedLocation: (location: Location) => void;
}