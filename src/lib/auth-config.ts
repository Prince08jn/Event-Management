import { type AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { authenticateUser, getUserByEmail, createUser } from '@/lib/auth';
import { signInSchema } from '@/lib/schemas';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const validatedCredentials = signInSchema.parse(credentials);
          const user = await authenticateUser(
            validatedCredentials.email,
            validatedCredentials.password
          );
          
          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: `${user.firstName} ${user.lastName}`,
            };
          }
          return null;
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const existingUser = await getUserByEmail(user.email!);
          
          if (!existingUser) {
            // Create a new user for Google sign-in
            const names = user.name?.split(' ') || ['', ''];
            const firstName = names[0] || '';
            const lastName = names.slice(1).join(' ') || '';
            
            await createUser({
              email: user.email!,
              password: '', // Empty password for OAuth users
              firstName,
              lastName,
              countryCode: '+1', // Default values
              phoneNumber: '',
              country: '',
              currentCity: '',
              profilePictureUrl: user.image || undefined,
            });
          }
          return true;
        } catch (error) {
          console.error('Google sign-in error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 900
      },
    },
    state: {
      name: 'next-auth.state',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 900
      },
    },
  },
  // Enable debug only when NEXTAUTH_DEBUG is explicitly set to the string "true".
  // This prevents NextAuth from logging the DEBUG_ENABLED warning when NODE_ENV
  // is development on some hosts where you don't want NextAuth debug output.
  debug: process.env.NEXTAUTH_DEBUG === 'true',
};