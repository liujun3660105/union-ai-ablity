import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { getServerSession, type DefaultSession, type NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';
import { compare } from 'bcrypt';

import CredentialProvider from 'next-auth/providers/credentials';
// import {api} from '@/trpc/server';

// import { env } from "@/env.mjs";
import { db } from '@/server/db';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user'];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 3000,
  },
  callbacks: {
    jwt({ token, user }) {
      console.log('jwt', token, user);
      if (user) {
        token.user = user;
      }
      return token;
    },

    session({ session, token, user }) {
      console.log('session', session, token, user);

      if (!session.user.id) {
        //@ts-ignore
        session.user.id = token.sub;
      }

      // session.user = token.user;
      return session;
    },
    // async redirect({ url, baseUrl }) {
    //   console.log('url', url, baseUrl);
    //   //   return baseUrl;
    //   return Promise.resolve(url);
    // },
  },
  secret: process.env.NEXTAUTH_SECRET,

  adapter: PrismaAdapter(db),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),

    CredentialProvider({
      name: 'Credentials',
      credentials: {
        // username: {
        //   label: 'username',
        //   type: 'text',
        //   placeholder: 'input your username',
        // },
        // password: {
        //   label: 'password',
        //   type: 'text',
        //   placeholder: 'input your password',
        // },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;
        console.log('credentials', credentials);
        const user = await db.user.findFirst({
          where: {
            AND: [{ username: credentials.username }],
          },
        });
        if (!user) return null;
        const passwordCorrect = await compare(credentials.password, user.password);
        if (passwordCorrect) {
          return {
            id: user.id,
            name: user.username,
          };
          //   return user;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    // signOut: '/auth/signout',
    // error: '/auth/error',
    // verifyRequest: '/auth/verify-request',
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (req: any, res: any) => getServerSession(req, res, authOptions);
