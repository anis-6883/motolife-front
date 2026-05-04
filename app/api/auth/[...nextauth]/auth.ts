import routes from "@/config/routes";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      async authorize(credentials) {
        const permissions = credentials?.permissions ? JSON.parse(credentials.permissions as string) : [];

        return {
          ...credentials,
          permissions,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET!,

  pages: {
    signIn: routes.publicRoutes.adminLogin,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user?.token) {
        token.token = user.token;
      }
      if (user?.role) {
        token.role = user.role;
      }
      if ((user as any)?.permissions) {
        token.permissions = (user as any).permissions;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          ...token,
        },
      };
    },
  },
});
