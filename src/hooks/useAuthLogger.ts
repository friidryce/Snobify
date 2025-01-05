import { useEffect } from 'react';
import { Session } from 'next-auth';

export function useAuthLogger(session: Session | null) {
  useEffect(() => {
    if (session?.user) {
      console.log("Logged in successfully as:", session.user);
    }
  }, [session]);
} 