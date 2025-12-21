import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

// Use environment variables instead of hardcoded credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        token: { label: '2FA Token', type: 'text', optional: true },
      },
      async authorize(credentials) {
        // Debug: Log what we received (only in development)
        if (process.env.NODE_ENV === 'development') {
          console.log('=== LOGIN ATTEMPT ===');
          console.log('Received email:', credentials?.email);
          console.log('Expected email:', ADMIN_EMAIL);
        }
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          throw new Error('Please provide email and password');
        }

        if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
          console.error('ADMIN_EMAIL or ADMIN_PASSWORD not configured');
          throw new Error('Server configuration error');
        }

        // Direct comparison with environment variables
        const inputEmail = credentials.email.trim().toLowerCase();
        const expectedEmail = ADMIN_EMAIL.toLowerCase();
        const inputPassword = credentials.password;
        const expectedPassword = ADMIN_PASSWORD;

        if (process.env.NODE_ENV === 'development') {
          console.log('Email match:', inputEmail === expectedEmail);
          console.log('Password match:', inputPassword === expectedPassword);
        }

        if (inputEmail === expectedEmail && inputPassword === expectedPassword) {
          console.log('✓ Login successful!');
          return {
            id: '1',
            email: ADMIN_EMAIL,
            name: 'Admin',
            role: 'admin',
          };
        }

        console.log('✗ Login failed - credentials do not match');
        throw new Error('Invalid email or password');
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET 
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })]
      : []
    ),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
