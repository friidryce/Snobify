'use client';
import { useSession } from "next-auth/react";
import { SpotifyLoginButton } from "@/components/auth/SpotifyLoginButton";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Footer } from "@/components/layout/Footer";
import { useAuthLogger } from "@/hooks/useAuthLogger";

export default function SpotifyLoginPage() {
  const { data: session, status } = useSession();
  useAuthLogger(session);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family:var(--font-geist-sans)] bg-gray-900 text-white">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <h1 className="text-4xl font-bold mb-8 text-white">Snobify</h1>
        
        <div className="flex flex-col items-center gap-6 p-8 rounded-lg border border-gray-700 bg-gray-800 shadow-xl">
          <p className="text-gray-300 text-center max-w-md">
            {status === 'authenticated' 
              ? `Welcome back, ${session.user?.name}!`
              : 'Connect your Spotify account to get started. We\'ll only access your basic profile information.'}
          </p>

          {status === 'authenticated' ? <SignOutButton /> : <SpotifyLoginButton />}

          <p className="text-xs text-gray-400">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
