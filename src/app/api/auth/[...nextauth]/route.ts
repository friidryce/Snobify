import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

// Extend the built-in session types
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    error?: string;
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// Extend the built-in JWT types
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
    userId?: string;
  }
}

const handler = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "user-read-email user-read-private playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private", // Add more scopes as needed
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      console.log("JWT Callback Entry:", {
        hasToken: !!token,
        hasAccount: !!account,
        hasProfile: !!profile,
        tokenKeys: Object.keys(token),
      });

      // Initial sign in
      if (account && profile) {
        console.log("Initial token creation:", {
          accessToken: account.access_token?.slice(-10), // Show last 10 chars for security
          expiresAt: new Date(
            account.expires_at ? account.expires_at * 1000 : 0
          ).toISOString(),
          provider: account.provider,
          userId: (profile as any).id, // Spotify profile includes id
        });

        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at
            ? account.expires_at * 1000
            : 0,
          userId: (profile as any).id,
        };
      }

      // Log subsequent token usage
      console.log("Reusing existing token:", {
        accessTokenPresent: !!token.accessToken,
        expiresAt: token.accessTokenExpires
          ? new Date(token.accessTokenExpires).toISOString()
          : "no expiry",
        userId: token.userId,
      });

      // TODO: Currently naive implementation, no check on expiry yet
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      
      if (session.user) {
        session.user.id = token.userId as string;
      }

      // Log session creation
      console.log("Session created:", {
        userEmail: session.user?.email,
        hasAccessToken: !!session.accessToken,
        userId: session.user?.id,
      });

      return session;
    },
  },
}) satisfies NextAuthOptions;

export { handler as GET, handler as POST };
