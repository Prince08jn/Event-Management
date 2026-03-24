# rkade - Fully Modularized Web App

A modern, fully modularized web application built with Next.js 15, featuring complete authentication system with email/password and OAuth support, PostgreSQL/Supabase database integration, and a comprehensive user schema.

## 🚀 Features

### Authentication System
- **Email & Password Authentication** - Secure login with hashed passwords
- **OAuth Integration** - Google Sign-In support
- **Multi-step Registration** - User-friendly signup process
- **Session Management** - JWT-based sessions with NextAuth.js
- **Protected Routes** - Automatic redirection for authenticated routes

### User Management
- **Comprehensive User Schema** including:
  - Personal Information (Name, Contact, Email)
  - Location Data (Country, Current City, Address)
  - Optional Fields (Birthday, Gender, Profile Picture)
  - Address Details (Line 1, Line 2, Landmark, Pin, City, State)

### Modern Tech Stack
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **NextAuth.js** for authentication
- **Supabase/PostgreSQL** for database
- **Zod** for schema validation
- **React Hook Form** for form handling

## 📁 Project Structure

```
src/
├── app/
│   ├── api/auth/          # Authentication API routes
│   ├── auth/              # Auth pages (signin, signup)
│   ├── dashboard/         # Protected dashboard
│   └── layout.tsx         # Root layout with providers
├── components/
│   ├── auth/              # Authentication components
│   │   ├── signin-form.tsx
│   │   ├── signup-form.tsx
│   │   └── auth-provider.tsx
│   └── ui/                # Reusable UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       └── card.tsx
├── lib/
│   ├── auth.ts            # Authentication utilities
│   ├── schemas.ts         # Zod validation schemas
│   ├── supabase.ts        # Supabase client configuration
│   └── utils.ts           # Utility functions
└── types/
    └── user.ts            # TypeScript type definitions
```

## 🛠 Setup Instructions

### 1. Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 2. Database Setup

1. Create a new Supabase project
2. Run the SQL commands from `database-schema.sql` in your Supabase SQL editor
3. This will create the `users` table with all required fields and proper indexing

### 3. Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth credentials
5. Add your domain to authorized origins
6. Add the credentials to your environment variables

### 4. Install Dependencies & Run

```bash
npm install
npm run dev
```

## 🔐 Authentication Flow

### Sign Up Process
1. **Step 1**: Email, password, and password confirmation
2. **Step 2**: Personal information (name, phone, location, etc.)
3. **Validation**: Real-time form validation with Zod schemas
4. **Storage**: Secure password hashing and user creation

### Sign In Options
- **Email/Password**: Traditional authentication
- **Google OAuth**: One-click sign-in with Google
- **Session Management**: Automatic session handling

## 📊 Database Schema

The user table includes comprehensive fields:

```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  country_code VARCHAR(10) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  current_city VARCHAR(100) NOT NULL,
  birthday DATE,
  gender VARCHAR(20),
  profile_picture_url TEXT,
  address JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

## 🎨 UI Components

### Reusable Components
- **Button** - Multiple variants (default, outline, ghost, destructive)
- **Input** - Styled form inputs with focus states
- **Label** - Form labels with proper accessibility
- **Select** - Dropdown selects
- **Card** - Container components with header, content, footer

### Authentication Components
- **SignInForm** - Complete sign-in form with validation
- **SignUpForm** - Multi-step registration form
- **AuthProvider** - Session provider wrapper

## 🚦 Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in your values
3. Set up your Supabase database using the provided schema
4. Install dependencies: `npm install`
5. Run the development server: `npm run dev`
6. Visit `http://localhost:3000` to see the app

## 🗃 Supabase Migrations

This repo currently uses a single `database-schema.sql`. To move to Supabase CLI migrations:

1. Install Supabase CLI (see docs)
2. Initialize:
   - `supabase init`
3. Link to your project:
   - `supabase link --project-ref <your-project-ref>`
4. Create an initial migration:
   - `supabase migration new init_schema`
   - Copy the contents of `database-schema.sql` into `supabase/migrations/<timestamp>_init_schema.sql`
5. Apply locally:
   - `supabase start`
   - `supabase migration up`
6. Push to remote:
   - `supabase db push`

Going forward, add new SQL changes as separate files under `supabase/migrations/` instead of editing `database-schema.sql` directly.

## 📝 Usage Examples

### Protected Route Example
```tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/auth/signin');
  }, [session, status, router]);

  if (!session) return null;

  return <div>Protected content</div>;
}
```

### Form Validation Example
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '@/lib/schemas';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(signInSchema),
});
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- NextAuth.js for authentication
- Tailwind CSS for styling
- All the open-source contributors

---

Built with ❤️ using modern web technologies
