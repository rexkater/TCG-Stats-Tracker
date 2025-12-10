import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Build providers array conditionally
const providers = [];

// Add Google if configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

// Add GitHub if configured
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
}

// Always add credentials provider
providers.push(
  Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const username = (credentials.username as string).toLowerCase();
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { username },
          select: {
            id: true,
            username: true,
            email: true,
            password: true,
            isPremium: true,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          isPremium: user.isPremium,
        };
      },
    })
);

export const authConfig = {
  providers,
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.isPremium = (user as any).isPremium;
      }

      // Refresh isPremium from database on session update
      if (trigger === 'update' && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { isPremium: true }
        });
        if (dbUser) {
          token.isPremium = dbUser.isPremium;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.isPremium = token.isPremium as boolean;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        // Handle OAuth sign in
        const email = user.email;
        if (!email) return false;

        // Check if user exists
        let existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (!existingUser) {
          // Create username from email or profile
          const emailParts = email.split('@');
          const emailPrefix = emailParts[0];
          if (!emailPrefix) return false;

          let username = emailPrefix.toLowerCase();

          // Ensure username is unique
          let usernameExists = await prisma.user.findUnique({
            where: { username },
          });

          let counter = 1;
          while (usernameExists) {
            username = `${emailPrefix.toLowerCase()}${counter}`;
            usernameExists = await prisma.user.findUnique({
              where: { username },
            });
            counter++;
          }

          // Create new user
          existingUser = await prisma.user.create({
            data: {
              username,
              email,
              emailVerified: new Date(),
              image: user.image,
            },
          });
        }

        return true;
      }
      return true;
    },
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
} satisfies NextAuthConfig;

