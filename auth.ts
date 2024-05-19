import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            name: z.string().min(1).optional(),
            email: z.string().email(),
            password: z.string().min(6),
            confirmPassword: z.string().min(6).optional(),
          })
          .partial()
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { name, email, password, confirmPassword } =
            parsedCredentials.data;

          if (!email || !password) {
            console.log('Email and password are required.');
            return null;
          }

          const user = await getUser(email);

          if (!user && confirmPassword) {
            // If user doesn't exist and confirmPassword is provided, create a new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await sql<User>`
              INSERT INTO users (name, email, password)
              VALUES (${name ?? null},${email}, ${hashedPassword})
              RETURNING *`;
            return newUser.rows[0];
          }

          if (user) {
            const passwordsMatch = await bcrypt.compare(
              password,
              user.password,
            );
            if (passwordsMatch) return user;
          }
        }
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
