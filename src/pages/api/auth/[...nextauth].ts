import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";
import { redirect } from "next/dist/server/api-utils/index.js";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    jwt({token, user}){
      if(user){
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role= user.role;
      }
      return session;
    },
  },      
    
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
   
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  
  ],
  pages: {
    signIn: "/auth/signin",
  },

};

export default NextAuth(authOptions);
