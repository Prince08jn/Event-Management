import { SignUpForm } from '@/components/auth/signup-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Join rkade today! Create your account to discover campus events, entertainment activities, and connect with your university community.',
  openGraph: {
    title: 'Join rkade - Campus Events Platform',
    description: 'Create your account to access campus events and entertainment activities.',
  },
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
        <SignUpForm />
      </div>
    </div>
  );
}