import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

// Admin credentials - your login details
const ADMIN_EMAIL = 'amahmad6468@gmail.com';
const ADMIN_PASSWORD = 'Great@2786';

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
        // Debug: Log what we received
        console.log('=== LOGIN ATTEMPT ===');
        console.log('Received email:', credentials?.email);
        console.log(
          'Received password:',
          credentials?.password ? '[HIDDEN]' : 'empty'
        );
        console.log('Expected email:', ADMIN_EMAIL);

        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        // Direct comparison with hardcoded values
        const inputEmail = credentials.email.trim().toLowerCase();
        const expectedEmail = ADMIN_EMAIL.toLowerCase();
        const inputPassword = credentials.password;
        const expectedPassword = ADMIN_PASSWORD;

        console.log(
          'Email comparison:',
          inputEmail,
          '===',
          expectedEmail,
          ':',
          inputEmail === expectedEmail
        );
        console.log('Password comparison:', inputPassword === expectedPassword);

        if (
          inputEmail === expectedEmail &&
          inputPassword === expectedPassword
        ) {
          console.log('✓ Login successful!');
          return {
            id: '1',
            email: ADMIN_EMAIL,
            name: 'Admin',
            role: 'admin',
          };
        }

        console.log('✗ Login failed - credentials do not match');
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
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
    maxAge: 15 * 60, // 15 minutes
  },
  jwt: {
    maxAge: 15 * 60, // 15 minutes
  },
  secret: process.env.NEXTAUTH_SECRET,
};
