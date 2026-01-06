import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL
});

export const getSpotifyToken = async () => {
    const { data } = await authClient.getAccessToken({
        providerId: "spotify"
      })
    return data?.accessToken;
};
export const { signIn, signOut, signUp, useSession } = authClient;
