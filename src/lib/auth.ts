import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'College ID',
      credentials: {
        collegeId: { label: 'College ID', type: 'text', placeholder: '2024CS101' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.collegeId || !credentials?.password) {
          return null;
        }

        const id = credentials.collegeId.trim();
        const pass = credentials.password;

        // 1. Built-in instant demo accounts
        if (id === '2024CS101' && pass === 'student123') {
          return {
            id: 'user_rahul_demo',
            name: 'Rahul Sharma (Student)',
            email: 'rahul@college.edu',
            role: 'STUDENT',
            collegeId: '2024CS101',
          };
        }

        if (id === 'ADMIN001' && pass === 'admin123') {
          return {
            id: 'user_admin_demo',
            name: 'Canteen Supervisor',
            email: 'admin@canteen.edu',
            role: 'ADMIN',
            collegeId: 'ADMIN001',
          };
        }

        // 2. Check Database if available
        try {
          const user = await prisma.user.findUnique({
            where: { collegeId: id },
          });

          if (user) {
            const isValid = await bcrypt.compare(pass, user.passwordHash);
            if (isValid) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                collegeId: user.collegeId,
              };
            }
          }
        } catch (dbError) {
          console.warn('DB lookup skipped on serverless:', dbError);
        }

        // 3. Fallback: Auto-provision student session for custom entered Roll Numbers!
        if (id.length >= 3) {
          return {
            id: `student_${id}`,
            name: `Student (${id})`,
            email: `${id.toLowerCase()}@college.edu`,
            role: 'STUDENT',
            collegeId: id,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.collegeId = (user as any).collegeId;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).collegeId = token.collegeId;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'campusbite-jwt-secret-production-key-2026-32chars',
};
