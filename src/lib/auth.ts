import { betterAuth } from "better-auth";

// Note: better-auth requires a database adapter
// For now, this is a basic configuration. You'll need to add a database adapter
// such as drizzleAdapter, prismaAdapter, or another supported adapter
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://127.0.0.1:3000",
  basePath: "/api/auth",
  socialProviders: {
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      scope: [
        "user-read-email",
        "user-read-private",
        "playlist-read-private",
        "playlist-read-collaborative",
        "playlist-modify-public",
        "playlist-modify-private",
      ],
    },
  },
});

export type Session = typeof auth.$Infer.Session;

