import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      // Add any additional Spotify-specific fields you need
    };
    // Add any additional session properties
  }
} 