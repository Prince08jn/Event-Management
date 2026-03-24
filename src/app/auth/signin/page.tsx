import { SignInForm } from '@/components/auth/signin-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your rkade account to access campus events, entertainment activities, and connect with your university community.',
  openGraph: {
    title: 'Sign In to rkade',
    description: 'Access your campus events and entertainment platform account.',
  },
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <SignInForm />
      </div>
    </div>
  );
}