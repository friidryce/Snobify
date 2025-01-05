export default function SpotifyLoginPage() {
  return (
    // Main container with CSS Grid layout: header(20px) - main content - footer(20px)
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family:var(--font-geist-sans)] bg-gray-900 text-white">
      {/* Main content section */}
      <main className="flex flex-col gap-8 row-start-2 items-center">
        {/* App title */}
        <h1 className="text-4xl font-bold mb-8 text-white">Snobify</h1>
        
        {/* Login card container */}
        <div className="flex flex-col items-center gap-6 p-8 rounded-lg border border-gray-700 bg-gray-800 shadow-xl">
          {/* Description text */}
          <p className="text-gray-300 text-center max-w-md">
            Connect your Spotify account to get started. We'll only access your basic profile information.
          </p>

          {/* Spotify OAuth login button */}
          <a
            href="/api/auth/login"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-white font-medium transition-colors"
          >
            {/* Spotify logo SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Continue with Spotify
          </a>

          {/* Terms acceptance notice */}
          <p className="text-xs text-gray-400">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </main>

      {/* Footer with legal links */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-gray-400">
        <a 
          href="/privacy"
          className="hover:text-gray-200 transition-colors"
        >
          Privacy Policy
        </a>
        <span>•</span>
        <a
          href="/terms"
          className="hover:text-gray-200 transition-colors"
        >
          Terms of Service
        </a>
        <span>•</span>
        <a
          href="/help"
          className="hover:text-gray-200 transition-colors"
        >
          Help Center
        </a>
      </footer>
    </div>
  );
}
