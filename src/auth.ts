import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const allowedDomain = process.env.AUTH_DOMAIN ?? "techrover.com";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const isLoginPage = nextUrl.pathname === "/login";

      if (isLoggedIn && isLoginPage) {
        return Response.redirect(new URL("/", nextUrl));
      }
      return isLoggedIn;
    },

    signIn({ user }) {
      return user.email?.endsWith(`@${allowedDomain}`) ?? false;
    },
  },
});
