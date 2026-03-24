import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import { CreateUserInput, User } from '@/types/user';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createUser(userData: CreateUserInput): Promise<User | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const hashedPassword = await hashPassword(userData.password);
    
    const { address } = userData;

const { data, error } = await supabaseAdmin
  .from('users')
  .insert([
    {
      email: userData.email,
      password: hashedPassword,
      first_name: userData.firstName,
      last_name: userData.lastName,
      country_code: userData.countryCode,
      phone_number: userData.phoneNumber,
      country: userData.country,
      current_city: userData.currentCity,
      birthday: userData.birthday,
      gender: userData.gender,
      profile_picture_url: userData.profilePictureUrl,

      // ✅ FIX: Store address as JSONB
      address: address
        ? {
            line1: address.line1,
            line2: address.line2,
            landmark: address.landmark,
            pinCode: address.pinCode,
            city: address.city,
            state: address.state,
          }
        : null,
    },
  ])
  .select()
  .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      countryCode: data.country_code,
      phoneNumber: data.phone_number,
      country: data.country,
      currentCity: data.current_city,
      birthday: data.birthday ? new Date(data.birthday) : undefined,
      gender: data.gender,
      profilePictureUrl: data.profile_picture_url,
      address: data.address,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      countryCode: data.country_code,
      phoneNumber: data.phone_number,
      country: data.country,
      currentCity: data.current_city,
      birthday: data.birthday ? new Date(data.birthday) : undefined,
      gender: data.gender,
      profilePictureUrl: data.profile_picture_url,
      address: data.address,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return null;
    }

    const isValidPassword = await verifyPassword(password, data.password);
    if (!isValidPassword) {
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      countryCode: data.country_code,
      phoneNumber: data.phone_number,
      country: data.country,
      currentCity: data.current_city,
      birthday: data.birthday ? new Date(data.birthday) : undefined,
      gender: data.gender,
      profilePictureUrl: data.profile_picture_url,
      address: data.address,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
}