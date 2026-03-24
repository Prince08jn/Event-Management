export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  phoneNumber: string;
  country: string;
  currentCity: string;
  birthday?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  profilePictureUrl?: string;
  address?: {
    line1?: string;
    line2?: string;
    landmark?: string;
    pinCode?: string;
    city?: string;
    state?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  phoneNumber: string;
  country: string;
  currentCity: string;
  birthday?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  profilePictureUrl?: string;
  address?: {
    line1?: string;
    line2?: string;
    landmark?: string;
    pinCode?: string;
    city?: string;
    state?: string;
  };
}

export interface SignInInput {
  email: string;
  password: string;
}